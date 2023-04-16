import { CFormCheck } from "@coreui/react";
import React from "react";
import { Col } from "react-bootstrap";

function HomeSidebar({ categories = [], categoryFilterHandler }) {
  return (
    <>
      {categories.map((category) => {
        return (
          <>
            <h5 className="my-3" style={{ color: "#495b7a" }} key={category.id}>
              {category.name}
            </h5>
            {category.subcategory.map((subcategory) => {
              return (
                <CFormCheck
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  label={subcategory.name}
                  style={{ backgroundColor: "#495b7a" }}
                  onChange={() => {
                    categoryFilterHandler(subcategory.name);
                  }}
                  className="my-2"
                  key={subcategory.id}
                />
              );
            })}
          </>
        );
      })}
    </>
  );
}

export default HomeSidebar;
