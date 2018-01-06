var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');
var dbConfig = require('../conf/dbconfig.js');
const con = mysql.createConnection(dbConfig);

router.get('/',selectDepartList);
router.get('/:diNo',selectDepart);
router.delete('/:diNo',deleteDepart);
router.post('/update',updateDepart);
router.post('/',insertDepart);
module.exports = router;
var errorHandle = (err)=>{
    console.log(err);
    var result = {};
    if(err.code){
        result["error"] = {"code" : err.code,
        "no" : err.errno,
        "msg" : err.sqlMessage
        };
    }else{
        result["error"] = err;
    }
    return result;
}
var rowsHandle = (rows)=>{
    var result = {};
    result["list"] = rows;
    return result;
}


function insertDepart(req,res,next){
    var obj = req.body;
    var values = [obj.diName, obj.diDesc, obj.diCnt];
    var sql = "insert into depart_info(diname, didesc, dicnt)";
    sql += "values(?,?,?)"
    var result = {};
    var dbCon;
    con.then(con=>{
        dbCon = con;
        return dbCon.query(sql,values);
    }).then(rows=>{
        console.log(rows);
        result["succeed"] = "no";
        if(rows.affectedRows==1){
            var diNo = rows.insertId;
            sql = "select ? as diNo ,count(1) as diCnt from user_info where dino=?";
            return dbCon.query(sql,[diNo,diNo]);
        }
    }).then(rows=>{
        var result;
        rows.map(row=>{
            sql = "update depart_info set dicnt=? where diNo=?"
            result= dbCon.query(sql,[row.diCnt, row.diNo]);
        })
        return result;
    }).then(rows=>{
        if(rows.affectedRows==1){
            result["succeed"] = "ok";
            result["rows"] = rows;
        }
    }).catch(err=>{
        result["succeed"] = "no";
    }).then(data=>{
        res.json(result);
    });
}

function updateDepart(req,res,next){
    var obj = req.body;
    var values = [obj.diName, obj.diDesc, obj.diCnt,obj.diNo];
    var sql = "update depart_info";
    sql += " set diName=?,";
    sql += " diDesc=?,";
    sql += " diCnt=?";
    sql += " where diNo=?";
    var result = {};
    con.then(con=>{
        return con.query(sql,values);
    }).then(rows=>{
        console.log(rows);
        result["succeed"] = "ok";
        if(rows.affectedRows!=1){
            result["succeed"]="no";
        }
        res.json(result);
    });
}

function selectDepart(req,res,next){
    var sql = "select diName, diNo, diDesc, diCnt "
    sql += " from depart_info where diNo=?";
    var diNo = req.params.diNo;
    console.log(diNo);
    con.then((con)=>{
        return con.query(sql,diNo);
    }).then(rows=>{
        res.json(rows);
    });
}


function selectDepartList(req,res,next){
    var sql = "select diName, diNo, diDesc, diCnt from depart_info";
    con.then((con)=>{
        return con.query(sql);
    }).then(rows=>{
        console.log(rows);
        res.json(rows);
    });
}

function deleteDepart(req,res,next){
    var sql = "delete from depart_info where diNo=?";
    var diNo = req.params.diNo;
    con.then((con)=>{
        return con.query(sql,diNo);
    }).then(rows=>{
        res.json(rows);
    }).catch(errorHandle).
    then((result)=>{
        console.log(result);
        res.json(result);
    });
}