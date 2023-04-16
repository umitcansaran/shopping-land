import React, { useEffect, useState } from "react";
import { Row, Button, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductCategories } from "../store/actions/categoriesActions";
import {
  listLatestProducts,
  listLatestReviews,
  listProducts,
} from "../store/actions/productActions";
import Reviews from "../components/Reviews";
import News from "../components/News";
import SearchBox from "../components/SearchBox";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import HomeSidebar from "../components/HomeSidebar";
import HomeCategoriesBar from "../components/HomeCategoriesBar";
import { search } from "../store/actions/searchAction";
import { PRODUCT_LIST_RESET } from "../store/constants/productConstants";
import Loader from "../components/Loader";
import useSWR from "swr";
import axios from "axios";

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();

  const {
    products: productList,
    loading,
    success,
  } = useSelector((state) => state.productList);

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  const { data: productsData, isLoading: loadingProducts } = useSWR(
    "/api/products/",
    fetcher
  );
  const { data: latestReviews, isLoading: loadingReviews } = useSWR(
    "/api/latest-reviews/",
    fetcher
  );
  const { data: latestProducts, isLoading: loadingLatestProducts } = useSWR(
    "/api/latest-products/",
    fetcher
  );
  const { data: categories } = useSWR("/api/product-categories/", fetcher);

  let products;
  value.length <= 1 && !searchResult
    ? (products = productsData)
    : (products = productList);

  const categoryFilterHandler = (keyword) => {
    dispatch({ type: PRODUCT_LIST_RESET });
    setSearchResult(true);
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
        placeholder="Search products, brands or sellers.."
      />
      <HomeCategoriesBar
        categories={categories}
        categoryFilterHandler={categoryFilterHandler}
      />
      {(searchResult || value.length > 1) && (
        <Button
          onClick={() =>
            setSearchResult(false) + setValue("") + setRedirect(!redirect)
          }
          variant="light"
          className="mx-2"
        >
          Back
        </Button>
      )}
      <Row>
        <Row>
          {!searchResult && value.length < 2 && !isMobile && (
            <>
              <Reviews latestReviews={latestReviews} />
              <ProductCarousel latestProducts={latestProducts} />
              <News />
            </>
          )}
        </Row>
        <Row style={{ margin: "0" }}>
          {!isMobile && (
            <Col lg={2} xl={2}>
              <HomeSidebar
                categories={categories}
                categoryFilterHandler={categoryFilterHandler}
              />
            </Col>
          )}
          <Col>
            <Row>
              {products &&
                products.map((product, index) => {
                  return (
                    <Col xs={6} md={6} lg={4} xl={3} className="gx-1 gy-1">
                      <ProductCard product={product} key={index} />
                    </Col>
                  );
                })}
            </Row>
          </Col>
        </Row>
      </Row>
    </Container>
  );
}
