import React from "react";
import { Carousel, Col } from "react-bootstrap";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";

function Reviews({ latestReviews = [] }) {
  const charLimit =
    window.innerWidth < 1300 ? 30 : window.innerWidth < 1600 ? 40 : 70;

  return (
    <Col md={3} className="pt-3">
      <h5 className="text-center">Latest Reviews</h5>
      <Carousel style={{ height: "23rem" }}>
        {latestReviews.map((review, index) => {
          return (
            review && (
              <Carousel.Item key={index}>
                <div className="row text-center">
                  <Rating value={review.rating} color={"#f8e825"} />
                  <Link
                    to={`/product/${review.product.id}`}
                    style={{ color: "#32415c" }}
                  >
                    <div className="d-flex justify-content-center">
                      <img
                        src={review.product.image}
                        className="d-flex justify-content-center my-2"
                        style={{ width: "auto", height: "8rem" }}
                        alt="latest-reviews"
                      />
                    </div>
                    <h5 className="text-primary mb-3">
                      {review.product.brand}
                    </h5>
                    <strong>
                      <h6 className="mb-3" style={{ color: "black" }}>
                        {review.product.name}
                      </h6>
                    </strong>
                    <div style={{ height: 'auto' }}>
                      <p>
                        <i className="fas fa-quote-left pe-2"></i>
                        {review.comment.length > charLimit
                          ? review.comment.substring(0, charLimit) + "..."
                          : review.comment}
                      </p>
                    </div>
                  </Link>
                  <p>reviewed by {review.name}</p>
                </div>
              </Carousel.Item>
            )
          );
        })}
      </Carousel>
    </Col>
  );
}

export default Reviews;
