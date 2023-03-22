import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import { listProductCategories } from '../store/actions/categoriesActions'
import { myDetails } from '../store/actions/userActions'
import { createStore } from "../store/actions/storeActions";
import { STORE_CREATE_RESET } from '../store/constants/storeConstants'
import styled from "styled-components";
import FormContainer from "../components/FormContainer";
import AddressInputField from "../components/AddressInputField";
export default function AddStoreScreen() {

  const [viewState, setViewState] = useState({
    latitude: 46.738436, 
    longitude: 8.082641,
    zoom: 7
  });

  const [state, setState] = useState({
    owner: '',
    name: '',
    address:'',
    country:'',
    city:'',
    latitude: '',
    longitude: '',
    description: '',
    phone: '',
    image: '',
    category: []
  });

  const [ select, setSelect] = useState('')
  const [ name, setName ] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { categories } = useSelector(state => state.productCategories)
  const { user } = useSelector(state => state.myDetails)
  const { success: createStoreSuccess } = useSelector(state => state.createStore)

  useEffect(() => {
    if (createStoreSuccess) {
      navigate('/mystores')
      dispatch({ type: STORE_CREATE_RESET })
    }
    dispatch(listProductCategories())    
    dispatch(myDetails())
  }, [dispatch, createStoreSuccess])

  const onChange = ({ target: { name, value } }) => {
    setState({...state, [name]: value})
  };

  const handleCategoryChange = e => {
    var options = e.target.options;
    var category = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        category.push(options[i].value);
      }
    }
    setState({...state, category: category})
    console.log('addstorecat', category)
  };

  const handleImageChange = e => {
    const image = e.target.files[0];
    setState({...state, image: image})
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let form_data = new FormData();

    for (var i = 0; i < state.category.length; i++) {
      form_data.append("category", state.category[i]);
    }

    form_data.set('owner', user.id)
    form_data.set('name', name)
    form_data.set('address', state.address)
    form_data.set('country', state.country)
    form_data.set('city', state.city)
    form_data.set("latitude", state.latitude);
    form_data.set("longitude", state.longitude);
    form_data.set("description", state.description);
    form_data.set("phone", state.phone);
    form_data.set("image", state.image);
   
    dispatch(createStore(form_data))
  };

    return (
      <>
      <FormContainer> 
      <Row>
            <Col md="4" className="m-5" style={{width:'70%'}}>
            <h4 className="form_titles mb-4" style={{textAlign: 'center'}}>ADD A STORE</h4>
  
            <Form onSubmit={handleSubmit}>
  
            <Form.Group className="mb-4" >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              < AddressInputField setState={setState} />
              
              { state.latitude && (
                <Row>
                <Col style={{width:'30%'}}>
                <Form.Group className="mb-4" >
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="latitude"
                  value={state.latitude}
                  onChange={onChange}
                />
              </Form.Group>   
              </Col> 
              <Col style={{width:'30%'}}>
              <Form.Group className="mb-4" >
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="longitude"
                  value={state.longitude}
                  onChange={onChange}
                />
              </Form.Group>
              </Col>
              </Row>
              )}
                
              <Form.Group>
              <Form.Label>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={state.description}
                onChange={onChange}
                rows="3"
                className="restForm-description"
              />
            </Form.Group> 
  
              <Form.Group className="mb-4" >
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={state.phone}
                  onChange={onChange}
                />
              </Form.Group> 
  
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
                value={state.category}
                onChange={handleCategoryChange}
                multiple
              >
                {categories &&
                  categories.map(category => {
                    return <option key={category.id}>{category.name}</option>;
                  })}
              </Form.Control>
              </Form.Group>
  
              <Button
                variant="primary"
                type="submit">
                Submit
              </Button>
            </Form>
          </Col>
      </Row>
        
      </FormContainer>
      </>
    );
  }

const SuggestionWrapper = styled.div`
  background: white;
  position: absolute;
  width: 400px;
  padding: 10px 20px;
  border-radius: 0px 0px 10px 10px;
`;

const Suggestion = styled.p`
  cursor: pointer;
  max-width: 400px;
`;