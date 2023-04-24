import React, { useEffect, useState } from "react";
import { Row, Button, Col, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Reviews from "../../components/Reviews";
import News from "../../components/News";
import ProductCard from "../../components/ProductCard";
import ProductCarousel from "../../components/ProductCarousel";
import HomeSidebar from "./HomeSidebar";
import HomeCategoriesBar from "./HomeCategoriesBar";
import { search } from "../../store/actions/searchAction";
import { PRODUCT_LIST_RESET } from "../../store/constants/productConstants";
import {
  useInfiniteQuery,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import "./index.css";

export default function Home() {
  const [value, setValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (value.length > 1) {
      dispatch({ type: PRODUCT_LIST_RESET });
      dispatch(search({ type: "all", searchString: value }));
    }
  }, [dispatch, value]);

  const { products: searchResult } = useSelector((state) => state.productList);

  // Using React Query for faster reload by mounting cached components.
  const [latestReviewsQuery, latestProductsQuery, categoriesQuery] = useQueries(
    {
      queries: [
        {
          queryKey: ["latestReviews"],
          queryFn: () =>
            axios.get("/api/latest-reviews/").then((res) => res.data),
        },
        {
          queryKey: ["latestProducts"],
          queryFn: () =>
            axios.get("/api/latest-products/").then((res) => res.data),
        },
        {
          queryKey: ["categories"],
          queryFn: () =>
            axios.get("api/product-categories/").then((res) => res.data),
        },
      ],
    }
  );

  const fetchProducts = async (pageParam = 0) => {
    const { data } = await axios.get(
      `api/products/?offset=${pageParam}&limit=12`
    );
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(
      ["products"],
      ({ pageParam }) => fetchProducts(pageParam),
      {
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.next) {
            return lastPage.next;
          }
          return null;
        },
      }
    );

  // Prefetching '/sellers' route data in advance.
  queryClient.prefetchQuery({
    queryKey: ["sellers"],
    queryFn: () => axios.get("/api/profiles/sellers/").then((res) => res.data),
    cacheTime: 5 * 60 * 1000,
  });

  // Prefetching '/map' route data in advance.
  queryClient.prefetchQuery({
    queryKey: ["profiles"],
    queryFn: () => axios.get("/api/profiles/").then((res) => res.data),
    cacheTime: 5 * 60 * 1000,
  });

  let filter = "";
  queryClient.prefetchQuery({
    queryKey: ["stores", filter],
    queryFn: () =>
      axios
        .get(`/api/search/?type=stores&search_string=${filter}`)
        .then((res) => res.data),
    cacheTime: 5 * 60 * 1000,
  });

  const categoryFilterHandler = (keyword) => {
    dispatch({ type: PRODUCT_LIST_RESET });
    setSearching(true);
    dispatch(search({ type: "products", searchString: keyword }));
  };

  return (
    <Container fluid>
      <Row className="home-searchbox">
        <Col sm={12} lg={5} className="align-self-center">
          <Form>
            <Form.Control
              type="text"
              placeholder="Search for a product, brand or seller name"
              aria-label="Search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
      <HomeCategoriesBar
        categories={categoriesQuery.data}
        categoryFilterHandler={categoryFilterHandler}
      />
      {(searching || value.length > 1) && (
        // show 'back' button if search results are displayed
        <Button
          onClick={() =>
            setSearching(false) + setValue("") + setRedirect(!redirect)
          }
          variant="light"
          className="mx-2"
        >
          Back
        </Button>
      )}
      <Row className="d-lg-flex d-md-none d-none">
        {!searching && value.length < 2 && (
          // do not render these components if searching or screen size is mobile
          <>
            <Reviews latestReviews={latestReviewsQuery.data} />
            <ProductCarousel latestProducts={latestProductsQuery.data} />
            <News />
          </>
        )}
      </Row>
      <Row >
        <Col md={2} lg={2} xl={2} className="d-md-block d-none" >
          <HomeSidebar
            categories={categoriesQuery.data}
            categoryFilterHandler={categoryFilterHandler}
          />
        </Col>
        <Col>
          {value.length <= 1 && !searching ? (
            // show all products at first render
            <>
              <Row className="justify-content-center" >
                {data?.pages.map((page, index) => {
                  return page.results.map((product) => {
                    return (
                      <Col xs={6} md={4} lg={4} xl={3} className="gx-1 gy-1 home-product-container">
                        <ProductCard product={product} key={index} />
                      </Col>
                    );
                  });
                })}
              </Row>
              <Row className="home-back-button-container">
                {data && value.length === 0 && hasNextPage && (
                  <Button
                    className="home-back-button"
                    onClick={() => fetchNextPage()}
                  >
                    {isFetchingNextPage
                      ? "Loading more..."
                      : hasNextPage && "Load More"}
                  </Button>
                )}
              </Row>
            </>
          ) : (
            // show search results
            <Row>
              {searchResult?.map((product, index) => {
                return (
                  // <Col xs={6} md={3} lg={4} xl={3} className="gx-1 gy-1">
                  <Col xs={6} md={4} lg={4} xl={3} className="gx-1 gy-1 home-product-container">
                    <ProductCard product={product} key={index} />
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
