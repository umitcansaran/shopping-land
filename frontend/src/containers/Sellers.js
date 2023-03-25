import React, { useEffect, useState } from "react";
import { Button, Row, Col, Image, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { search } from "../store/actions/searchAction";
import { listProductCategories } from "../store/actions/categoriesActions";
import { listProfiles, listSellerProfiles } from "../store/actions/userActions";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

export default function SellersScreen() {
  const [showResult, setShowResult] = useState(false);

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.productCategories);
  const { profiles, loading } = useSelector((state) => state.sellerProfiles);

  useEffect(() => {
    dispatch(listProductCategories());
    dispatch(listSellerProfiles());
  }, [dispatch]);

  const filterOptionHandler = (event) => {
    dispatch(search({ type: "profiles", searchString: event.target.value }));
    setShowResult(true);
  };

  const filterResetHandler = () => {
    dispatch(listProfiles());
    setShowResult(false);
  };

  return (
    <>
      <Row style={{ backgroundColor: "#1e478a", height: "3rem" }}>
        <Form.Select
          className="d-flex justify-content-center my-1"
          onChange={filterOptionHandler}
          aria-label="Default select example"
          style={{ width: "40%", margin: "auto" }}
        >
          <option>Filter by Category</option>
          {categories.map((category, index) => {
            return <option key={index}>{category.name}</option>;
          })}
        </Form.Select>
      </Row>
      <h2 className="text-center">Select a seller</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {showResult && (
            <Button
              variant="secondary"
              onClick={() => filterResetHandler()}
              className="m-2"
            >
              Back
            </Button>
          )}
          <Row className="align-items-center">
            {profiles &&
              profiles.map((profile, index) => {
                return (
                  <>
                    <Col md={2}>
                      <Link to={`/seller/${profile.id}`}>
                        <Image
                          className="p-2"
                          src={profile.image}
                          alt={profile.name}
                          key={index}
                          style={{ width: "60%", margin: "3rem" }}
                        />
                      </Link>
                    </Col>
                  </>
                );
              })}
          </Row>
        </>
      )}
    </>
  );
}
