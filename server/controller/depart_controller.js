var express = require('express');
var router = express.Router();
var ds = require('../service/depart_service');

router.get('/',selectDepartList);
router.get('/:diNo',selectDepart);
router.delete('/:diNo',deleteDepart);
router.post('/update',updateDepart);
router.post('/',insertDepart);
module.exports = router;

function insertDepart(req,res,next){
    ds.insertDepart(req)
    .then(result =>{
        res.json(result);
    });
}

function updateDepart(req,res,next){
    ds.updateDepart(req)
    .then(result =>{
        res.json(result);
    });
}

function selectDepart(req,res,next){
    ds.selectDepart(req)
    .then(result =>{
        res.json(result);
    });
}

function selectDepartList(req,res,next){
    ds.selectDepartList(req)
    .then(result =>{
        res.json(result);
    });
}

function deleteDepart(req,res,next){
    ds.deleteDepart(req)
    .then(result=>{
        res.json(result);
    })
}