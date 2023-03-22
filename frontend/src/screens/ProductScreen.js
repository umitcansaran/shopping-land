import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Row, Col, Image, Badge, ListGroup, Button, Card, Form, Container } from 'react-bootstrap'
import { listProductDetails, createProductReview, listReviews } from '../store/actions/productActions'
import { myDetails, listUsers, listProfiles } from '../store/actions/userActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../store/constants/productConstants'

function ProductScreen() {

    const [quantity, setQuantity] = useState(0)
    const [selectedStore, setSelectedStore] = useState({})
    const [storeName, setStoreName] = useState('')
    const [storeStock, setStoreStock] = useState('')

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const { product, error, loading } = useSelector(state => state.productDetails)
    const { user } = useSelector(state => state.myDetails) 
    const { profiles } = useSelector(state => state.profileList)
    const { reviews } = useSelector(state => state.reviewList)
    const { userInfo } = useSelector(state => state.userLogin)
    const { loading: loadingProductReview, error: errorProductReview, success: successProductReview } = useSelector(state => state.productReviewCreate)

    useEffect(()=>{
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        dispatch(listProductDetails(params.id))
        dispatch(myDetails())
        dispatch(listReviews())
        dispatch(listUsers())
        dispatch(listProfiles())
    },[dispatch, params, successProductReview])

    const checkStocks = product.stocks && product.stocks.filter((stock) => {
        return stock.number > 0
    })    

    const productReviews = reviews.filter((review) => review.product.id === product.id)

    const seller = profiles && profiles.find(profile => profile.name === product.seller)

    const storeInfo = (e, store, stock) => {
        setQuantity(Number(e.target.value))
        setStoreName(store)
        setStoreStock(stock)
    }
    
    const addToCartHandler = () => {
        navigate('/cart', {state: {quantity, id: product.id, storeName, storeStock}})
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(params.id, {rating, comment} ))
    }

    return (
        <Container>
            <Button onClick={()=>navigate(-1)} className='btn btn-light my-3'>Go Back </Button>
            {loading ?
                <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (
                        <div>
                            <Row>
                                <Col md={4} >
                                    <Image className="rounded mx-auto d-block" src={product.image} alt={product.name} fluid />
                                </Col>

                                <Col md={4}>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <h3 style={{ color:'#1e478a' }}>{product.brand}</h3>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            Price: CHF {Math.trunc(product.price)}
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            Description: {product.description}
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            Product ID: {product.id}
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            Sold by <Link to={`/retailers/${seller && seller.id}`}>
                                            {seller && seller.name}
                                            </Link>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>

                                <Col md={4}>
                                    <Card>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col>
                                                        <strong>CHF {Math.trunc(product.price)}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col>
                                                        {checkStocks && checkStocks.length > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            {checkStocks && checkStocks.length > 0  && (
                                                <>
                                                <ListGroup.Item>
                                                <Row>
                                                    <Col>Select a store:</Col>
                                                </Row>
                                                {checkStocks.map((stock, index)=>{
                                                    return (
                                                        <>
                                                    <Row className='my-2'>
                                                    <Col md={9}>
                                                    
                                                        <Button variant="light" style={{ width:'100%', textAlign:'left', fontSize:'0.8rem', textTransform:'unset' }} onClick={()=>{
                                                            Object.keys(checkStocks).forEach(key => {
                                                                selectedStore[key] = false;
                                                                setSelectedStore({
                                                                    ...selectedStore,
                                                                    [index]: true
                                                                });  
                                                            });
                                                        }
                                                        }
                                                        >
                                                            <Row>

                                                            <Col className="d-flex justify-content-start align-items-center" style={{ color:'#233fa6' }}>
                                                            {stock.store_name}
                                                            </Col>
                                                            <Col >
                                                            Stock <Badge bg="success" className="d-flex justify-content-start">{stock.number}</Badge>
                                                            </Col>
                                                            </Row>
                                                        </Button>
                                                    </Col>
                                                        {
                                                            selectedStore[index] && (
                                                            <Col md={3} className="d-flex align-items-center" >
                                                                <Form.Select
                                                            as="select"
                                                            value={quantity}
                                                            onChange={(e)=>storeInfo(e, stock.store_name, Number(stock.number))}
                                                            >
                                                                <option key={0} value={0}>0</option>
                                                            {
                                                                [...Array(stock.number).keys()].map((x) => (                                                                
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                ))
                                                            }
                                                            </Form.Select>
                                                            </Col>
                                                            )
                                                        }
                                                </Row>
                                                    </>
                                                    )
                                                })}                                                    
                                                </ListGroup.Item>
                                            </>
                                            )}

                                            {/* { user && user.profile[0].status === 'STORE_OWNER' && (
                                            <ListGroup.Item>
                                                <Message variant='danger'>Seller accounts are not able to make purchases.</Message>
                                            </ListGroup.Item>
                                            )} */}

                                            <ListGroup.Item>
                                                <Button
                                                    onClick={addToCartHandler}
                                                    className='btn-block'
                                                    disabled={checkStocks && checkStocks.length === 0}
                                                    type='button'>
                                                    Add to Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <h4>Reviews</h4>
                                    {productReviews && productReviews.length === 0 && <Message variant='info'>No Reviews</Message>}

                                    <ListGroup variant='flush'>
                                        {productReviews && productReviews.map((review, index) => (
                                            <ListGroup.Item key={index}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} color='#f8e825' />
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}
                                                    <ListGroup.Item>
                                                    <h4>Write a review</h4>
                                                    {loadingProductReview && <Loader />}
                                                    {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
        
                                                    {
                                                  userInfo ? (
                                                    user && user.profile[0].status === 'CUSTOMER' ? (
                                                        <Form onSubmit={submitHandler}>
                                                            <Form.Group controlId='rating'>
                                                                <Form.Label>Rating</Form.Label>
                                                                <Form.Control
                                                                    as='select'
                                                                    value={rating}
                                                                    onChange={(e) => setRating(e.target.value)}
                                                                >
                                                                    <option value=''>Select...</option>
                                                                    <option value='1'>1 - Poor</option>
                                                                    <option value='2'>2 - Fair</option>
                                                                    <option value='3'>3 - Good</option>
                                                                    <option value='4'>4 - Very Good</option>
                                                                    <option value='5'>5 - Excellent</option>
                                                                </Form.Control>
                                                            </Form.Group>
        
                                                            <Form.Group controlId='comment'>
                                                                <Form.Label>Review</Form.Label>
                                                                <Form.Control
                                                                    as='textarea'
                                                                    row='5'
                                                                    value={comment}
                                                                    onChange={(e) => setComment(e.target.value)}
                                                                ></Form.Control>
                                                            </Form.Group>
        
                                                            <Button
                                                                disabled={loadingProductReview}
                                                                type='submit'
                                                                variant='primary'
                                                            >
                                                                Submit
                                                            </Button>
        
                                                        </Form>
                                                    ) : (
                                                        <Message variant='info'>Only users with a customer profile can write a review</Message>
                                                        )
                                                  ) : (
                                                    <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                                                  )
                                                 }
                                                </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </div>
                    )

            }

        </Container >
    )
}

export default ProductScreen