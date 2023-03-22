import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../store/actions/cartActions'

function CartScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    const { quantity, id, storeName, storeStock } = location.state ? location.state : 1

    const { userInfo } = useSelector(state => state.userLogin)
    const { cartItems } = useSelector(state => state.cart)

    useEffect(() => {
        if (id) {
            dispatch(addToCart(id, quantity, storeName, storeStock))
        }
    }, [dispatch, id, quantity, storeName, storeStock])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        if (!userInfo) {
        navigate('/login')
        } else {
          navigate('/shipping')
        }
      }

    return (
        <Row className='m-3'>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Message>
                ) : (
                        <ListGroup variant='flush'>
                            {cartItems.map(product => (  
                                <ListGroup.Item key={product.id}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={product.image} alt={product.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                                        </Col>

                                        <Col md={2}>
                                            ${product.price}
                                        </Col>

                                        <Col md={3}>
                                    <>
                                                {product.storeName}
                                                {console.log('dddddddddddddddd', product)}
                                                <Form.Control
                                                    as="select"
                                                    value={product.quantity}
                                                    onChange={(e) => dispatch(addToCart(product.id, Number(e.target.value), product.storeName, product.storeStock ))}
                                                >
                                                    {
                                                        [...Array(product.storeStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))
                                                    }
                                                </Form.Control>
                                                </>    
                                        </Col>

                                        <Col md={1}>
                                            <Button
                                                type='button'
                                                variant='light'
                                                onClick={() => removeFromCartHandler(product.id)}
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 style={{ fontSize: '1.4rem', padding: '0.5rem 0' }}>Subtotal ({cartItems.reduce((acc, product) => acc + product.quantity, 0)}) items</h2>
                            ${cartItems.reduce((acc, product) => acc + product.quantity * product.price, 0).toFixed(2)}
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup.Item>
                        <Button
                            type='button'
                            className='btn-block'
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </ListGroup.Item>
                </Card>
            </Col>
        </Row>

    )
}

export default CartScreen