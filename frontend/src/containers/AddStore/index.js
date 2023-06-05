import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import { listProductCategories } from "../../store/actions/categoriesActions";
import { myDetails } from "../../store/actions/userActions";
import { createStore } from "../../store/actions/storeActions";
import { STORE_CREATE_RESET } from "../../store/constants/storeConstants";
import FormContainer from "../../components/FormContainer";
import AddressInputField from "../../components/AddressInputField";
import Loader from "../../components/Loader";
import Notification from "../../components/Notification";
import Message from "../../components/Message";

function AddStore() {
  const [viewState, setViewState] = useState({
    latitude: 46.738436,
    longitude: 8.082641,
    zoom: 7,
  });

  const [state, setState] = useState({
    owner: "",
    name: "",
    address: "",
    country: "",
    city: "",
    latitude: "",
    longitude: "",
    description: "",
    phone: "",
    image: "",
    category: [],
  });

  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.productCategories);
  const { user } = useSelector((state) => state.myDetails);
  const {
    loading: createStoreLoading,
    success: createStoreSuccess,
    error: createStoreError,
  } = useSelector((state) => state.createStore);

  useEffect(() => {
    if (createStoreSuccess) {
      navigate("/mystores", { state: { createStoreSuccess: true } });
      dispatch({ type: STORE_CREATE_RESET });
    }
    if (createStoreError) {
    }
    dispatch(listProductCategories());
    dispatch(myDetails());
  }, [dispatch, navigate, createStoreSuccess]);

  const onChange = ({ target: { name, value } }) => {
    setState({ ...state, [name]: value });
  };

  const handleCategoryChange = (e) => {
    var options = e.target.options;
    var category = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        category.push(options[i].value);
      }
    }
    setState({ ...state, category: category });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setState({ ...state, image: image });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    for (var i = 0; i < state.category.length; i++) {
      formData.append("category", state.category[i]);
    }

    formData.set("owner", user.id);
    formData.set("name", name);
    formData.set("address", state.address);
    formData.set("country", state.country);
    formData.set("city", state.city);
    formData.set("latitude", state.latitude);
    formData.set("longitude", state.longitude);
    formData.set("description", state.description);
    formData.set("phone", state.phone);
    formData.set("image", state.image);

    dispatch(createStore(formData));
  };

  return (
    <>
      <FormContainer>
        <Row style={{ justifyContent: "center" }}>
          <Col>
            <h4 className="my-3" style={{ textAlign: "center" }}>
              ADD A STORE
            </h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <AddressInputField setState={setState} />

              {state.latitude && (
                <Row>
                  <Col style={{ width: "30%" }}>
                    <Form.Group className="mb-2">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="latitude"
                        value={state.latitude}
                        onChange={onChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col style={{ width: "30%" }}>
                    <Form.Group className="mb-2">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="longitude"
                        value={state.longitude}
                        onChange={onChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={state.description}
                  onChange={onChange}
                  rows="3"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={state.phone}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Image</Form.Label>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Categories</Form.Label>
                <Form.Control
                  as="select"
                  type="text"
                  name="category"
                  value={state.category}
                  onChange={handleCategoryChange}
                  multiple
                >
                  {categories &&
                    categories.map((category) => {
                      return <option key={category.id}>{category.name}</option>;
                    })}
                </Form.Control>
              </Form.Group>
              <Row style={{ justifyContent: "center" }}>
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </Row>
            </Form>
          </Col>
        </Row>
      </FormContainer>
      {createStoreLoading && <Loader />}
      {createStoreSuccess && (
        <Notification
          status="success"
          title="Success"
          message="Store Created!"
        />
      )}
      {createStoreError && (
        <Message variant="danger">{createStoreError}</Message>
      )}
    </>
  );
}

export default AddStore;
