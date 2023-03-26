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

export default function HomeScreen() {
  const [value, setValue] = useState("");
  const [showResult, setShowResult] = useState(false);

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.productCategories);
  const { products } = useSelector((state) => state.productList);
  const { profiles } = useSelector((state) => state.profileList);
  const { latestReviews, loading: reviewLoading } = useSelector(
    (state) => state.latestReviewsList
  );
  const { latestProducts } = useSelector((state) => state.latestProductsList);
  console.log(products);

  useEffect(() => {
    dispatch(listProductCategories());
    dispatch(listLatestProducts());
    dispatch(listStores());
    dispatch(listProducts());
    dispatch(listProfiles());
    dispatch(listLatestReviews());
  }, [dispatch]);

  const categoryFilterHandler = (keyword) => {
    setShowResult(true);
    dispatch(search({ type: "products", searchString: keyword }));
  };

  const searchProps = {
    type: "all",
  };

  return (
    <>
      <SearchBox
        searchProps={searchProps}
        value={value}
        setValue={setValue}
        placeholder="Search for a product, brand or retailer name.."
        color="#1e478a"
        width="50%"
      />
      <HomeCategoriesBar
        categories={categories}
        categoryFilterHandler={categoryFilterHandler}
      />
      {showResult && (
        <Button
          onClick={() => setShowResult(false)}
          variant="secondary"
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
        <Row className="my-2">
          <HomeSidebar
            categories={categories}
            categoryFilterHandler={categoryFilterHandler}
          />
          <Col>
            <Row>
              {products &&
                products.map((product) => {
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
