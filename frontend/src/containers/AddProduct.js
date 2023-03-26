import React, { useEffect, useState } from "react";
import { baseUrl } from "../store/constants";
import axios from "axios";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductCategories } from "../store/actions/categoriesActions";
import { myDetails } from "../store/actions/userActions";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../store/actions/productActions";
import { PRODUCT_CREATE_RESET } from "../store/constants/productConstants";
import Loader from "../components/Loader";
import Notification from "../components/Notification";

export default function AddProductScreen() {
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.productCategories);
  const { user } = useSelector((state) => state.myDetails);
  const { loading: createProductLoading, success: createProductSuccess } =
    useSelector((state) => state.productCreate);

  const selectedCategory = categories.find(
    (selectedCategory) => selectedCategory.id === Number(category)
  );

  useEffect(() => {
    if (createProductSuccess) {
      navigate("/myproducts", { state: { createProductSuccess: true } });
      dispatch({ type: PRODUCT_CREATE_RESET });
    }
    dispatch(myDetails());
    dispatch(listProductCategories());
  }, [dispatch, navigate, createProductSuccess]);

  const submitHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    if (image) {
      formData.append("image", image, image.name);
    }

    formData.set("brand", brand);
    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("subcategory", subcategory);
    formData.set("seller", user.id);

    dispatch(createProduct(formData));
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  return (
    <>
    <FormContainer>
      <Row>
        <Col md="4" className="m-5" style={{ width: "70%" }}>
          <h4 className="form_titles mb-4" style={{ textAlign: "center" }}>
            ADD A PRODUCT
          </h4>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  required
                  type="number"
                  name="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option>Select</option>
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {selectedCategory && (
                <Form.Group className="mb-4">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Select
                    required
                    type="text"
                    name="subcategory"
                    value={subcategory}
                    onChange={(e) => {
                      setSubcategory(e.target.value);
                    }}
                  >
                    <option>Select</option>
                    {selectedCategory.subcategory.map((subcategory) => (
                      <option value={subcategory.id} key={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Image</Form.Label>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </Form.Group>

            <Button type="submit" variant="primary">
              Add Product
            </Button>
          </Form>
        </Col>
      </Row>
    </FormContainer>
    {createProductLoading && <Loader />}
    {createProductSuccess && (
      <Notification
        status="success"
        title="Success"
        message="Product Created!"
      />
    )}
    </>
  );
}