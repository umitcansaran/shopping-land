import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../store/actions/userActions'

const RegisterScreen = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profile, setProfile] = useState('CUSTOMER')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { error: registrationError } = useSelector(state => state.userRegister)
  const { error: loginError, loading, userInfo } = useSelector(state => state.userLogin)

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(username, email, password, profile))
    }
  }

  return (    
    <FormContainer>
      <h2 style={{textAlign:'center', marginTop:'1rem'}}>REGISTER</h2>

      <Nav variant="pills" defaultActiveKey="customer" className='justify-content-center'>
        <Nav.Item>
          <Nav.Link onClick={() => {setProfile('CUSTOMER')}} eventKey="customer">Customer</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => {setProfile('STORE_OWNER')}} eventKey="store-owner">Seller</Nav.Link>
        </Nav.Item>
      </Nav>

      {message && <Message variant='danger'>{message}</Message>}
      {(loginError || registrationError) && <Message variant='danger'>{loginError || registrationError}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group >
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='name'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group >
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group >
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <div style={{display:'flex', justifyContent:'center', marginTop:'1rem'}}>
          <Button type='submit' variant='primary'>
            Register
          </Button>
        </div>
        
      </Form>
    </FormContainer>
  )
}

export default RegisterScreen
