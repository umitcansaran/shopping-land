import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "react-map-gl";
import { Col, Form, Row } from "react-bootstrap";
import "./map.css";
import { search } from "../store/actions/searchAction";
import { listStores } from "../store/actions/storeActions";
import { listProductCategories } from "../store/actions/categoriesActions";
import { listProfiles } from "../store/actions/userActions";
import SearchBox from "../components/SearchBox";
import MapMarker from "../components/MapMarker";

function StoresMap() {
  
  const [viewState, setViewState] = useState({
    latitude: 46.738436,
    longitude: 8.082641,
    zoom: 7.3,
  });
  const [value, setValue] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  
  const dispatch = useDispatch();

  const { stores } = useSelector((state) => state.storeList);
  const { profiles } = useSelector((state) => state.profileList);

  const { categories } = useSelector((state) => state.productCategories);

  useEffect(() => {
    dispatch(listProfiles());
    dispatch(listStores());
    dispatch(listProductCategories());
  }, [dispatch]);

  // const storeOwner =
  //   selectedStore &&
  //   profiles.find((profile) => profile.name === selectedStore.owner_name);

  const filterOptionHandler = (event) => {
    dispatch(search({ type: "stores", searchString: event.target.value }));
  };

  return (
    <>
      <Row style={{ backgroundColor: "#1e478a", height: "3rem" }}>
        <Col>
          {/* <SearchBox
            value={value}
            setValue={setValue}
            type="map"
            placeholder="Search for a retailer name.."
            color="#1e478a"
            width="60%"
          /> */}
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
      </Row>
      <p className="text-center">
        Zoom in and click on the icon for more information..
      </p>
      {/* <Row>
        <Map
          {...viewState}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
          style={{ height: "80vh" }}
          onMove={(evt) => setViewState(evt.viewState)}
        >
          {stores && stores.map((store, index) => {
            return (
              < MapMarker store={store} selectedStore={selectedStore} setSelectedStore={setSelectedStore} index={index} />
            );
          })}
        </Map>
      </Row> */}
    </>
  );
}

export default StoresMap;
