import React from 'react'
import { Nav } from 'react-bootstrap'

function HomeCategoriesBar({ categories, categoryFilterHandler }) {

    return (
        <Nav className='justify-content-evenly mb-3 categories-bar' style={{ borderBottom: '0.5px solid #818ca1' }}>
        {categories.map((category)=>{
        return (
            <Nav.Item key={category.id}>
                <Nav.Link onClick={()=>{categoryFilterHandler(category.name)}} style={{ color:'#32415c' }}>{category.name}</Nav.Link>
            </Nav.Item>
        )
        })}
        </Nav>
    )
}

export default HomeCategoriesBar