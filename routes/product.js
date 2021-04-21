const express = require("express");
const router= express.Router();

const {create} = require("../controllers/product");

const {userById}= require("../controllers/user");


router.post("/product/create/:userId", create);
router.param("userId", userById);
module.exports= router;
