import { Router } from "express";
import { __dirname, __filename } from "../utils.js";
import { getProductsList } from "../service/productosUtils.js";

const productoRouter = Router();

productoRouter.get("/", (req, res) => {
  const products = getProductsList();
  res.render("home", { products });
});

export default productoRouter;
