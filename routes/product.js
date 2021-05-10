const express = require("express");
const router = express.Router();

const {
  productById,
  create,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories
} = require("../controllers/product");
const { userById } = require("../controllers/user");

router.post("/product/create/:userId", create);
router.get("/product/:productId", read);
router.get("/products", list);
router.delete("/product/:productId/:userId", remove);
router.put("/product/:productId/:userId", update);

router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories)

router.param("userId", userById);
router.param("productId", productById);
module.exports = router;
