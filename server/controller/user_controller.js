//var config = require('config.json');
var express = require('express');
var router = express.Router();
var us = require('../service/user_service');

 router.get('/', selectUser);
 router.get('/his/:userNo', selectUserHis)
 router.post('/', insertUser);
 router.get('/login',login)
 
module.exports = router;

function selectUser(req,res,next){
    var po = {}
    if(req.query.user){
        po = JSON.parse(req.query.user);
    }
    console.log(po);
    us.selectUser(po)
    .then((result)=>{
        console.log(result);
        res.json(result);
    }).catch(result=>{
        console.log(result);
        res.json(result);
    });
}

function selectUserHis(req,res,next){
    var po = {"userNo":req.params.userNo};
    us.selectUserHis(po)
    .then((result)=>{
        console.log(result);
        res.json(result);
    }).catch(result=>{
        console.log(result);
        res.json(result);
    });
} 

function login(req,res,next){
    var po = {}
    if(req.query.user){
        po = JSON.parse(req.query.user);
    }
    us.loginUser(po)
    .then((result)=>{
        console.log(result);
        res.json(result);
    }).catch(result=>{
        console.log(result);
        res.json(result);
    });
}
function insertUser(req,res,next){
    us.insertUser(req.body)
    .then((result)=>{
        if(result["list"].affectedRows==1){
            us.selectUser({})
            .then(result=>{
                result["msg"] = "유저가 정상적으로 생성되었습니다.";
                console.log(result);
                res.json(result);
            });
        }
    }).catch(result=>{
        console.log(result);
        res.json(result);
    })
}