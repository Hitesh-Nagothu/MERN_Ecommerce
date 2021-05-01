const express = require("express");
const router = express.Router();


const {requireSignin, isAuth, isAdmin} = require("../controllers/auth");
const {userById} = require("../controllers/user");
const { create, categoryById, read, update, remove, list }= require("../controllers/category")

router.post("/category/create/:userId", requireSignin,create);
router.get("/category/:categoryId", read)
router.put("/category/:categoryId/:userId", requireSignin, update )
router.delete("/category/:categoryId/:userId", requireSignin, remove )
router.get("/categories", list)

router.param('userID', userById)
router.param('categoryId', categoryById)
module.exports=router;
