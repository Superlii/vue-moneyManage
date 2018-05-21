const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profiles");


const validatePostInput = require("../../validation/post");


// $route  GET api/posts/test
// @desc   返回的请求的json数据
// @access public
router.get("/test",(req,res) => {
  res.json({msg:"posts works"})
})


// $route  POST api/posts
// @desc   创建一个评论接口
// @access Private
router.post("/",passport.authenticate('jwt', { session: false }),(req,res) => {
  const {errors,isValid} = validatePostInput(req.body);

  // 判断isValid是否通过
  if(!isValid){
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text:req.body.text,
    name:req.body.name,
    avatar:req.body.avatar,
    user:req.user.id
  });

  newPost.save().then(post => res.json(post));
})

module.exports = router;