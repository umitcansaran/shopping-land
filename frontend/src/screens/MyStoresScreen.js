import React, { useEffect, useState } from 'react'
import { Button, Table, Row, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listMyStores, deleteStore } from '../store/actions/storeActions'
import AddStoreButton from '../components/AddStoreButton'
import { listMyProducts } from '../store/actions/productActions'
import { createStock, updateStock, listStocks } from '../store/actions/stockActions'
import { useNavigate } from 'react-router-dom';
import { search } from '../store/actions/searchAction'

function MyStoresScreen() {

    const [ deletedStore, setDeletedStore ] = useState('')
    const [ stockInput, setStockInput ] = useState({})
    const [ button, setButton ] = useState({})
    const [ value, setValue ] = useState('')

    const dispatch = useDispatch()
    const { myStores } = useSelector(state => state.storeMyList)
    
    const { stock: newStock } = useSelector(state => state.createStock)
    const { stock: updatedStock } = useSelector(state => state.stockUpdate)
    const { stocks } = useSelector(state => state.stockList)
        
    useEffect(() => {
    dispatch(listMyProducts())
    dispatch(listMyStores())
    dispatch(listStocks())
    }, [dispatch, newStock, updatedStock, deletedStore])

    const searchHandler = (e, storeName) => {
        setValue(e.target.value)
        dispatch(search({ type: 'product_in_my_store', store: storeName, searchString: e.target.value }))
}

  const viewStockHandler = (index) => {
    Object.keys(button).forEach(key => {
        button[key] = false;
    });
     Object.keys(stockInput).forEach(key => {
        stockInput[key] = false;
    });
    setButton({
        ...button,
        [index]: true
    })
    setValue('')
    dispatch(listStocks())
}

const closeStockHandler = (index) => {
    setButton({
        ...button,
        [index]: false
    })
}

  const deleteStoreHandler = async (id) => {
    if (window.confirm('Are you sure')) {
        await dispatch(deleteStore(id))
    }
    setDeletedStore(id)
}

  return (
    <>   
        < AddStoreButton />
        <Table striped hover responsive className='table-sm my-3' style={{ width:'90%', margin:'auto'}}>
            <thead style={{ backgroundColor:'#f2f5fa' }}>
              <tr style={{ textAlign:'center' }}>
                <th>ID</th>
                <th>NAME</th>
                <th>ADDRESS</th>
                <th>PHONE</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                    {myStores.map((store, index) => (
                            <>
                            <tr key={store.id} style={{ textAlign:'center' }}>
                                <td>{index + 1}</td>
                                <td><strong>{store.name}</strong></td>
                                <td>{store.address}</td>
                                <td>{store.phone}</td>
                                <td style={{ width:'11rem', textAlign:'center' }}>  
                                { button[index] ? 
                                (
                                    <Button onClick={()=>{closeStockHandler(index)}} stye={{ color:'#f2f5fa' }} className='btn-block'>
                                    Close
                                </Button>      
                                    ) 
                                    : 
                                    (
                                <Button onClick={()=>{viewStockHandler(index)}} stye={{ color:'#f2f5fa' }} className='btn-block'>
                                View Products
                                </Button>
                                )
                                }   
                                </td>
                                <td style={{ width:'8rem', textAlign:'center' }}>
                                <Button onClick={()=>{deleteStoreHandler(store.id)}} className='btn-block btn-danger'>
                                Delete
                                </Button>
                                </td>  
                            </tr>
                            { button[index] && (
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
                                    </>
                                )
                            }
                            </>
                     ))}
            </tbody>
          </Table>
    </>
  )
}

export default MyStoresScreen