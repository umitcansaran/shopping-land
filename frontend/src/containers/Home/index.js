import React, { useEffect, useState } from "react";
import { Row, Button, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LatestReviews from "./LatestReviews";
import LatestSellers from "./LatestSellers";
import ProductCard from "../../components/ProductCard";
import ProductCarousel from "./ProductCarousel";
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
import useDebounce from "../../utils/useDebounce";
import "./index.css";
import SearchBox from "../../components/SearchBox";
import { listUsers } from "../../store/actions/userActions";

function Home() {
  const [value, setValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(value, 500);

  useEffect(() => {
    dispatch({ type: PRODUCT_LIST_RESET });
    if (debouncedSearchTerm) {
      dispatch(search({ type: "all", searchString: debouncedSearchTerm }));
    }
    dispatch(listUsers());
  }, [dispatch, debouncedSearchTerm]);

  const { products: searchResult } = useSelector((state) => state.productList);

  // Using React Query for faster reload by mounting cached components.
  const [
    latestReviewsQuery,
    latestProductsQuery,
    latestSellersQuery,
    categoriesQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["latestReviews"],
        queryFn: () =>
          axios.get("/api/products/latest-reviews/").then((res) => res.data),
      },
      {
        queryKey: ["latestProducts"],
        queryFn: () =>
          axios.get("/api/products/latest-products/").then((res) => res.data),
      },
      {
        queryKey: ["latestSellers"],
        queryFn: () =>
          axios.get("/api/profiles/latest-sellers/").then((res) => res.data),
      },
      {
        queryKey: ["categories"],
        queryFn: () =>
          axios.get("api/products/categories/").then((res) => res.data),
      },
    ],
  });

  const fetchProducts = async (pageParam = 0) => {
    const { data } = await axios.get(
      `api/products/?offset=${pageParam}&limit=12`
    );
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
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

  // Prefetching and caching '/sellers' and '/map' routes data in advance.
  queryClient.prefetchQuery({
    queryKey: ["sellers"],
    queryFn: () => axios.get("/api/profiles/sellers/").then((res) => res.data),
    cacheTime: 5 * 60 * 1000,
  });

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
      <SearchBox
        searchProps={{ type: "all" }}
        actionType="PRODUCT_LIST_RESET"
        value={value}
        setValue={setValue}
        placeholder="Search for product, brand or seller"
      />
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
      <Row className="d-md-flex d-sm-none d-none">
        {!searching && value.length < 2 && (
          // do not render these components if searching or screen size is mobile
          <>
            <Col md={4}>
              <LatestReviews latestReviews={latestReviewsQuery.data} />
            </Col>
            <Col md={4}>
              <ProductCarousel latestProducts={latestProductsQuery.data} />
            </Col>
            <Col md={4}>
              <LatestSellers latestSellers={latestSellersQuery.data} />
            </Col>
          </>
        )}
      </Row>
      <Row>
        <div className="home-sidebar-container">
          <HomeSidebar
            categories={categoriesQuery.data}
            categoryFilterHandler={categoryFilterHandler}
          />
        </div>
        <Col className="mx-1">
          {value.length <= 1 && !searching ? (
            // show all products at first render
            <Row className="product-card-container">
              <Row className="product-card-row">
                {data?.pages.map((page, pageIndex) => { 
                  return page.results.map((product) => (
                    <ProductCard product={product} key={`${pageIndex}-${product.id}`} />
                  ));
                })}
                {data && value.length === 0 && hasNextPage && (
                  <Row className="justify-content-center">
                    <Button
                      className="home-button blue-button"
                      onClick={() => fetchNextPage()}
                    >
                      {isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage && "Load More"}
                    </Button>
                  </Row>
                )}
              </Row>
            </Row>
          ) : (
            // show search results
            <Row className="product-card-container">
              <Row className="product-card-row">
                {searchResult?.map((product, index) => (
                  <ProductCard product={product} key={index} />
                ))}
              </Row>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
