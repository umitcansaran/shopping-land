import { CFormCheck } from '@coreui/react'
import React from 'react'
import { Col } from 'react-bootstrap'

function HomeSidebar({ categories, categoryFilterHandler }) {

    return (
        <Col lg={2} xl={2} className='m-4'>
        {categories.map((category) => {
            return <>
                <h5 className='my-3' style={{ color:'#1e478a' }} key={category.id}>{category.name}</h5>
                {category.subcategories.map((subcategory) => {
                    return <CFormCheck 
                    type="radio" 
                    name="flexRadioDefault" 
                    id="flexRadioDefault1" 
                    label={subcategory.name}
                    style={{ backgroundColor:'#1e478a' }}
                    onChange={() => {categoryFilterHandler(subcategory.name)}}
                    className='my-2'
                    key={subcategory.id}
                    />
                })}
                </>      
        })}
        </Col>  
  )
}

export default HomeSidebar