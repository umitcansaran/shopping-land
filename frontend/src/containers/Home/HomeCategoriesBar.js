import React from "react";
import { Nav } from "react-bootstrap";

export default function HomeCategoriesBar({ categories = [], categoryFilterHandler }) {
  return (
    <Nav className="justify-content-evenly mb-3 home-categories-bar">
      {categories.map((category) => {
        return (
          <Nav.Item key={category.id}>
            <Nav.Link
              className="home-categories-link"
              onClick={() => {categoryFilterHandler(category.name);
              }}
            >
              {category.name}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}