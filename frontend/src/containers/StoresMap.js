import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "react-map-gl";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "./map.css";
import { search } from "../store/actions/searchAction";
import { listStores } from "../store/actions/storeActions";
import { listProductCategories } from "../store/actions/categoriesActions";
import { listProfiles } from "../store/actions/userActions";
import { Popup, Marker } from "react-map-gl";
import SearchBox from "../components/SearchBox";
import Loader from "../components/Loader";

function StoresMap() {
  const [viewState, setViewState] = useState({
    latitude: 46.826908,
    longitude: 7.944633,
    zoom: 7.7,
  });
  const [value, setValue] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);

  const dispatch = useDispatch();

  const { stores, loading } = useSelector((state) => state.storeList);
  const { profiles } = useSelector((state) => state.profileList);
  const { categories } = useSelector((state) => state.productCategories);

  useEffect(() => {
    if (stores.length === 0) {
      dispatch(listProfiles());
      dispatch(listStores());
    }
      dispatch(listProductCategories());
  }, [dispatch]);

  const filterOptionHandler = (event) => {
    dispatch(search({ type: "stores", searchString: event.target.value }));
  };

  return (
    <>
      <Row style={{ backgroundColor: "#495b7a", height: "3rem" }}>
        <Col sm={12} lg={6}>
          <SearchBox
            searchProps={{ type: "map" }}
            value={value}
            setValue={setValue}
            type="map"
            placeholder="Search for a seller name.."
            color="#1e478a"
          />
        </Col>
        <Col sm={12} lg={6} className="align-self-center">
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
        <p style={{margin:'0', padding:'0', textAlign:'center'}}>Click store icon for more info..</p>
        <Map
          {...viewState}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
          style={{ height: "90vh", width: "100vw" }}
          onMove={(evt) => setViewState(evt.viewState)}
        >
          {loading ? (
            <Loader />
          ) : (
            stores.map((store, index) => {
              const profile = profiles.find(profile => profile.name === store.owner_name)
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
                        <h4
                          className="text-center mt-1"
                          style={{ margin: "0", padding: "0" }}
                        >
                          {selectedStore.owner_name}
                        </h4>
                        <h5 className="text-center mt-1">
                          {selectedStore.name}
                        </h5>
                        <div className="map-store-image-container">
                          <img
                            src={selectedStore.image}
                            alt="Store Icon"
                            className="map-store-image"
                            style={{ width: "13.3rem" }}
                          />
                        </div>
                      </div>
                      <p style={{ fontSize: "0.75rem" }}>
                        <strong>Address: </strong>
                        {selectedStore.address}
                      </p>
                      <strong>
                        <p className="text-center">
                          Go to{" "}
                          <a href={`#/seller/${selectedStore.owner}`}>
                            {selectedStore.owner_name}
                          </a>
                          's page
                        </p>
                      </strong>
                    </Popup>
                  ) : null}
                </Marker>
              );
            })
          )}
        </Map>
      </Row>
    </>
  );
}

export default StoresMap;
