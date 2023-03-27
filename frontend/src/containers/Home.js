import React, { useEffect, useState } from "react";
import { Row, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductCategories } from "../store/actions/categoriesActions";
import {
  listLatestProducts,
  listLatestReviews,
  listProducts,
} from "../store/actions/productActions";
import { listStores } from "../store/actions/storeActions";
import Reviews from "../components/Reviews";
import News from "../components/News";
import SearchBox from "../components/SearchBox";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import HomeSidebar from "../components/HomeSidebar";
import HomeCategoriesBar from "../components/HomeCategoriesBar";
import { listProfiles } from "../store/actions/userActions";
import { search } from "../store/actions/searchAction";
import Loader from "../components/Loader";
import { PRODUCT_LIST_RESET } from "../store/constants/productConstants";

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [showResult, setShowResult] = useState(false);

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.productCategories);
  const { products, loading } = useSelector((state) => state.productList);
  const { profiles } = useSelector((state) => state.profileList);
  const { latestReviews, loading: reviewLoading } = useSelector(
    (state) => state.latestReviewsList
  );
  const { latestProducts } = useSelector((state) => state.latestProductsList);

  useEffect(() => {
    dispatch(listProductCategories());
    dispatch(listLatestProducts());
    dispatch(listStores());
    dispatch(listProducts());
    dispatch(listProfiles());
    dispatch(listLatestReviews());
  }, [dispatch]);

  const categoryFilterHandler = (keyword) => {
    dispatch({ type: PRODUCT_LIST_RESET });
    setShowResult(true);
    dispatch(search({ type: "products", searchString: keyword }));
  };

  return (
    <>
      <SearchBox
        searchProps={{ type: "all" }}
        value={value}
        setValue={setValue}
        placeholder="Search products, brands or sellers.."
        width="50%"
      />
      <HomeCategoriesBar
        categories={categories}
        categoryFilterHandler={categoryFilterHandler}
      />
      {(showResult || value.length > 1) && (
        <Button
          onClick={() => setShowResult(false) + setValue('')}
          variant="light"
          className="mx-2"
        >
          Back
        </Button>
      )}
      <Row>
        {!showResult && value.length < 2 && (
          <Row>
            <Reviews loading={reviewLoading} latestReviews={latestReviews} />
            <ProductCarousel latestProducts={latestProducts} />
            <News />
          </Row>
        )}
        <Row>
          <HomeSidebar
            categories={categories}
            categoryFilterHandler={categoryFilterHandler}
          />
          <Col>
            <Row>
              {products.map((product) => {
                return (
                  <Col sm={12} md={6} lg={4} xl={3} className="gx-3 gy-2">
                    <ProductCard product={product} profiles={profiles} />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Row>
    </>
  );
}
