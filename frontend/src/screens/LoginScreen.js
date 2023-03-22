import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from "react-router-dom";
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { login } from '../store/actions/userActions'

function LoginScreen() {
    const [username, setUsername] = useState('Digitec')
    const [password, setPassword] = useState('django123')

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        } 
    }, [userLogin, navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(username, password))
    }

    return (
        <FormContainer >
            <h2 style={{textAlign: 'center', marginTop:'1rem'}}>SIGN IN</h2>

            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler} >

                <Form.Group controlId='email'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>


                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                
        <div style={{display:'flex', justifyContent:'center', marginTop:'1rem'}}>
          <Button type='submit' variant='primary'>
            Sign In
          </Button>
        </div>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? <Link
                        to='/register'>
                        Register
                        </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
