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


// $route  POST api/profile
// @desc   创建和编辑个人信息接口
// @access private
router.post("/",passport.authenticate('jwt', { session: false }),(req,res) => {
  const errors = {};
  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.status) profileFields.status = req.body.status;


  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // skills - 数组转换
  if(typeof req.body.skills !== "undefined"){
    profileFields.skills = req.body.skills.split(",");
  }

  profileFields.social = {};

  if(req.body.wechat) profileFields.social.wechat = req.body.wechat;
  if(req.body.QQ) profileFields.social.QQ = req.body.QQ;
  if(req.body.tengxunkt) profileFields.social.tengxunkt = req.body.tengxunkt;
  if(req.body.wangyikt) profileFields.social.wangyikt = req.body.wangyikt;

  Profile.findOne({user: req.user.id}).then(profile => {
    if(profile){
      // 用户信息存在, 执行更新方法
      Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true}).then(profile => res.json(profile));
    }else{
      // 用户信息不存在, 执行创建方法
      Profile.findOne({handle:profileFields.handle}).then(profile => {
        if(profile){
          errors.handle = "该用户的handle个人信息已经存在,请勿重新创建!";
          res.status(400).json(errors);
        }

        new Profile(profileFields).save().then(profile => res.json(profile));
      })
    }
  })

})

module.exports = router;