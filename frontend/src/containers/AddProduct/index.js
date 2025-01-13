import React, { useEffect, useState } from "react";
import { Button, Row, Col, Form, FormGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductCategories } from "../../store/actions/categoriesActions";
import { myDetails } from "../../store/actions/userActions";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import { createProduct } from "../../store/actions/productActions";
import { PRODUCT_CREATE_RESET } from "../../store/constants/productConstants";
import Loader from "../../components/Loader";
import Notification from "../../components/Notification";
import Message from "../../components/Message";

function AddProduct() {
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
  const {
    loading: createProductLoading,
    success: createProductSuccess,
    error: createProductError,
  } = useSelector((state) => state.productCreate);

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
        <Row style={{ justifyContent: "center" }}>
          <Col>
            <h4 className="my-3" style={{ textAlign: "center" }}>
              ADD A PRODUCT
            </h4>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-2">
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
                <Form.Group className="mb-2">
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
              <Form.Group className="mb-2">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Image</Form.Label>
                <Row>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Row>
              </Form.Group>
              <Row style={{ justifyContent: "center", marginTop: "1rem" }}>
                <Button type="submit" variant="primary">
                  Add Product
                </Button>
              </Row>
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
      {createProductError && (
        <Message variant="danger">{createProductError}</Message>
      )}
    </>
  );
}

export default AddProduct;
