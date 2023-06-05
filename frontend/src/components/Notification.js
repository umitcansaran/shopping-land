import React, { useEffect, useState } from "react";
import "./Notification.css";

function Notification({ message, status }) {
  const [style, setStyle] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setStyle("transition");
    }, 1500);
  }, []);

  let statusClasses = "";

  if (status === "success") {
    statusClasses = "success";
  }

  if (status === "error") {
    statusClasses = "error";
  }

  const cssClasses = `notification success ${style}`;

  return (
    <>
      <div className={cssClasses}>
        <h2>{message}</h2>
      </div>
    </>
  );
}

export default Notification;
