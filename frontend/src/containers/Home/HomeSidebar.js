import { CFormCheck } from "@coreui/react";
import React from "react";

export default function HomeSidebar({ categories = [], categoryFilterHandler }) {
  return (
    categories.map((category) => {
      return (
        <div key={category.id}>
          <h5 className="my-3">{category.name}</h5>
          {category.subcategory.map((subcategory) => {
            return (
              <CFormCheck
                className="my-2 sidebar-form-check"
                key={subcategory.id}
                type="radio"
                name="flexRadioDefault"
                id={`flexRadioDefault-${subcategory.id}`} // Ensure unique id for accessibility
                label={subcategory.name}
                onChange={() => {
                  categoryFilterHandler(subcategory.name);
                }}
              />
            );
          })}
        </div>
      );
    })
  );
}
