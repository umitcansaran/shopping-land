import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Container } from "react-bootstrap";
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
import { search } from "../../store/actions/searchAction";
import MobileStockButtons from "./ProductButtons";
import ProductButtons from "./ProductButtons";

export default function MyProducts() {
  const [value, setValue] = useState("");
  const [stock, setStock] = useState({});
  const [stockInput, setStockInput] = useState({});
  const [viewButton, setViewButton] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteWindow, setDeleteWindow] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();

  const { createProductSuccess } = location.state ? location.state : false;

  const { myProducts } = useSelector((state) => state.productMyList);
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
    setDeleteWindow(true);
    setProductToDelete(product);
  };

  const deleteStockHandler = (stock) => {
    if (window.confirm("Are you sure")) {
      dispatch(updateStock(stock.id, { number: 0 }));
    }
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

  const searchHandler = (keyword) => {
    setValue(keyword);
    dispatch(search({ type: "my_products", searchString: keyword }));
  };

  return (
    <>
      <SearchBox
        searchProps={{ type: "my_products" }}
        value={value}
        searchHandler={searchHandler}
        placeholder="Search for an id, brand or name.. "
      />
      <AddProductButton />
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
            <>
              <tr key={product.id} style={{ textAlign: "center" }}>
                <td>{product.id}</td>
                <td>
                  <strong>{product.brand}</strong>
                </td>
                <td>{product.name}</td>
                <td>CHF {Math.trunc(product.price)}</td>
                <td>{product.category}</td>
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
                      className="btn-block blue-button mystores-blue-button"
                    >
                      <i class="fa-solid fa-angle-up"></i>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        viewStockHandler(index);
                      }}
                      stye={{ color: "#f2f5fa" }}
                      className="btn-block blue-button mystores-blue-button"
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
                    className="btn-block btn-danger mystores-blue-button"
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
            </>
          ))}
        </tbody>
      </Table>
      {deleteWindow && (
        <DeletePopup
          setDeleteWindow={setDeleteWindow}
          setDeleteConfirm={setDeleteConfirm}
          item={{ type: "product", details: productToDelete }}
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