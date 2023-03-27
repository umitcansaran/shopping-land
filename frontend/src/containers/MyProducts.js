import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Badge,
  Row,
  Col,
  ListGroup,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listMyProducts, deleteProduct } from "../store/actions/productActions";
import { listMyStores } from "../store/actions/storeActions";
import { createStock, updateStock } from "../store/actions/stockActions";
import AddProductButton from "../components/AddProductButton";
import SearchBox from "../components/SearchBox";
import { useLocation } from "react-router-dom";
import Notification from "../components/Notification";
import DeletePopup from "../components/DeletePopup";
import { PRODUCT_DELETE_RESET } from "../store/constants/productConstants";

function MyProductsScreen() {
  const [value, setValue] = useState("");
  const [stockInput, setStockInput] = useState({});
  const [button, setButton] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteWindow, setDeleteWindow] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();

  const { createProductSuccess } = location.state ? location.state : false;

  const { myProducts } = useSelector((state) => state.productMyList);
  const { myStores } = useSelector((state) => state.storeMyList);
  const { stock: newStock } = useSelector((state) => state.createStock);
  const { stock: updatedStock } = useSelector((state) => state.stockUpdate);
  const { success: deleteProductSuccess } = useSelector(
    (state) => state.productDelete
  );



  useEffect(() => {
    if (createProductSuccess) {
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 500);
    }

    dispatch(listMyProducts());
    dispatch(listMyStores());
  }, [
    dispatch,
    createProductSuccess,
    deleteProductSuccess,
    newStock,
    updatedStock,
  ]);

  useEffect(() => {
    if (deleteConfirm === "yes") {
      setDeleteConfirm(null);
      setDeleteWindow(false);
      setTimeout(() => {
        dispatch(deleteProduct(productToDelete.id));
      }, 50);
    }
  }, [dispatch, deleteConfirm, productToDelete]);

  useEffect(() => {
    dispatch({ type: PRODUCT_DELETE_RESET });
  }, [dispatch]);

  const viewStockHandler = (index) => {
    Object.keys(button).forEach((key) => {
      button[key] = false;
    });
    Object.keys(stockInput).forEach((key) => {
      stockInput[key] = false;
    });
    setButton({
      ...button,
      [index]: true,
    });
  };

  const closeStockHandler = (index) => {
    setButton({
      ...button,
      [index]: false,
    });
  };

  const stockInputHandler = (e, index, storeIndex) => {
    Object.keys(stockInput).forEach((key) => {
      stockInput[key] = false;
    });
    setStockInput({
      ...stockInput,
      [storeIndex]: true,
    });
  };

  const deleteProductHandler = (product) => {
    setDeleteWindow(true);
    setProductToDelete(product);
  };

  const deleteStockHandler = (checkProductStock) => {
    if (window.confirm("Are you sure")) {
      dispatch(updateStock({ number: 0 }, checkProductStock.id));
    }
  };

  const saveHandler = async (checkProductStock, index, store, product) => {
    if (stockInput[index] === true) {
      stockInput[index] = 0;
    }
    let stockNum = { number: stockInput[index] };

    if (checkProductStock) {
      dispatch(updateStock(stockNum, checkProductStock.id));
      setStockInput({});
    } else {
      dispatch(createStock(stockNum.number, store.id, product.id));
      setStockInput({});
    }
  };

  const searchProps = {
    type: "my_products",
  };

  return (
    <>
      <AddProductButton />
      <SearchBox
        searchProps={searchProps}
        value={value}
        setValue={setValue}
        placeholder="Search for an id, name or brand.. "
        width="50%"
      />
      <Table
        hover
        responsive
        className="table-sm"
        style={{ width: "90%", margin: "auto" }}
      >
        <thead style={{ backgroundColor: "#f2f5fa" }}>
          <tr style={{ textAlign: "center" }}>
            <th>ID</th>
            <th>BRAND</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>STOCK</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          {myProducts.map((product, index) => (
            <>
              <tr key={product.id} style={{ textAlign: "center" }}>
                <td>{product.id}</td>
                <td>
                  <strong>{product.brand}</strong>
                </td>
                <td>{product.name}</td>
                <td>CHF {Math.trunc(product.price)}</td>
                <td>{product.category}</td>
                <td style={{ width: "9rem", textAlign: "center" }}>
                  {button[index] ? (
                    <Button
                      onClick={() => {
                        closeStockHandler(index);
                      }}
                      stye={{ color: "#f2f5fa" }}
                      className="btn-block blue-button"
                    >
                      Close
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        viewStockHandler(index);
                      }}
                      stye={{ color: "#f2f5fa" }}
                      className="btn-block blue-button"
                    >
                      View Stock
                    </Button>
                  )}
                </td>
                <td style={{ width: "6rem", textAlign: "center" }}>
                  <Button
                    onClick={() => {
                      deleteProductHandler(product);
                    }}
                    stye={{ color: "#f2f5fa" }}
                    className="btn-block btn-danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
              {button[index] && (
                <tr>
                  <td colSpan="7">
                    {myStores.map((store, storeIndex) => {
                      const checkProductStock = store.stocks.find((stock) => {
                        return product.id === stock.product;
                      });
                      return (
                        <>
                          <Row className="d-flex justify-content-center">
                            <Col
                              md={8}
                              className="d-flex justify-content-end align-items-center"
                            >
                              <ListGroup key={index} as="ol">
                                <ListGroup.Item
                                  as="li"
                                  className="d-flex justify-content-between align-items-center"
                                  style={{ width: "30rem" }}
                                >
                                  <div className="fw-bold">{store.name}</div>
                                  {stockInput[storeIndex] ? (
                                    <Form>
                                      <Form.Group
                                        className=""
                                        controlId="formBasicEmail"
                                      >
                                        <Form.Control
                                          style={{
                                            width: "3rem",
                                            height: "1.3rem",
                                          }}
                                          type=""
                                          value={stockInput.storeIndex}
                                          placeholder={
                                            checkProductStock
                                              ? checkProductStock.number
                                              : 0
                                          }
                                          onChange={(e) => {
                                            setStockInput({
                                              ...stockInput,
                                              [storeIndex]: e.target.value,
                                            });
                                          }}
                                        />
                                      </Form.Group>
                                    </Form>
                                  ) : !checkProductStock ||
                                    checkProductStock.number === 0 ? (
                                    <Badge bg="danger" pill>
                                      0
                                    </Badge>
                                  ) : (
                                    <Badge bg="primary" pill>
                                      {checkProductStock.number}
                                    </Badge>
                                  )}
                                </ListGroup.Item>
                              </ListGroup>
                            </Col>
                            <Col md={4} className="d-flex">
                              {!stockInput[storeIndex] ? (
                                <Button
                                  onClick={(e) => {
                                    stockInputHandler(e, index, storeIndex);
                                  }}
                                  variant="primary"
                                  className="btn-sm my-2"
                                >
                                  <i className="fas fa-edit"> edit</i>
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    saveHandler(
                                      checkProductStock,
                                      storeIndex,
                                      store,
                                      product
                                    )
                                  }
                                  variant="primary"
                                  className="btn-sm my-2"
                                  type="submit"
                                >
                                  <i className="fa-regular fa-paper-plane-top">
                                    validate
                                  </i>
                                </Button>
                              )}
                              <Button
                                onClick={() =>
                                  deleteStockHandler(checkProductStock)
                                }
                                variant="danger"
                                className="btn-sm my-2 m-2"
                                type="submit"
                              >
                                <i className="fa-regular fa-paper-plane-top">
                                  delete
                                </i>
                              </Button>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </Table>
      {deleteWindow && (
        <DeletePopup
          setDeleteWindow={setDeleteWindow}
          setDeleteConfirm={setDeleteConfirm}
          item={{ type: 'product', details: productToDelete }}
        />
      )}
      {deleteProductSuccess && (
        <Notification
          status="success"
          message="Product Deleted Successfully!"
        />
      )}
      {createProductSuccess && (
        <Notification
          status="success"
          message="Product Created Successfully!"
        />
      )}
    </>
  );
}

export default MyProductsScreen;
