import React from "react";

const ErrorPage = (props) => {
  return (
    <div>
      <h1>{props.error}</h1>
    </div>
  );
};

export default ErrorPage;
