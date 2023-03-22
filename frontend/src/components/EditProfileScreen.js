import React, { useEffect, useState } from 'react'
import { Container, Button, Row, Col, Form, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductCategories } from '../store/actions/categoriesActions'
import { updateProfile, myDetails } from '../store/actions/userActions'

function EditProfileScreen() {

  
    const { user } = useSelector(state => state.myDetails)
    const { categories } = useSelector(state => state.productCategories)
  
    const profile = user && user.profile[0]

    const [industry, setIndustry] = useState(profile.industry)
    const [headquarter, setHeadquarter] = useState(profile.headquarter)
    const [description, setDescription] = useState(profile.description)
    const [image, setImage] = useState(profile.image)
    const [category, setCategory] = useState(profile.category)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(listProductCategories())    
        }, [dispatch])

    const handleImageChange = e => {
        const image = e.target.files[0];
        setImage(image)
    };

    const handleCategoryChange = e => {
        var options = e.target.options;
        var category = [];
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            category.push(options[i].value);
          }
        }
        setCategory(category)
      };

    const submitHandler = async e => {
        e.preventDefault();
        let formData = new FormData();

        if (image.type) {
          formData.append("image", image, image.name);
        } 

        for (var i = 0; i < category.length; i++) {
            formData.append("category", category[i]);
        }

        formData.set('industry', industry)
        formData.set('headquarter', headquarter)
        formData.set('description', description)
           
            dispatch(updateProfile(profile, formData))
    };

    return (
    <Container style={{width:'40%', alignItems:'center', marginTop:'2rem'}}>
           
        <h4 style={{textAlign: 'center', color:'#1e478a'}}>Edit Your Profile</h4>
        <Row className='mt-3 justify-content-center text-center'>
          <h5>{user.username}</h5>
          <Image src={user.profile[0].image} style={{ width:'10rem', height:'auto' }} />
        </Row>
       
        <Form onSubmit={submitHandler}>

            <Form.Group className="mb-4">
              <Form.Label>Image</Form.Label>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </Form.Group>

            <Form.Group >
              <Form.Label >
                Categories
              </Form.Label>
              <Form.Control
                as="select"
                type="text"
                name="category"
                value={category}
                onChange={handleCategoryChange}
                multiple
              >
                {categories &&
                  categories.map(category => {
                    return <option value={category.id} key={category.id}>{category.name}</option>;
                  })}
              </Form.Control>
              </Form.Group>

            <Form.Group >
            <Form.Label>Industry</Form.Label>
            <Form.Control
                type='text'
                placeholder='Enter industry'
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
            >
            </Form.Control>
            </Form.Group>

            <Form.Group >
            <Form.Label>Headquarter</Form.Label>
            <Form.Control
                type='text'
                placeholder='Enter headquarter'
                value={headquarter}
                onChange={(e) => setHeadquarter(e.target.value)}
            >
            </Form.Control>
            </Form.Group>

            <Form.Group >
            <Form.Label>Description</Form.Label>
            <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                as='textarea'
                row='5'
            >
            </Form.Control>
            </Form.Group>

            <Row className='justify-content-center'>
                <Button type='submit' className='mt-3' style={{ width:'10rem'}}>
                  Save
                </Button>
            </Row>
           
            
      </Form>       
    </Container>
  )
}

export default EditProfileScreen