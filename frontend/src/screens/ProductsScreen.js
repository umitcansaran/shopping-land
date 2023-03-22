import React, { useEffect } from 'react'
import { Row, Col, Image, ListGroup, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { search } from '../store/actions/searchAction'
import { listProductCategories } from '../store/actions/categoriesActions'
import { listProducts } from '../store/actions/productActions'
import { useNavigate } from 'react-router-dom'

function ProductsScreen2() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { products } = useSelector(state => state.productList)
    const { categories } = useSelector(state => state.productCategories)

useEffect(() => {
    dispatch(listProducts())
    dispatch(listProductCategories())
}, [dispatch])

const filterOptionHandler = (event) => {
    dispatch(search({ type: 'products', searchString: event.target.value}))
}

  return (
    <div>
            <Row className="d-flex justify-content-center pt-3">        
                <Form.Select
                aria-label="Default select example" 
                className="m-2" 
                style={{ width: '30%'}}
                onChange={filterOptionHandler}>
                    <option>Filter by Category</option>
                    {categories.map((category, index) => {  
                        return <option key={index}>{category.name}</option>
                    })}
                </Form.Select>
            </Row>
            <Row>

                {products.map((product, index) => {
                    return <>
                        <Col md={1} onClick={navigate(`/${product.id}`)}>
                            <Image className='p-2' src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={2}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.brand}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Address: {product.name}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Store: {product.store}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </>
                })}
            </Row>
                
    </div>
  )
}

export default ProductsScreen2