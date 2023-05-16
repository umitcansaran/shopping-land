import { useState } from "react";

const AddressSuggestions = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleChange = async (event) => {
    setValue(event.target.value);
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;
    const response = await fetch(endpoint);
    const results = await response.json();
    setSuggestions(results?.features);
  };

  return {
    onChange: handleChange,
    value,
    setValue,
    suggestions,
    setSuggestions,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
  };
};

export default AddressSuggestions;
