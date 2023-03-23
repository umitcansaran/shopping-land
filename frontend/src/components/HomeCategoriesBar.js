import React from 'react'
import { Nav } from 'react-bootstrap'

function HomeCategoriesBar({ categories, categoryFilterHandler }) {

    return (
        <Nav className='justify-content-evenly'>
        {categories.map((category)=>{
        return (
            <Nav.Item key={category.id}>
                <Nav.Link onClick={()=>{categoryFilterHandler(category.name)}}>{category.name}</Nav.Link>
            </Nav.Item>
        )
        })}
        </Nav>
    )
}

export default HomeCategoriesBar