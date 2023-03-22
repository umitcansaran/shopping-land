import React, { useState } from "react";
import styled from "styled-components";
import AddressSuggestions from "../components/AddressSuggestions";
import { Form } from "react-bootstrap";

const AddressInputField = ({ setState }) => {
  
  const address = AddressSuggestions("");

  return (
    <Form.Group className="mb-4" >
              <Form.Label>Address</Form.Label>
                <Form.Control
                  placeholder="Search"
                  {...address}
                  isTyping={address.value !== ""}
                />
                  {address.suggestions?.length > 0 && (
                    <SuggestionWrapper>
                      {address.suggestions.map((suggestion, index) => {
                        return (
                          <Suggestion
                            key={index}
                            onClick={(e) => {
                              e.preventDefault()
                              const country = suggestion.context[suggestion.context.length - 1].text
                              const city = suggestion.context.find(x => x.id.split('.')[0] === 'region')
                              address.setValue(suggestion.place_name);
                              address.setSuggestions([]);
                              setState({ 
                                latitude: suggestion.geometry.coordinates[1].toFixed(6),
                                longitude: suggestion.geometry.coordinates[0].toFixed(6),
                                country,
                                city: city?.text,
                                address: suggestion.place_name
                              })
                            }}
                          >
                            {suggestion.place_name}
                          </Suggestion>
                        );
                      })}
                  </SuggestionWrapper>
                )}
              </Form.Group>
  );
};

export default AddressInputField;

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