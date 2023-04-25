import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "react-map-gl";
import { Col, Container, Form, Nav, Row } from "react-bootstrap";
import "./index.css";
import { search } from "../../store/actions/searchAction";
import { Popup, Marker } from "react-map-gl";
import Loader from "../../components/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { STORE_LIST_RESET } from "../../store/constants/storeConstants";
import SearchBox from "../../components/SearchBox";

export default function StoresMap() {

  let zoomNumber
const isMobile = window.innerWidth < 991 ? zoomNumber = 6.5 : zoomNumber = 8.2 

  const [value, setValue] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 46.826908,
    longitude: 7.944633,
    zoom: zoomNumber,
  });

  const { stores: searchResult } = useSelector((state) => state.storeList);

  const { data: dataResult, isLoading: loadingStores } = useQuery(
    ["stores", filter],
    () =>
      axios
        .get(`/api/search/?type=stores&search_string=${filter}`)
        .then((res) => res.data)
  );

  const { data: profiles, isLoading: loadingProfiles } = useQuery(
    ["profiles"],
    () => axios.get("/api/profiles/").then((res) => res.data)
  );

  const { data: categories } = useQuery(["product-categories"], () =>
    axios.get("/api/product-categories/").then((res) => res.data)
  );

  let stores;
  if (value.length > 0) {
    stores = searchResult;
  } else {
    stores = dataResult;
  }

  return (
    <>
      <Container fluid>
        <SearchBox
          searchProps={{ type: "map" }}
          actionType="STORE_LIST_RESET"
          value={value}
          setValue={setValue}
          placeholder="Search for an id, brand or name.. "
        />
        <Row>
          <Nav className="justify-content-evenly home-categories-bar">
            {categories?.map((category) => {
              return (
                <Nav.Item key={category.id}>
                  <Nav.Link
                    className="home-categories-link"
                    onClick={() => setFilter(category.name)}
                  >
                    {category.name}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </Row>
        <Row className="map">
          <Map
            {...viewState}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v11"
            onMove={(evt) => setViewState(evt.viewState)}
          >
            {loadingStores || loadingProfiles ? (
              <Loader />
            ) : (
              stores?.map((store, index) => {
                const profile = profiles.find(
                  (profile) => profile.name === store.owner_name
                );
                return (
                  <Marker
                    key={index}
                    latitude={store.latitude}
                    longitude={store.longitude}
                  >
                    {profile && (
                      <button
                        className="marker-btn"
                        onClick={() => {
                          setSelectedStore(store);
                        }}
                      >
                        <img
                          className="map-seller-image"
                          src={profile.image}
                          alt="Store Icon"
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
                          <h4 className="text-center mt-1">
                            {selectedStore.owner_name}
                          </h4>
                          <h5 className="text-center mt-1">
                            {selectedStore.name}
                          </h5>
                          {console.log(selectedStore)}
                          <img
                            src={selectedStore.image}
                            alt="Store Icon"
                            className="map-store-image"
                          />
                          <p style={{ margin: "0", padding: "0" }}>
                            <strong>Address: </strong>
                            {selectedStore.address}
                          </p>
                          <strong>
                            <p
                              className="text-center"
                              style={{ margin: "0", padding: "0" }}
                            >
                              Go to{" "}
                              <a href={`#/seller/${selectedStore.owner}`}>
                                {selectedStore.owner_name}
                              </a>
                              's page
                            </p>
                          </strong>
                        </div>
                      </Popup>
                    ) : null}
                  </Marker>
                );
              })
            )}
          </Map>
        </Row>
      </Container>
    </>
  );
}
