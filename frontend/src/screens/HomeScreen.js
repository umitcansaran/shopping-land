import React, { useEffect, useState } from 'react'
import { Row, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { listProductCategories } from '../store/actions/categoriesActions'
import { listLatestProducts, listLatestReviews, listProducts } from '../store/actions/productActions'
import { listStores } from '../store/actions/storeActions'
import Reviews from '../components/Reviews';
import News from '../components/News';
import SearchBox from '../components/SearchBox';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import HomeSidebar from '../components/HomeSidebar';
import HomeCategoriesBar from '../components/HomeCategoriesBar';
import { listProfiles } from '../store/actions/userActions';
import { search } from '../store/actions/searchAction';
import { PRODUCT_LIST_RESET } from '../store/constants/productConstants';

export default function HomeScreen() {

    const [value, setValue] = useState('')
    const [showResult, setShowResult] = useState(false)

    const dispatch = useDispatch()

    const { categories } = useSelector(state => state.productCategories)
    const { products, loading: productLoading } = useSelector(state => state.productList)
    const { profiles } = useSelector(state => state.profileList)
    const { latestReviews, loading: reviewLoading } = useSelector(state => state.latestReviewsList)
    const { latestProducts } = useSelector(state => state.latestProductsList)

    useEffect(() => {
        dispatch(listProductCategories())
        dispatch(listLatestProducts())
        dispatch(listStores())
        dispatch(listProducts())
        dispatch(listProfiles())
        dispatch(listLatestReviews())
    }, [dispatch])

    const categoryFilterHandler = (keyword) => {
        setShowResult(true)
        dispatch(search({ type: 'products', searchString: keyword }))
    }

  return (
    <>
        < SearchBox value={value} setValue={setValue} type='all' placeholder='Search for a product, brand or retailer name..' color='#1e478a' width='50%' />
        < HomeCategoriesBar categories={categories} categoryFilterHandler={categoryFilterHandler} />
        {
        showResult && (
            <Button onClick={() => setShowResult(false)} variant='secondary' className='mx-2'>Back</Button>
        )
        }
        <Row >
            {
                (!showResult && value.length < 2) && (
            <Row >
                < Reviews loading={reviewLoading} latestReviews={latestReviews} />
                < ProductCarousel latestProducts={latestProducts} />
                < News />
            </Row>
                )
            }
            <Row className='my-2'>
                < HomeSidebar categories={categories} categoryFilterHandler={categoryFilterHandler} />
                < ProductCard loading={productLoading} products={products} profiles={profiles} />
            </Row>  
        </Row>
    </>
  );
}