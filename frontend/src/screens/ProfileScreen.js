import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import EditProfileScreen from '../components/EditProfileScreen';
import { Row, Col, Image, Badge, ListGroup, Button, Card, Form, Container, ListGroupItem } from 'react-bootstrap'
import { listProductDetails, createProductReview } from '../store/actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../store/constants/productConstants'
import { logout, myDetails } from '../store/actions/userActions'
import { listProductCategories } from '../store/actions/categoriesActions';
import { baseUrl } from "../store/constants";
import axios from 'axios'

function ProfileScreen() {
    
    const [editProfile, setEditProfile] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const { user } = useSelector(state => state.myDetails) 
    const { categories } = useSelector(state => state.productCategories)

    const profile = user.profile[0]
    
    useEffect(() => {
        dispatch(listProductCategories)
    }, [dispatch])

    const deleteUser = async () => {
        if (window.confirm('Are you sure')) {
            await axios.delete(`${ baseUrl }/api/user/${user.id}/`)
            dispatch(logout())
            navigate('/')
        }
      }

      console.log(user)

  return (
    <>
    {
       !editProfile && profile.status === 'STORE_OWNER' && (
            <>
    <Row className='mt-4 justify-content-center'>
            <Image src={user.profile[0].image} style={{ width:'20rem', height:'auto' }} />
    </Row>
    <Row className='mt-3 d-flex justify-content-center'>
        <Col md={4}>
            <ListGroup variant="flush" >
                <ListGroup.Item>
                    <strong>Name: </strong>{user.username}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Email: </strong>{user.email}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Status: </strong>Retailer
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Category: </strong>
                    {profile.category.map((profileCategory) => {
                        const categoryName = categories.find(category => category.id === profileCategory)
                        return <li>{categoryName && categoryName.name}</li>
                    })}
                </ListGroup.Item>
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
    </>
        )
    }
    {
        !editProfile && profile.status === 'CUSTOMER' && (
            <>
    <Row className='mt-4 justify-content-center'>
            <Image src={user.profile[0].image} style={{ width:'20rem', height:'auto' }} />
    </Row>
    <Row className='mt-3 d-flex justify-content-center'>
        <Col md={4}>
            <ListGroup variant="flush" >
                <ListGroup.Item>
                    <strong>Name: </strong>{user.username}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Email: </strong>{user.email}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Status: </strong>Customer
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Date Joined: </strong>{user.date_joined.substring(0, 10)}
                </ListGroup.Item>
                {
                    user.last_login && (
                <ListGroup.Item>
                    <strong>Last Login: </strong>{user.last_login.substring(0, 10)}
                </ListGroup.Item>
                    )
                }
            </ListGroup>
        </Col>
    </Row>
    </>
        )
    }

    { editProfile && (
        < EditProfileScreen />
        )
    }  
        
    <Row className='justify-content-center mt-4' >
        <Button className='mt-3' style={{ width:'13rem' }} onClick={() => setEditProfile(!editProfile)}>{ !editProfile ? 'Edit Profile' : 'Back to Profile' }</Button>
    </Row>
        {
            !editProfile && (
            <Row className='justify-content-center mt-4'>
                <Button onClick={(() => deleteUser())} className='mt-3 btn-danger' style={{ width:'13rem'}}>
                    Delete Your Account
                </Button>
            </Row>  
            )
        }
    </> 
    )
}

export default ProfileScreen