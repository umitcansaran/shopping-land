import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  listMyProducts,
  deleteProduct,
} from "../../store/actions/productActions";
import { listMyStores } from "../../store/actions/storeActions";
import { createStock, updateStock } from "../../store/actions/stockActions";
import AddProductButton from "./AddProductButton";
import SearchBox from "../../components/SearchBox";
import { useLocation } from "react-router-dom";
import Notification from "../../components/Notification";
import DeletePopup from "../../components/DeletePopup";
import { PRODUCT_DELETE_RESET } from "../../store/constants/productConstants";
import MyProductStocks from "./MyProductStocks";
import ProductButtons from "./ProductButtons";
import Loader from "../../components/Loader";

export default function MyProducts() {
  const [value, setValue] = useState("");
  const [stock, setStock] = useState({});
  const [stockInput, setStockInput] = useState({});
  const [viewButton, setViewButton] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteWindow, setDeleteWindow] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [type, setType] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();

  const { createProductSuccess } = location.state ? location.state : false;

  const { myProducts, loading: myProductsLoading } = useSelector(
    (state) => state.productMyList
  );
  const { myStores, loading } = useSelector((state) => state.storeMyList);
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
    if (value.length === 0) {
      dispatch(listMyProducts());
    }
    dispatch(listMyStores());
  }, [
    dispatch,
    createProductSuccess,
    deleteProductSuccess,
    newStock,
    updatedStock,
    value,
  ]);

  useEffect(() => {
    if (deleteConfirm === "product") {
      setDeleteConfirm(null);
      setDeleteWindow(false);
      setTimeout(() => {
        dispatch(deleteProduct(itemToDelete.id));
      }, 50);
    }
    if (deleteConfirm === "stock") {
      setDeleteConfirm(null);
      setDeleteWindow(false);
      setTimeout(() => {
        dispatch(updateStock(itemToDelete.id, { number: 0 }));
      }, 50);
    }
  }, [dispatch, deleteConfirm, itemToDelete]);

  useEffect(() => {
    dispatch({ type: PRODUCT_DELETE_RESET });
  }, [dispatch]);

  const viewStockHandler = (index) => {
    Object.keys(viewButton).forEach((key) => {
      viewButton[key] = false;
    });
    Object.keys(stockInput).forEach((key) => {
      stockInput[key] = false;
    });
    setViewButton({
      ...viewButton,
      [index]: true,
    });
  };

  const closeStockHandler = (index) => {
    setViewButton({
      ...viewButton,
      [index]: false,
    });
  };

  const stockInputHandler = (index) => {
    Object.keys(stockInput).forEach((key) => {
      stockInput[key] = false;
    });
    setStockInput({
      ...stockInput,
      [index]: true,
    });
  };

  const deleteProductHandler = (product) => {
    setType("product");
    setDeleteWindow(true);
    setItemToDelete(product);
  };

  const deleteStockHandler = (stock) => {
    setType("stock");
    setDeleteWindow(true);
    setItemToDelete(stock);
  };

  const saveHandler = async (index, stock, product, store, stockNumber) => {
    let stockNum = { number: stockInput[index] };

    if (stockInput[index] === true) {
      stockNum = { number: stockNumber };
    }

    if (stock) {
      dispatch(updateStock(stock.id, stockNum));
      setStockInput({});
    } else {
      dispatch(createStock(stockNum.number, store.id, product.id));
      setStockInput({});
    }
  };

  return (
    <Container fluid>
      <SearchBox
        searchProps={{ type: "my_products" }}
        value={value}
        setValue={setValue}
        placeholder="Search for id, brand or name"
      />
      <AddProductButton />
      {myProductsLoading ? (
        <Loader />
      ) : (
        myProducts.length !== 0 && (
          <Table hover responsive className="table-sm my-2">
            <thead style={{ backgroundColor: "#f2f5fa" }}>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>BRAND</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th className="d-none d-sm-table-cell">STOCK</th>
                <th className="d-none d-sm-table-cell">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.map((product, index) => (
                  <React.Fragment key={product.id}>
                  <tr key={product.id} style={{ textAlign: "center" }}>
                    <td>{product.id}</td>
                    <td>
                      <strong>{product.brand}</strong>
                    </td>
                    <td>{product.name}</td>
                    <td>CHF {Math.trunc(product.price)}</td>
                    <td>{product.categoryName}</td>
                    <td
                      style={{ width: "9rem", textAlign: "center" }}
                      className="d-none d-sm-table-cell"
                    >
                      {viewButton[index] ? (
                        <Button
                          onClick={() => {
                            closeStockHandler(index);
                          }}
                          stye={{ color: "#f2f5fa" }}
                          className="btn-block blue-button"
                        >
                          <i class="fa-solid fa-angle-up"></i>
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
                    <td
                      style={{ width: "6rem", textAlign: "center" }}
                      className="d-none d-sm-table-cell"
                    >
                      <Button
                        onClick={() => {
                          deleteProductHandler(product);
                        }}
                        stye={{ color: "#f2f5fa" }}
                        className="btn-block red-button"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                  {/* renders only on mobile screens */}
                  <ProductButtons
                    product={product}
                    index={index}
                    viewButton={viewButton}
                    viewStockHandler={viewStockHandler}
                    closeStockHandler={closeStockHandler}
                    deleteProductHandler={deleteProductHandler}
                  />
                  {viewButton[index] && (
                    <MyProductStocks
                      product={product}
                      myStores={myStores}
                      stockInput={stockInput}
                      setStockInput={setStockInput}
                      stock={stock}
                      stockInputHandler={stockInputHandler}
                      saveHandler={saveHandler}
                      deleteStockHandler={deleteStockHandler}
                      loading={loading}
                    />
                  )}
                  </React.Fragment>
              ))}
            </tbody>
          </Table>
        )
      )}
      {deleteWindow && (
        <DeletePopup
          setDeleteWindow={setDeleteWindow}
          setDeleteConfirm={setDeleteConfirm}
          item={{ type: type, details: itemToDelete }}
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
    </Container>
  );
}
