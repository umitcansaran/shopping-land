import React, { useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listStoreStocks } from '../store/actions/storeActions'
import { STORE_STOCKS_RESET } from '../store/constants/storeConstants'

function MyStoreStocks({ store, searchHandler, value }) {

    const dispatch = useDispatch()

    const { stocks } = useSelector(state => state.storeStocks)

    useEffect(() => {
        dispatch({ type: STORE_STOCKS_RESET })
        dispatch(listStoreStocks(store.id))
    }, [dispatch])

    return (
        <>
            <tr>
                <td colSpan='6'>
                    <Row>
                        <Form className="d-flex justify-content-center" style={{ height:'2rem' }}>
                            <Form.Control
                            type="search"
                            placeholder='Search for an id, brand or name..'
                            aria-label="Search"
                            style={{width: '50%', borderRadius: '30px 30px 30px 30px' }}
                            value={value}
                            onChange={(e) => searchHandler(e, store.name)}
                            />
                        </Form>
                    </Row>
                </td>
            </tr>
            <tr>
                <td colSpan="6">
                    <Row className="d-flex justify-content-center px-5 text-center">
                        <Row style={{ width:'80%' }}>
                            <Col>ID</Col>
                            <Col>BRAND</Col>
                            <Col>NAME</Col>
                            <Col>PRICE</Col>
                            <Col>CATEGORY</Col>   
                            <Col>STOCK</Col>                         
                        </Row>
                    </Row>
                </td>
            </tr>
            <tr> 
                <td colSpan="6">
                    {stocks && stocks.map((stock, index)=>{
                                return <>
                                <Row className='d-flex justify-content-center mb-1' style={{ fontSize:'0.8rem'}} key={index} >
                                    <Row style={{ width:'80%', border:'solid 0.07rem lightgrey', backgroundColor:'#f2f5fa', borderRadius: '5px 5px 5px 5px'  }} className='p-1 px-5 text-center'>
                                        <Col>{stock.product_details.id}</Col>
                                        <Col><strong>{stock.product_details.brand}</strong></Col>
                                        <Col>{stock.product_details.name}</Col>
                                        <Col>{stock.product_details.price}</Col>
                                        <Col>{stock.product_details.category}</Col>
                                        <Col>{stock.number}</Col>
                                    </Row>
                                </Row> 
                            </>   
                        })
                    } 
                </td>
            </tr>
        </>
    )
}

export default MyStoreStocks