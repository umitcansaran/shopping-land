import React from 'react'
import { Carousel, Col, Image } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


function ProductCarousel() {

    const { latestProducts } = useSelector(state => state.latestProductsList)

  return (
    <Col md={6}>
            <Carousel pause='hover' style={{ backgroundColor:'#1e478a' }} className='text-center main-carousel'>
                    {latestProducts.map((product) => {
                        return (
                        <Carousel.Item key={product.id}>
                            <Link to={`/product/${product.id}`}>
                                    <h4 style={{ color:'#e8e8e8', letterSpacing:'0.06rem'}} className='pt-1'>{product.brand}</h4>
                                    <h5 style={{ color:'#e8e8e8', fontSize:'1rem' }}>{product.name}</h5>
                                <Image className='main-carousel-img' src={product.image} alt={product.name} fluid /> 
                                <h5 className='pt-2' style={{ color:'#e8e8e8'}}>CHF {Math.trunc(product.price)}</h5>
                            </Link>
                        </Carousel.Item>
                        )
                        })}
            </Carousel>
        </Col>
  )
}

export default ProductCarousel