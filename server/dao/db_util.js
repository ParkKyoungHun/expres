const dbConfig = require('../conf/dbconfig.js');
const mysql = require('promise-mysql');
const sqlMap = require('./sql.js');

const rexStr = /#[\S]*#/;
var con = mysql.createConnection(dbConfig);

module.exports=function(){
    var generateWhere = function(paramObj){
        var whereStr = '';
        Object.keys(paramObj).forEach((key)=>{
            whereStr += ' and ' + key + '=? ';
        });
        return whereStr;
    }

    var generateWhereValue = function(paramObj){
        var whereValue = [];
        Object.keys(paramObj).forEach((key)=>{
            whereValue.push(paramObj[key]);
        });
        return whereValue;
    }
    var errorHandle = function(err){
        var result = {};
        result["error"] = {"code" : err.code,
        "no" : err.errno,
        "msg" : err.sqlMessage
        };
        return result;
    }
    var rowsHandle = function(rows){
        var result = {};
        result["list"] = rows;
        return result;
    }

    this.promiseException = function(err){
        return new Promise((resolved,rejected)=>{  
              var result =  errorHandle(err);
              return resolved(result);
        });
    }

    var parseSqlForSelect = function(sqlId,values){
        var sql = sqlMap[sqlId];
        if(!sql){
            throw 'sql이 없습니다. ' + sqlId + '를 확인해주세요.';
        }
        var paramValue = [];
        var paramIds = [];
        var sqls = [];
        while(rexStr.test(sql)){
            var paramId = rexStr.exec(sql)[0];
            var str = paramId.replace(/#/gi,'');
            var op = /[=|<|>|<=|>=]/.exec(str);
            var strs = str.split(/[=|<|>|<=|>=]/);
            var changeStr = strs[0] + op + ' ? ';
            sql = sql.replace(paramId,changeStr);
            sqls[sqls.length] = changeStr;
            paramIds[paramIds.length] = strs[1];
        }
        console.log(paramIds);
        if(paramIds.length>0){
            if(!values){
                for(var key in paramIds){
                    sql = sql.replace(sqls[key],' 1=1 ');
                }
            }else{
                for(var key in paramIds){
                    if(!values[paramIds[key]]){
                        sql = sql.replace(sqls[key],' 1=1 ');
                    }else{
                        paramValue[paramValue.length] = values[paramIds[key]];
                    }
                }
            }
        }
        return {'sql' : sql, 'values':paramValue};
    }
    var parseSqlForUpdate = function(sqlId,values){
        var sql = sqlMap[sqlId];
        if(!sql){
            throw 'sql이 없습니다. ' + sqlId + '를 확인해주세요.';
        }
        var paramValue = [];
        var paramIds = [];
        var sqls = [];
        console.log(sql);
        while(rexStr.test(sql)){
            var paramId = rexStr.exec(sql)[0];
            console.log(paramId);
            var str = paramId.replace(/#/gi,'');
            var changeStr =  ' ? ';
            sql = sql.replace(paramId,changeStr);
            paramValue[paramValue.length] = values[str];
        }
        return {'sql' : sql, 'values':paramValue};
    }
    this.runSql = function(sqlId, values){
        try{
            var sqlObj = parseSqlForSelect(sqlId,values);
            console.log(sqlObj);
            return con.then((conn)=>{
                return conn.query(sqlObj.sql, sqlObj.values);
                })
                .then(rowsHandle)
                .catch(this.promiseException);
        }catch(e){
            throw e;
        }
    }
    this.updateSql = function(sqlId,values){
        try{
            var sqlObj = parseSqlForUpdate(sqlId,values);
            console.log(sqlObj);
            return con.then((conn)=>{
                return conn.query(sqlObj.sql, sqlObj.values);
                })
                .then(rowsHandle)
                .catch(errorHandle);
        }catch(e){
            throw e;
        }
    }
}
