import { Router } from "express";
import { getProductsList } from "../service/productosUtils.js";

const realTimeProducts = Router();

realTimeProducts.get("/", (req, res) => {
  const products = getProductsList();
  res.render("realtimeproduct", { products });
});

export default realTimeProducts;
