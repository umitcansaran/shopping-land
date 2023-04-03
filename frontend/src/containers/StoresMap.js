import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "react-map-gl";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "./map.css";
import { search } from "../store/actions/searchAction";
import { listStores } from "../store/actions/storeActions";
import { listProductCategories } from "../store/actions/categoriesActions";
import { listProfiles } from "../store/actions/userActions";
import { Popup, Marker } from 'react-map-gl';
import SearchBox from "../components/SearchBox";

function StoresMap() {
  
  const [viewState, setViewState] = useState({
    latitude: 46.826908,
    longitude: 7.944633,
    zoom: 7.7,
  });
  const [value, setValue] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  
  const dispatch = useDispatch();

  const { stores } = useSelector((state) => state.storeList);
  const { categories } = useSelector((state) => state.productCategories);

  useEffect(() => {
    dispatch(listProfiles());
    dispatch(listStores());
    dispatch(listProductCategories());
  }, [dispatch]);

  const filterOptionHandler = (event) => {
    dispatch(search({ type: "stores", searchString: event.target.value }));
  };

  return (
    <>
      <Row style={{ backgroundColor: "#495b7a", height: "3rem" }}>
        <Col>
          <SearchBox
          searchProps={{ type: "map" }}
            value={value}
            setValue={setValue}
            type="map"
            placeholder="Search for a retailer name.."
            color="#1e478a"
            width="60%"
          />
        </Col>
        <Col className="align-self-center">
          <Form.Select
            className="d-flex justify-content-center"
            onChange={filterOptionHandler}
            aria-label="Default select example"
            style={{ width: "60%", height: "2.2rem", margin: "auto" }}
          >
            <option>Filter by Category</option>
            {categories.map((category) => {
              return <option>{category.name}</option>;
            })}
          </Form.Select>
        </Col>
        <Map
          {...viewState}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
          style={{ height: '90vh', width: '100vw' }}
          onMove={(evt) => setViewState(evt.viewState)}
        >
          {stores && stores.map((store, index) => {
            return (
              <Marker
                key={index}
                latitude={store.latitude}
                longitude={store.longitude}
              >
                { store.owner_profile[0] && (
                <button
                  className="marker-btn"
                  onClick={() => {
                    setSelectedStore(store);
                  }}
                >
                  <img
                    src={store.owner_profile[0].image}
                    alt="Store Icon"
                    style={{ width: "auto", height: "13px" }}
                  />
                </button>
                )}

          {selectedStore ? (
            <Popup
              latitude={selectedStore.latitude}
              longitude={selectedStore.longitude}
              closeOnClick={false} 
              closeButton={true}
            onClose={() => {
              setSelectedStore(null);
            }}
          
            >
            <div className="map-store-container">
            <h4 className="text-center mt-1" style={{ margin:'0', padding:'0' }}>{selectedStore.owner_name}</h4>
            <h5 className="text-center mt-1" >{selectedStore.name}</h5>
              <div className="map-store-image-container">
            <img src={selectedStore.image} alt="Store Icon" className="map-store-image" style={{ width:'13.3rem'}}/>

              </div>

              </div>
            <p style={{ fontSize:'0.75rem' }}><strong>Address: </strong>{selectedStore.address}</p>
            <strong><p className="text-center">Go to <a href={`#/seller/${selectedStore.owner}`}>{selectedStore.owner_name}</a>'s page</p></strong>
            </Popup>
          ) : null}
              </Marker>
            );
          })}
        </Map>
      </Row>
    </>
  );
}

export default StoresMap;
