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
import MyProductStocks from "../components/MyProductStocks"

function MyProductsScreen() {
  const [value, setValue] = useState("");
  const [stock, setStock] = useState({});
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
      dispatch(updateStock({ number: 0 }, stock.id));
    }
  };

  const saveHandler = async (index, stock, product, stockNumber) => {

    let stockNum = { number: stockInput[index] };

    if (stockInput[index] === true) {
      stockNum = { number: stockNumber }
    }

    if (stock) {
      dispatch(updateStock(stock.id, stockNum));
      setStockInput({});
    } else {
      dispatch(createStock(stockNum.number, stock.id, product.id));
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
                < MyProductStocks product={product} myStores={myStores} stockInput={stockInput} setStockInput={setStockInput} stock={stock} stockInputHandler={stockInputHandler} saveHandler={saveHandler} deleteStockHandler={deleteStockHandler} />
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
