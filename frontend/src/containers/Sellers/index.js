import React, { useState } from "react";
import { Button, Row, Col, Image, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { search } from "../../store/actions/searchAction";
import { listProfiles } from "../../store/actions/userActions";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import useSWR from "swr";
import axios from "axios";
import { SELLER_PROFILES_RESET } from "../../store/constants/userConstants";
import { useQuery } from "@tanstack/react-query";
import "./index.css";

function Sellers() {
  const [searchResult, setSearchResult] = useState(false);
  const [resetFilter, setResetFilter] = useState(true);

  const dispatch = useDispatch();

  const { profiles: filterSellerProfiles } = useSelector(
    (state) => state.sellerProfiles
  );

  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data: categories } = useSWR("/api/products/categories/", fetcher);

  // Using React Query for faster reload after filtering by mounting cached components.
  const { data: sellerProfiles, isLoading: loading } = useQuery({
    queryKey: ["sellers"],
    queryFn: () => axios.get("/api/profiles/sellers/").then((res) => res.data),
  });

  let profiles;
  !searchResult
    ? (profiles = sellerProfiles)
    : (profiles = filterSellerProfiles);

  const filterOptionHandler = (event) => {
    dispatch({ type: SELLER_PROFILES_RESET });
    dispatch(search({ type: "profiles", searchString: event.target.value }));
    setSearchResult(true);
  };

  const filterResetHandler = () => {
    dispatch(listProfiles());
    setSearchResult(false);
    setResetFilter(!resetFilter);
  };

  return (
    <>
      <Row style={{ backgroundColor: "#495b7a", height: "3rem" }}>
        <Form.Select
          className="d-flex justify-content-center my-1 sellers-page-filter"
          onChange={filterOptionHandler}
          aria-label="Default select example"
        >
          <option>Filter by Category</option>
          {categories &&
            categories.map((category, index) => {
              return <option key={index}>{category.name}</option>;
            })}
        </Form.Select>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <>
          {searchResult && (
            <Button
              variant="secondary"
              onClick={() => filterResetHandler()}
              className="m-2"
            >
              Back
            </Button>
          )}
          <Row
            className="align-items-center"
            style={{ justifyContent: "center" }}
          >
            <Row style={{ width: "90%", textAlign: "center" }}>
              {profiles &&
                profiles.map((profile) => {
                  return (
                    <>
                      <Col
                        xs={6}
                        md={2}
                        className="seller-image-col"
                        key={profile.id}
                      >
                        <Link to={`/seller/${profile.id}`}>
                          <Image
                            className="p-2 seller-image"
                            src={profile.image}
                            alt={profile.name}
                            style={{
                              maxWidth: "60%",
                              maxHeight: "4rem",
                              margin: "3rem",
                            }}
                          />
                        </Link>
                      </Col>
                    </>
                  );
                })}
            </Row>
          </Row>
        </>
      )}
    </>
  );
}

export default Sellers;
