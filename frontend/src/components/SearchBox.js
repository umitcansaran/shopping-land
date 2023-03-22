import React from 'react'
import { Row, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import { search } from '../store/actions/searchAction'

export default function SearchBox({ type, placeholder, color, value, setValue, width }) {

    const dispatch = useDispatch()

    const searchHandler = (e) => {
        setValue(e.target.value)
        dispatch(search({ type: type, searchString: e.target.value }))
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