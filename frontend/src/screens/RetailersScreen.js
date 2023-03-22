import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Image, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { search } from '../store/actions/searchAction'
import { listProductCategories } from '../store/actions/categoriesActions'
import { listProfiles } from '../store/actions/userActions'
import { Link } from 'react-router-dom'

function RetailersScreen() {

    const [ showResult, setShowResult ] = useState(false)

    const dispatch = useDispatch()

    const { categories } = useSelector(state => state.productCategories)
    const { profiles } = useSelector(state => state.profileList)

    const storeOwners = profiles && profiles.filter(profile => profile.status === 'STORE_OWNER')

useEffect(() => {
    dispatch(listProductCategories())
    dispatch(listProfiles())
}, [dispatch])

const filterOptionHandler = (event) => {
    dispatch(search({ type: 'profiles', searchString: event.target.value}))
    setShowResult(true)
}

const filterResetHandler = () => {
    dispatch(listProfiles())
    setShowResult(false)
}

  return (
    <>
    <Row style={{ backgroundColor:'#1e478a', height:'3rem' }}>
             <Form.Select className="d-flex justify-content-center my-1" onChange={filterOptionHandler} aria-label="Default select example" style={{ width: '40%', margin: 'auto' }}>
                <option >Filter by Category</option>
                    {categories.map((category, index) => {  
                        return <option key={index}>{category.name}</option>
                    })}
            </Form.Select>
    </Row>  
    <p className="text-center">Click on an logo to access the seller's page..</p>

    {
        showResult && (
            <Button variant='secondary' onClick={() => filterResetHandler()} className='m-2'>Back</Button>
        )
    }
    <Row className='align-items-center'>
        {storeOwners && storeOwners.map((profile, index) => {
            return <>
                <Col md={2}>
                    <Link to={`/retailers/${profile.id}`}>
                        <Image className='p-2' src={profile.image} alt={profile.name} key={index} style={{ width:'60%', margin:"3rem" }}/>
                    </Link>
                </Col>
      
            </>
        })}
    </Row>
    </>
  )
}

export default RetailersScreen