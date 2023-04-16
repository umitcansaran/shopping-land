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
import { listProfiles } from "../store/actions/userActions";
import { search } from "../store/actions/searchAction";
import { PRODUCT_LIST_RESET } from "../store/constants/productConstants";
import Loader from "../components/Loader";
import useSWR from 'swr'
import axios from 'axios'

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.productCategories);
  const { products: productList, loading, success } = useSelector(
    (state) => state.productList
  );
  const { profiles } = useSelector((state) => state.profileList);
  const { latestReviews, loading: reviewLoading } = useSelector(
    (state) => state.latestReviewsList
  );
  const { latestProducts } = useSelector((state) => state.latestProductsList);

  const fetcher = url => axios.get(url).then(res => res.data)
  const { data, error, isLoading } = useSWR('/api/products/', fetcher)

  let products
  if (value.length <= 1) {
    products = data
  } else {
    products = productList
  }

  useEffect(() => {
    dispatch(listProductCategories());
    dispatch(listLatestProducts());
    dispatch(listProfiles());
    dispatch(listLatestReviews());
  }, [dispatch, redirect]);

  // useEffect(() => {
  //   if (value.length === 0) {
  //     dispatch(listProducts());
  //   } else if (value.length > 1) {
  //     dispatch({ type: PRODUCT_LIST_RESET });
  //     const timeout = setTimeout(() => {
  //       dispatch(search({type:'all', searchString: value}))
  //     }, 500);
  //     return () => clearTimeout(timeout);
  //   }
  // },[dispatch, value])

  const categoryFilterHandler = (keyword) => {
    dispatch({ type: PRODUCT_LIST_RESET });
    setShowResult(true);
    dispatch(search({ type: "products", searchString: keyword }));
  };

  const isMobile = window.innerWidth > 600;

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
      {(showResult || value.length > 1) && (
        <Button
          onClick={() =>
            setShowResult(false) + setValue("") + setRedirect(!redirect)
          }
          variant="light"
          className="mx-2"
        >
          Back
        </Button>
      )}
      <Row>
        {!showResult && value.length < 2 && isMobile && (
          <Row>
            <Reviews loading={reviewLoading} latestReviews={latestReviews} />
            <ProductCarousel latestProducts={latestProducts} />
            <News />
          </Row>
        )}
        <Row style={{ margin: "0" }}>
          {isMobile && (
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
                    <Col
                      sm={6}
                      md={6}
                      lg={4}
                      xl={3}
                      className="gx-1 gy-1 product-card"
                    >
                      <ProductCard
                        product={product}
                        profiles={profiles}
                        key={index}
                      />
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
