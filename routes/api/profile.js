const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profiles");
const User = require("../../models/User");


// $route  GET api/profile/test
// @desc   返回的请求的json数据
// @access public
router.get("/test",(req,res) => {
  res.json({msg:"profile works"})
})

// $route  GET api/profile
// @desc   获取当前登录用户的个人信息
// @access private
router.get("/",passport.authenticate('jwt', { session: false }),(req,res) => {
  const errors = {};
  Profile.findOne({user: req.user.id}).then((profile) => {
    if(!profile){
      errors.noprofile = "该用户的信息不存在~!";
      return res.status(404).json(errors);
    }

    res.json(profile);
  }).catch(err => res.status(404).json(err));
})

module.exports = router;