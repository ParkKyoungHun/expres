const db = require('../dao/db_util.js');
var jwt = require('jsonwebtoken');
var dbm = new db();
var userService = {};
userService.selectUser = selectUser;
userService.selectUserHis = selectUserHis;
userService.loginUser = loginUser;
userService.insertUser = insertUser;

function selectUser(po){
    return dbm.runSql("SELECT_USER",po);
}
function selectUserHis(po){
    return dbm.runSql("SELECT_USER_HIS",po);
}
function loginUser(po){
    return this.selectUser({"userId":po.userId})
    .then((result)=>{
        if(result.list.length==0){
            return dbm.promiseException({"code" : 100,
            "errno" : 01,
            "sqlMessage" : '유저아이디 : \'' + po.userId + '\'는 없는 아이디 입니다.'
            });
        }
        var userPwd = result.list[0].userPwd;
        if(po.userPwd!=userPwd){
            return dbm.promiseException({"code" : 100,
            "errno" : 01,
            "sqlMessage" : '유저아이디 : \'' + po.userId + '\'의 비밀번호를 확인해주세요.'
            });
        }
        result.list[0].token = jwt.sign({ sub: po.userId }, "login");
        return result;
    });
}
function insertUser(po){
    return this.selectUser({"userId":po.userId})
    .then((result)=>{
        if(result.list.length!=0){
            return dbm.promiseException({"code" : 100,
            "errno" : 01,
            "sqlMessage" : '유저아이디 : \'' + po.userId + '\'는 이미 존재하는 아이디 입니다.'
            });
        }
        return dbm.updateSql("INSERT_USER",po);
    });
}
module.exports = userService;
