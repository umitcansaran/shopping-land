import React from "react";
import { Carousel, Col, Image, Row } from "react-bootstrap";
import Rating from "../../components/Rating";
import { Link } from "react-router-dom";

export default function LatestReviews({ latestReviews = [] }) {
  const charLimit =
    window.innerWidth < 1300 ? 30 : window.innerWidth < 1600 ? 40 : 70;

  return (
    <Col md={3}>
      <h5 className="text-center">Latest Reviews</h5>
      <Carousel>
        {latestReviews.map((review, index) => {
          return (
            review && (
              <Carousel.Item key={index}>
                <Row className="text-center">
                  <Rating value={review.rating} color={"#f8e825"} />
                  <Link
                    to={`/product/${review.product.id}`}
                    style={{ color: "#32415c" }}
                  >
                    <Row className="d-flex justify-content-center">
                      <Image
                        src={review.product.image}
                        className="d-flex justify-content-center my-2"
                        style={{ width: "auto", height: "8rem" }}
                        alt="latest-reviews"
                      />
                    </Row>
                    <h5 className=" mb-3" style={{ color: "#5b6da8" }}>
                      {review.product.brand}
                    </h5>
                    <strong>
                      <h6 className="mb-3">{review.product.name}</h6>
                    </strong>
                    <Row>
                      <p>
                        <i className="fas fa-quote-left pe-2"></i>
                        {review.comment.length > charLimit
                          ? review.comment.substring(0, charLimit) + "..."
                          : review.comment}
                      </p>
                    </Row>
                  </Link>
                  <p>reviewed by {review.name}</p>
                </Row>
              </Carousel.Item>
            )
          );
        })}
      </Carousel>
    </Col>
  );
}
