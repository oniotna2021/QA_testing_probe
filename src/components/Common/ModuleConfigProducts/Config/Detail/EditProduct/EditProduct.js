import React from "react";
import { FormProduct } from "../../Products/FormProduct";

const EditProduct = ({ detailProduct }) => {
  return (
    <div className="row">
      <div
        className="col p-5"
        style={{ backgroundColor: "white", borderRadius: 10 }}
      >
        <FormProduct defaultValue={detailProduct} fromEditProduct />
      </div>
    </div>
  );
};

export default EditProduct;
