import React from 'react'
import { Row, Form } from 'react-bootstrap';

export default function SearchBox({ searchHandler, type, placeholder, color, value, width }) {

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