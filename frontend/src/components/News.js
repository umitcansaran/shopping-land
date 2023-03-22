import React, { useEffect } from 'react'
import { Carousel, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { listProducts, listReviews } from '../store/actions/productActions'

function News() {

    const dispatch = useDispatch()

    const latestNews = [{
        image: "https://shoppingland.s3.eu-central-1.amazonaws.com/HomePod-2-White-and-Midnight-Feature-Blue-Orange.jpeg",
        comment: 'Apple Releases HomePod 16.3 Software With Humidity and Temperature Sensing.',
        link: 'https://www.macrumors.com/2023/01/24/apple-releases-homepod-16-3-software/'
    },
    {
        image: "https://shoppingland.s3.eu-central-1.amazonaws.com/Galaxy_Fold4_Flip4_Buds2pro_PR_dl4-1024x683.jpeg",
        comment: 'Samsung Galaxy Z Flip4 and Galaxy Z Fold4: The Most Versatile Devices, Changing the Way We Interact With Smartphones.',
        link: 'https://news.samsung.com/medialibrary/global/photo/52909?album=103'
    }]

    useEffect(() => {
        dispatch(listProducts())
        dispatch(listReviews())
    }, [dispatch])
    
  return (
    <Col md={3} className='pt-3'>
    <h5 className='text-center'>Latest News</h5>
    <Carousel style={{ height:'23rem' }}>
    {latestNews.map(news => {
                return (
                    news &&
    <Carousel.Item onClick={() => window.location = news.link}>
                <Link>
        <div className="row text-center">
            <div className="d-flex justify-content-center p-3">
                <img src={news.image}
                className="d-flex justify-content-center my-2"
                style={{ width:'8rem', height:'8rem', borderRadius:'50%' }} 
                alt="latest-news"/>
            </div>
            <p style={{ marginTop:'2rem', fontSize:'1rem' }}>{news.comment}</p>
        </div>
                </Link>
    </Carousel.Item>
    )})} 
    </Carousel>
</Col>
  )
}

export default News