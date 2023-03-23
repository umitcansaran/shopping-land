import React, { useEffect } from 'react'
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../store/actions/productActions'
import { listProfiles } from '../store/actions/userActions'

export default function ProductCard() {

    const dispatch = useDispatch()
    const { products } = useSelector(state => state.productList)
    const { profiles } = useSelector(state => state.profileList)

    useEffect(() => {
        dispatch(listProducts())
        dispatch(listProfiles())
    }, [dispatch])

  return (
                    <Col>
                        <Row>
                            {products && products.map((product) => {
                                const seller = profiles && profiles.find(profile => profile.name === product.seller)
                            return (
                                    <Col sm={12} md={6} lg={4} xl={3} className='gx-3 gy-2'>
                                    <Card className='main-product-card' key={product.id} style={{ padding:'0.2rem 0.2rem 0rem 0.2rem'}} >
                                    <Row style={{ height: '25rem' ,alignItems:'center', margin:'0' }}>
                                        <Link to={`/product/${product.id}`}>
                                            <Card.Img src={product.image} variant='top' className='card-img-top'/>
                                        </Link>
                                    </Row>
                                    <Row>
                                        <Card.Body>
                                            <Link to={`/product/${product.id}`}>
                                            <Card.Title className='text-center' style={{ letterSpacing:'0.06rem', color:'#1e478a' }}>
                                                    <strong>{product.brand}</strong>
                                                </Card.Title>
                                                <Card.Title className='text-center' style={{ fontSize:'1rem', color:'black' }}>
                                                    {product.name}
                                                </Card.Title>
                                            </Link>
                                            {
                                                product.description ? (
                                            <Card.Text style={{ fontSize:'1rem', textAlign:'center', margin:'0'}}>
                                            { product.description.length > 27 ? (
                                            product.description.substring(0, 27) + '...'
                                            ) : ( product.description )}
                                                </Card.Text>
                                                ) : <Card.Text style={{ fontSize:'0.9rem'}}>Product has no description.</Card.Text>
                                            }
                                            <Card.Text className='text-center m-0' style={{ fontSize:'1.3rem' }}>
                                                <strong>CHF {Math.trunc(product.price)}</strong>
                                            </Card.Text>
                                            <Card.Text style={{ fontSize:'1rem'}} className='text-center'>Sold by <Link to={`/retailers/${seller && seller.id}`}>
                                            {seller && seller.name}
                                            </Link>
                                            </Card.Text>
                                        </Card.Body>
                                        </Row>
                                    </Card> 
                                    </Col>
                            )                    
                                        })} 
                        </Row>
                    </Col>
  );
}