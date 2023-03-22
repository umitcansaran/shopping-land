import React, { useEffect, useState } from 'react'
import { Card, Row, Col, ListGroup, Form, Image, Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { listProductCategories } from '../store/actions/categoriesActions'
import { listProducts, listReviews, listLatestProducts } from '../store/actions/productActions'
import { search } from '../store/actions/searchAction'
import { listStores } from '../store/actions/storeActions'
import { listUsers, getProfileDetails } from '../store/actions/userActions'
import { CFormCheck } from '@coreui/react';

export default function RetailerScreen() {

    const [mainSearchValue, setMainSearchValue] = useState('')
    const [radioSearchValue, setRadioSearchValue] = useState('')
    const [storeName, setStoreName] = useState('')

    const dispatch = useDispatch()
    const params = useParams()

    const { products } = useSelector(state => state.productList)
    const { stores } = useSelector(state => state.storeList)
    const { profile } = useSelector(state => state.profileDetails)

    useEffect(() => {
        dispatch(getProfileDetails(params.id))
        dispatch(listProductCategories())
        dispatch(listProducts())
        dispatch(listLatestProducts())
        dispatch(listReviews())
        dispatch(listStores())
        dispatch(listUsers())
    }, [dispatch, params.id])

    const retailerProducts = products.filter(product => product.seller === profile.name)

    const mainSearchHandler = (e) => {
        e.preventDefault()
        setMainSearchValue(e.target.value)
        dispatch(search({ type: 'all', searchString: e.target.value }))
    }

    const radioSearchHandler = (e) => {  
        setRadioSearchValue(e.target.value)    
        dispatch(search({ type: 'product_in_store', store: storeName, searchString: e.target.value }))
    }

    const radioChange = (store) => {
        setStoreName(store)
        setRadioSearchValue('')
    }

    const storeNames = stores.filter(store => store.owner_name === profile.name)

  return (
    <>
        <Row style={{ backgroundColor:'#1e478a', height:'3rem' }}>
            <Form className="d-flex justify-content-center my-2" style={{ height:'2rem' }}>
                <Form.Control
                type="search"
                placeholder="Search for a product, store or brand.."
                aria-label="Search"
                style={{width: '50%', borderRadius: '30px 30px 30px 30px' }}
                value={mainSearchValue}
                onChange={(e) => mainSearchHandler(e)}
                />
                </Form>
        </Row>
        <Container>
        <Row className='mt-3 justify-content-center pb-2' style={{ borderBottom:'solid 1px lightgrey' }}>
            <Col className='text-center align-items-center' md={5} >
            <Image src={profile.image} style={{ width:'auto', height:'6rem' }} />
            </Col>
            <Col md={7}>
                <ListGroup variant="flush" style={{ fontSize:'0.8rem' }}>
                    <ListGroup.Item>
                        <strong>Industry: </strong>{profile.industry}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Headquarter: </strong>{profile.headquarter}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Description: </strong>{profile.description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
        </Container>
         <Row className='mt-3 px-2'>
         <Col md={2} className='m-4'>
            <strong><p style={{ textAlign:'center', fontSize:'0.9rem' }}>Select a store to search for a product id, brand or name..</p></strong>
            <Form className="d-flex justify-content-center mb-3">
                <Form.Control
                type="search"
                placeholder="Search"
                aria-label="Search"
                style={{width: '100%', borderRadius: '20px 20px 20px 20px', borderColor:'#233fa6' }}
                value={radioSearchValue}
                onChange={(e) => radioSearchHandler(e)}
                />
            </Form>
                        {storeNames.map(store => {
                            return ( <CFormCheck 
                                    type="radio" 
                                    name="flexRadioDefault" 
                                    id="flexRadioDefault1" 
                                    label={store.name}
                                    onClick={(e)=>{radioChange(store.name)}}
                                    style={{ backgroundColor:'#233fa6' }}
                                    className='my-2'
                                    />)   
                        })}
            </Col>
            <Col>
                <Row>
                    {retailerProducts.map((product, index) => {
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
                            </Card.Body>
                            </Row>
                        </Card> 
                        </Col>
                        )
                     })} 
                </Row>
            </Col>
        </Row> 
    </>
  );
}