import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "react-map-gl";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./index.css";
import { search } from "../../store/actions/searchAction";
import { Popup, Marker } from "react-map-gl";
import Loader from "../../components/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { STORE_LIST_RESET } from "../../store/constants/storeConstants";

export default function StoresMap() {
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 46.826908,
    longitude: 7.944633,
    zoom: 8.2,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (value.length > 0) {
      dispatch({ type: STORE_LIST_RESET });
      dispatch(search({ type: "map", searchString: value }));
    }
  }, [dispatch, value]);

  const { stores: searchResult } = useSelector(
    (state) => state.storeList
  );

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
        <Row className="map-filters-bar">
          <Col
            sm={12}
            lg={6}
            className="align-self-center justify-content-center"
          >
            <Form>
              <Form.Control
                className="map-search"
                type="text"
                placeholder="Search for a seller name"
                aria-label="Search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Form>
          </Col>
          <Col
            sm={12}
            lg={6}
            className="align-self-center justify-content-center"
          >
            <Form.Select
              className="map-filter"
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Default select example"
            >
              <option>Filter by Category</option>
              {categories?.map((category) => {
                return <option>{category.name}</option>;
              })}
            </Form.Select>
          </Col>
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
              ((<h1>sssss</h1>),
              stores.map((store, index) => {
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
              }))
            )}
          </Map>
        </Row>
      </Container>
    </>
  );
}
