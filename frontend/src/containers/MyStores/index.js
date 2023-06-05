import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listMyStores, deleteStore } from "../../store/actions/storeActions";
import AddStoreButton from "./AddStoreButton";
import { listMyProducts } from "../../store/actions/productActions";
import { listStocks } from "../../store/actions/stockActions";
import { search } from "../../store/actions/searchAction";
import Notification from "../../components/Notification";
import { useLocation } from "react-router-dom";
import { STORE_DELETE_RESET } from "../../store/constants/storeConstants";
import DeletePopup from "../../components/DeletePopup";
import SearchBox from "../../components/SearchBox";
import StoreButtons from "./StoreButtons";
import StoreStocks from "./StoreStocks";
import Loader from "../../components/Loader";

function MyStores() {
  const [viewButton, setViewButton] = useState({});
  const [value, setValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteWindow, setDeleteWindow] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();

  const { createStoreSuccess } = location.state ? location.state : false;

  const { myStores, loading: myStoresLoading } = useSelector(
    (state) => state.storeMyList
  );
  const { success: deleteStoreSuccess, error } = useSelector(
    (state) => state.storeDelete
  );

  useEffect(() => {
    if (createStoreSuccess) {
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 500);
    }
    dispatch(listMyProducts());
    if (value.length === 0) {
      dispatch(listMyStores());
    }
  }, [dispatch, value, createStoreSuccess, deleteStoreSuccess]);

  useEffect(() => {
    if (deleteConfirm === "store") {
      setDeleteConfirm(null);
      setDeleteWindow(false);
      setTimeout(() => {
        dispatch(deleteStore(storeToDelete.id));
      }, 50);
    }
  }, [dispatch, deleteConfirm, storeToDelete]);

  useEffect(() => {
    dispatch({ type: STORE_DELETE_RESET });
  }, [dispatch]);

  const searchHandler = (e, storeName) => {
    setValue(e.target.value);
    dispatch(
      search({
        type: "products_in_my_store",
        store: storeName,
        searchString: e.target.value,
      })
    );
  };

  const viewStockHandler = (index) => {
    Object.keys(viewButton).forEach((key) => {
      viewButton[key] = false;
    });
    setViewButton({
      ...viewButton,
      [index]: true,
    });
    setValue("");
    dispatch(listStocks());
  };

  const closeStockHandler = (index) => {
    setViewButton({
      ...viewButton,
      [index]: false,
    });
  };

  const deleteStoreHandler = (store) => {
    setDeleteWindow(true);
    setStoreToDelete(store);
  };

  return (
    <Container fluid>
      <SearchBox
        searchProps={{ type: "my_stores" }}
        value={value}
        setValue={setValue}
        placeholder="Search for id or name"
      />
      <AddStoreButton />
      {myStoresLoading ? (
        <Loader />
      ) : (
        myStores.length != 0 && (
          <Table
            striped
            hover
            responsive
            className="table-sm my-2"
            style={{ width: "100%" }}
          >
            <thead style={{ backgroundColor: "#f2f5fa" }}>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>NAME</th>
                <th>ADDRESS</th>
                <th>PHONE</th>
                <th className="d-none d-sm-table-cell">PRODUCT</th>
                <th className="d-none d-sm-table-cell">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {myStores.map((store, index) => (
                <>
                  <tr style={{ textAlign: "center" }}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{store.name}</strong>
                    </td>
                    <td>{store.address}</td>
                    <td>{store.phone}</td>
                    <td
                      style={{ width: "11rem", textAlign: "center" }}
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
                          View Products
                        </Button>
                      )}
                    </td>
                    <td
                      style={{ width: "8rem", textAlign: "center" }}
                      className="d-none d-sm-table-cell"
                    >
                      <Button
                        onClick={() => {
                          deleteStoreHandler(store);
                        }}
                        className="btn-block red-button"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                  {/* renders only on mobile screens */}
                  <StoreButtons
                    store={store}
                    index={index}
                    viewButton={viewButton}
                    viewStockHandler={viewStockHandler}
                    closeStockHandler={closeStockHandler}
                    deleteStoreHandler={deleteStoreHandler}
                  />
                  {viewButton[index] && (
                    <StoreStocks
                      store={store}
                      searchHandler={searchHandler}
                      value={value}
                    />
                  )}
                </>
              ))}
            </tbody>
          </Table>
        )
      )}

      {deleteWindow && (
        <DeletePopup
          setDeleteWindow={setDeleteWindow}
          setDeleteConfirm={setDeleteConfirm}
          item={{ type: "store", details: storeToDelete }}
        />
      )}
      {deleteStoreSuccess && (
        <Notification status="success" message="Store Deleted Successfully!" />
      )}
      {createStoreSuccess && (
        <Notification status="success" message="Store Created Successfully!" />
      )}
    </Container>
  );
}

export default MyStores;
