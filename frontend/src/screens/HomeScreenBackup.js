import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map, { Marker, Popup } from "react-map-gl";
import { Col, Row, Carousel, Image, NavLink } from 'react-bootstrap'
import './HomeScreen.css'
import { getStoresAction } from '../store/actions/getStoresAction'

// import styled from "styled-components";
// import InputField from "./inputField";

export default function HomeScreen() {

  const [viewState, setViewState] = useState({
    latitude: 46.738436, 
    longitude: 8.082641,
    zoom: 7.3
  });

  const [selectedStore, setSelectedStore] = useState(null)
  const dispatch = useDispatch()
  const stores = useSelector( state => state.storesReducer.stores)

  useEffect(() => {
    dispatch(getStoresAction())
  }, [dispatch])

  return (
    <>
    <div>
    <Carousel pause='hover' className='bg-dark'>
      {stores.map((store) => (
        <Carousel.Item style={{ width:'40vw', height:'40vh' }} key={store.id}>
          <NavLink to={`/product/${store.id}`}>
            <Image src={store.image} alt={store.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2>
                {store.name} (${store.address})
              </h2>
            </Carousel.Caption>
          </NavLink>
        </Carousel.Item>
      ))}
    </Carousel>
      <Row>
      <Col className="m-5">
      <Map
        {...viewState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v10"
        style={{ width: "auto",height: "60vh"}}
        onMove={evt => setViewState(evt.viewState)}
      >
        {stores.map((store, index) => (
          <Marker
            key={index}
            latitude={store.latitude}
            longitude={store.longitude}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedStore(store);
              }}
            >
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </Marker>
        ))}

        {selectedStore ? (
          <Popup
            latitude={selectedStore.latitude}
            longitude={selectedStore.longitude}
            closeOnClick={false} 
            onClose={() => {
              setSelectedStore(null);
            }}
          >
            <img src={selectedStore.image} alt="Store Icon" style={{ width:'10vw'}}/>
            <h5>{selectedStore.name}</h5>
            <p><strong>Address: </strong>{selectedStore.address}</p>
            <p><strong>Phone: </strong>{selectedStore.phone}</p>
            <a href="/store">Go to the Store Page</a>


          </Popup>
        ) : null } 
      </Map>
      </Col>
      </Row>
    </div>
    </>
  );
}

// const Wrapper = styled.div`
//   background: #1a1433;
//   height: 40vh;
//   margin: 0 auto;
// `;

// const ContentWrapper = styled.div`
//   padding: 15px 0;
//   display: grid;
//   justify-content: center;
//   align-items: center;
// `;

// const Title = styled.h1`
//   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
//     Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
//   font-style: normal;
//   font-weight: bold;
//   font-size: 40px;
//   line-height: 48px;
//   color: #ffffff;
//   text-align: center;
// `;