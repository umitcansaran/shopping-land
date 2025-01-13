import React from "react";
import { Carousel, Col, Image, Row } from "react-bootstrap";
import Rating from "../../components/Rating";
import { Link } from "react-router-dom";

export default function LatestReviews({ latestReviews = [] }) {

  return (
    <Row>
      <h5 className="text-center">Latest Reviews</h5>
      <Carousel className="reviews-carousel">
        {latestReviews.map((review, index) => {
          return (
            review && (
              <Carousel.Item key={index}>
                <Row className="text-center">
                  <Rating value={review.rating} color={"#f8e825"} />
                  <Link
                    to={`/product/${review.product_id}`}
                    style={{ color: "#32415c" }}
                  >
                    <Row className="d-flex justify-content-center">
                      <Image
                        src={review.image}
                        className="d-flex justify-content-center my-2"
                        style={{ width: "auto", height: "8rem" }}
                        alt="latest-reviews"
                      />
                    </Row>
                    <h5 className=" mb-3" style={{ color: "#5b6da8" }}>
                      {review.product_brand}
                    </h5>
                    <strong>
                      <h6 className="mb-3">{review.name}</h6>
                    </strong>
                    <Row style={{ overflow:'hidden', height:'3rem', marginBottom:'1.5rem' }}> 
                      <p>
                        <i className="fas fa-quote-left pe-2"></i>
                        {review.comment}
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
    </Row>
  );
}
