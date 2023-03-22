import React, { useEffect, useState } from 'react'
import { Nav, Row, Carousel, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { listProductCategories } from '../store/actions/categoriesActions'
import { listProducts, listReviews, listLatestProducts } from '../store/actions/productActions'
import { search } from '../store/actions/searchAction'
import { listStores } from '../store/actions/storeActions'
import { listUsers, listProfiles } from '../store/actions/userActions'
import { CFormCheck } from '@coreui/react';
import Reviews from '../components/Reviews';
import News from '../components/News';
import SearchBox from '../components/SearchBox';
import ProductCard from '../components/ProductCard';

export default function HomeScreen() {

    const [value, setValue] = useState('')
    const [showResult, setShowResult] = useState(false)

    const dispatch = useDispatch()
    const { categories } = useSelector(state => state.productCategories)
    const { latestProducts } = useSelector(state => state.latestProductsList)

    useEffect(() => {
        dispatch(listProductCategories())
        dispatch(listProducts())
        dispatch(listLatestProducts())
        dispatch(listReviews())
        dispatch(listStores())
        dispatch(listUsers())
        dispatch(listProfiles())
    }, [dispatch])

    const categoryFilterHandler = (keyword) => {
        setShowResult(true)
        dispatch(search({ type: 'products', searchString: keyword }))
    }

  return (
    <>
        < SearchBox value={value} setValue={setValue} type='all' placeholder='Search for a product, brand or retailer name..' color='#1e478a' width='50%' />
        <Nav className='justify-content-evenly'>
            {categories.map((category)=>{
            return (
                  <Nav.Item key={category.id}>
                    <Nav.Link onClick={()=>{categoryFilterHandler(category.name)}}>{category.name}</Nav.Link>
                  </Nav.Item>
            )
        })}
        </Nav>
        {
        showResult && (
            <Button onClick={() => setShowResult(false)} variant='secondary' className='mx-2'>Back</Button>
        )
        }
        <Row >
        {
            (!showResult && value === '') && (
                <Row >
        < Reviews />
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
        < News />
        
        </Row>
            )
        }
            <Row className='my-2'>
                    <Col lg={2} xl={2} className='m-4'>
                        {categories.map((category) => {
                            return <>
                                <h5 className='my-3' style={{ color:'#1e478a' }} key={category.id}>{category.name}</h5>
                                {category.subcategories.map((subcategory) => {
                                    return <CFormCheck 
                                    type="radio" 
                                    name="flexRadioDefault" 
                                    id="flexRadioDefault1" 
                                    label={subcategory.name}
                                    style={{ backgroundColor:'#1e478a' }}
                                    onChange={() => {categoryFilterHandler(subcategory.name)}}
                                    className='my-2'
                                    key={subcategory.id}
                                    />
                                })}
                                </>      
                        })}
                    </Col>
                   < ProductCard />
            </Row>  
    </Row>
    
    </>
  );
}