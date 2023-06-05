import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditProfileScreen from "../../components/EditProfileScreen";
import { Row, Col, Image, ListGroup, Button } from "react-bootstrap";
import { deleteAccount, logout } from "../../store/actions/userActions";
import { listProductCategories } from "../../store/actions/categoriesActions";
import "./index.css";
import DeletePopup from "../../components/DeletePopup";

function Profile() {
  const [editProfile, setEditProfile] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteWindow, setDeleteWindow] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [type, setType] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.myDetails);

  const profile = user?.profile;

  useEffect(() => {
    if (deleteConfirm === "account") {
      setDeleteConfirm(null);
      setDeleteWindow(false);
      setTimeout(() => {
        dispatch(deleteAccount(itemToDelete));
        dispatch(logout());
        navigate("/");
      }, 50);
    }
    dispatch(listProductCategories);
  }, [dispatch, deleteConfirm, itemToDelete]);

  const deleteUser = () => {
    setType("account");
    setDeleteWindow(true);
    setItemToDelete(user.id);
  };

  return (
    <>
      {!editProfile && profile.status === "STORE_OWNER" && (
        <>
          <Row className="mt-4 justify-content-center">
            <Image className="profile-img" src={user.profile.image} />
          </Row>
          <Row className="mt-3 d-flex justify-content-center">
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name: </strong>
                  {user.username}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email: </strong>
                  {user.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Status: </strong>Seller
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Category: </strong>
                  {console.log(profile)}
                  {profile.categoryDetails.map((category) => {
                    return <li>{category.name}</li>;
                  })}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Industry: </strong>
                  {profile.industry}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Headquarter: </strong>
                  {profile.headquarter}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Description: </strong>
                  {profile.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
      {!editProfile && profile.status === "CUSTOMER" && (
        <>
          <Row className="mt-4 justify-content-center">
            <Image className="profile-img" src={user.profile.image} />
          </Row>
          <Row className="mt-3 d-flex justify-content-center">
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name: </strong>
                  {user.username}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email: </strong>
                  {user.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Status: </strong>Customer
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Date Joined: </strong>
                  {user.date_joined.substring(0, 10)}
                </ListGroup.Item>
                {user.last_login && (
                  <ListGroup.Item>
                    <strong>Last Login: </strong>
                    {user.last_login.substring(0, 10)}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}

      {editProfile && <EditProfileScreen />}

      <Row className="justify-content-center mt-4">
        <Button className="mt-3" onClick={() => setEditProfile(!editProfile)}>
          {!editProfile ? "Edit Profile" : "Back to Profile"}
        </Button>
      </Row>
      {!editProfile && (
        <Row className="justify-content-center mt-4">
          <Button onClick={() => deleteUser()} className="mt-3 btn-danger">
            Delete Your Account
          </Button>
        </Row>
      )}
      {deleteWindow && (
        <DeletePopup
          setDeleteWindow={setDeleteWindow}
          setDeleteConfirm={setDeleteConfirm}
          item={{ type: type, details: itemToDelete }}
        />
      )}
    </>
  );
}

export default Profile;
