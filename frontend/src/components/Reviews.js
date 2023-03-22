import React, { useEffect } from 'react'
import { Carousel, Col } from 'react-bootstrap';
import Rating from '../components/Rating'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, listReviews } from '../store/actions/productActions'

function Reviews() {

    const dispatch = useDispatch()

    const { reviews } = useSelector(state => state.reviewList)

    const latestReviews = reviews.slice(0, 4);

    useEffect(() => {
        dispatch(listProducts())
        dispatch(listReviews())
    }, [dispatch])
    
  return (
    <Col md={3} className='pt-3'>
    <h5 className='text-center'>Latest Reviews</h5>
    <Carousel style={{ height:'23rem' }}>
    {latestReviews.map(review => {
                return (
                    review &&
    <Carousel.Item>
        <div className="row text-center">
            <Rating value={review.rating} color={'#f8e825'} />
        <Link to={`/product/${review.product.id}`}>
            <div className="d-flex justify-content-center">
                <img src={review.product.image}
                className="d-flex justify-content-center my-2"
                style={{ width:'auto', height:'8rem' }} 
                alt='latest-reviews'/>
            </div>
            <h5 className="text-primary mb-3">{review.product.brand}</h5>
            <strong><h6 className="mb-3" style={{ color:'black' }}>{review.product.name}</h6></strong>
            <p style={{ fontSize:'1rem' }}>
                <i className="fas fa-quote-left pe-2"></i>
                { review.comment.length > 70 ? (
                    review.comment.substring(0, 70) + '...'
                    ) : (
                        review.comment
                        )
                    }
            </p>
                    </Link>
            <p className="" style={{ fontSize:'0.9rem' }}>reviewed by {review.name}</p>
        </div>
    </Carousel.Item>
    )})} 
    </Carousel>
</Col>
  )
}

export default Reviews