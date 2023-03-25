import React from 'react'
import { Row, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import { search } from '../store/actions/searchAction'

export default function SearchBox({ type, placeholder, color, value, setValue, width, seller_id=null }) {

    const dispatch = useDispatch()

    const searchHandler = (e) => {
        setValue(e.target.value)
        if (value.length < 2) {
            setTimeout(() => {
                dispatch(search({ type: type, seller_id: seller_id, searchString: e.target.value }))
            }, 1000)
        }
    }

    return (
    <Row style={{ backgroundColor: color, height:'3rem' }}>
        <Form className="d-flex justify-content-center my-2" style={{ height:'2rem' }}>
            <Form.Control
            type={type}
            placeholder={placeholder}
            aria-label="Search"
            style={{ width: width, borderRadius: '30px 30px 30px 30px' }}
            value={value}
            onChange={(e) => searchHandler(e)}
            />
        </Form>
    </Row>
  )
}