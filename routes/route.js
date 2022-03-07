var express = require('express');
var router = express.Router();
const {verifyUserToken} = require("./../authentication/auth")
const postController = require("./controller")

/* GET controller page. */
router.post('/register' , postController.resgister)
router.get("/confirmEmail/:token" , postController.confirmEmail)
router.post('/login' ,postController.login)
// router.post("/tokengenerate" , postController.tokenGenerate)

module.exports = router;
