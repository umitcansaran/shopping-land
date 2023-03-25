import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listMyStores, deleteStore } from "../store/actions/storeActions";
import AddStoreButton from "../components/AddStoreButton";
import { listMyProducts } from "../store/actions/productActions";
import { listStocks } from "../store/actions/stockActions";
import { search } from "../store/actions/searchAction";
import MyStoreStocks from "../components/MyStoreStocks";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Notification from "../components/Notification";
import { useLocation, useNavigate } from "react-router-dom";
import { STORE_DELETE_RESET } from "../store/constants/storeConstants";

function MyStoresScreen() {
  const [stockInput, setStockInput] = useState({});
  const [button, setButton] = useState({});
  const [value, setValue] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { createStoreSuccess } = location.state ? location.state : false;

  const { myStores, loading: myStoresLoading } = useSelector(
    (state) => state.storeMyList
  );
  const { stocks } = useSelector((state) => state.stockList);
  const {
    success: storeDeleteSuccess,
    loading: storeDeleteLoading,
    error,
  } = useSelector((state) => state.storeDelete);

  useEffect(() => {
    if (createStoreSuccess) {
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 500);
    }
    dispatch(listMyProducts());
    dispatch(listMyStores());
    dispatch(listStocks());
  }, [dispatch, navigate, createStoreSuccess, storeDeleteSuccess]);

  useEffect(() => {
    dispatch({ type: STORE_DELETE_RESET });
  }, [dispatch]);

  const searchHandler = (e, storeName) => {
    setValue(e.target.value);
    dispatch(
      search({
        type: "product_in_my_store",
        store: storeName,
        searchString: e.target.value,
      })
    );
  };

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
    setValue("");
    dispatch(listStocks());
  };

  const closeStockHandler = (index) => {
    setButton({
      ...button,
      [index]: false,
    });
  };

  const deleteStoreHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteStore(id));
    }
  };

  return (
    <>
      <AddStoreButton />
      {myStoresLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table
          striped
          hover
          responsive
          className="table-sm my-3"
          style={{ width: "90%", margin: "auto" }}
        >
          <thead style={{ backgroundColor: "#f2f5fa" }}>
            <tr style={{ textAlign: "center" }}>
              <th>ID</th>
              <th>NAME</th>
              <th>ADDRESS</th>
              <th>PHONE</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myStores.map((store, index) => (
              <>
                <tr key={store.id} style={{ textAlign: "center" }}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{store.name}</strong>
                  </td>
                  <td>{store.address}</td>
                  <td>{store.phone}</td>
                  <td style={{ width: "11rem", textAlign: "center" }}>
                    {button[index] ? (
                      <Button
                        onClick={() => {
                          closeStockHandler(index);
                        }}
                        stye={{ color: "#f2f5fa" }}
                        className="btn-block"
                      >
                        Close
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          viewStockHandler(index);
                        }}
                        stye={{ color: "#f2f5fa" }}
                        className="btn-block"
                      >
                        View Products
                      </Button>
                    )}
                  </td>
                  <td style={{ width: "8rem", textAlign: "center" }}>
                    <Button
                      onClick={() => {
                        deleteStoreHandler(store.id);
                      }}
                      className="btn-block btn-danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
                {button[index] && (
                  <MyStoreStocks
                    stocks={stocks}
                    store={store}
                    searchHandler={searchHandler}
                    value={value}
                  />
                )}
              </>
            ))}
          </tbody>
        </Table>
      )}
      {storeDeleteSuccess && (
        <Notification status="success" message="Store Deleted Successfully!" />
      )}
      {createStoreSuccess && (
        <Notification status="success" message="Store Created Successfully!" />
      )}
    </>
  );
}

export default MyStoresScreen;
