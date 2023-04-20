import React, { useEffect, useState } from "react";
import { Row, Button, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Reviews from "../components/Reviews";
import News from "../components/News";
import SearchBox from "../components/SearchBox";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import HomeSidebar from "../components/HomeSidebar";
import HomeCategoriesBar from "../components/HomeCategoriesBar";
import { search } from "../store/actions/searchAction";
import { PRODUCT_LIST_RESET } from "../store/constants/productConstants";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";
import { listProfiles } from "../store/actions/userActions";
import { listStores } from "../store/actions/storeActions";

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProfiles());
    dispatch(listStores());
  }, [dispatch]);

  // Using React Query for faster reload between searches by mounting cached components.
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

  const { products: searchResult } = useSelector((state) => state.productList);

  const categoryFilterHandler = (keyword) => {
    dispatch({ type: PRODUCT_LIST_RESET });
    setSearching(true);
    dispatch(search({ type: "products", searchString: keyword }));
  };

  const isMobile = window.innerWidth < 600;

  return (
    <Container fluid>
      <SearchBox
        searchProps={{ type: "all", searchString: value }}
        actionType="PRODUCT_LIST_RESET"
        value={value}
        setValue={setValue}
        placeholder="Search product, brand or seller.."
      />
      <HomeCategoriesBar
        categories={categoriesQuery.data}
        categoryFilterHandler={categoryFilterHandler}
      />
      {(searching || value.length > 1) && (
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
      <Row>
        <Row>
          {!searching && value.length < 2 && !isMobile && (
            <>
              <Reviews latestReviews={latestReviewsQuery.data} />
              <ProductCarousel latestProducts={latestProductsQuery.data} />
              <News />
            </>
          )}
        </Row>
        <Row style={{ margin: "0" }}>
          {!isMobile && (
            <Col xl={2} className="d-md-none d-lg-block">
              <HomeSidebar
                categories={categoriesQuery.data}
                categoryFilterHandler={categoryFilterHandler}
              />
            </Col>
          )}
          <Col>
            {value.length <= 1 && !searching ? (
              <>
                <Row>
                  {data?.pages.map((page, index) => {
                    return page.results.map((product) => {
                      return (
                        <Col xs={6} md={4} xl={3} className="gx-1 gy-1">
                          <ProductCard product={product} key={index} />
                        </Col>
                      );
                    });
                  })}
                </Row>
                <Row style={{ justifyContent: "center" }}>
                  {data && value.length === 0 && (
                    <Button
                      style={{ width: "200px", marginTop: "10px" }}
                      onClick={() => fetchNextPage()}
                      disabled={!hasNextPage || isFetchingNextPage}
                    >
                      {isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage
                        ? "Load More"
                        : "Nothing more to load"}
                    </Button>
                  )}
                </Row>
              </>
            ) : (
              <Row>
                {searchResult?.map((product, index) => {
                  return (
                    <Col xs={6} md={4} xl={3} className="gx-1 gy-1">
                      <ProductCard product={product} key={index} />
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
        </Row>
      </Row>
    </Container>
  );
}
