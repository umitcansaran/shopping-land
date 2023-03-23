import React from 'react'
import { Col, Row } from 'react-bootstrap'

function MyStoreStocks({ store, stocks }) {
  return (
    <tr> 
        <td colSpan="6">
        {stocks.map((stock, index)=>{
            if (stock.store_name) {
                if (stock.store_name === store.name && stock.number > 0) {
                    return <>
                            <Row className='d-flex justify-content-center mb-1' style={{ fontSize:'0.8rem'}}>
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
                } else {
                    return
                }
                } 
                if (!stock.store_name) {
                return <>
                            <Row className='d-flex justify-content-center' style={{ fontSize:'0.8rem'}}>
                                <Row style={{ width:'80%', border:'solid 0.07rem lightgrey', backgroundColor:'#f2f5fa' }} className='p-1 px-5 text-center'>
                                    <Col>{stock.product.id}</Col>
                                    <Col><strong>{stock.product.brand}</strong></Col>
                                    <Col>{stock.product.name}</Col>
                                    <Col>{stock.product.price}</Col>
                                    <Col>{stock.product.category}</Col>
                                    <Col>{stock.number}</Col>
                                </Row>
                                </Row>
                </>   
                }
                    })
                } 
            </td>
    </tr>
  )
}

export default MyStoreStocks