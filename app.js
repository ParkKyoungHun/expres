const exp = require('express');
const app = exp();
const mysql = require('mysql');
var dbconf = {
    host : 'localhost',
    user : 'root',
    password : 'r1r2r3',
    port : '3306',
    database : 'ang2'
};
var connection = mysql.createConnection(dbconf);
app.use('/',(req,res,next)=>{
    console.log(req.url);
    if(req.url.indexOf(".html")!=-1){
        res.sendFile(req.url,{root:__dirname + "/views"});
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        next();
    }
})
app.get('/',(req,res,next)=>{
    res.write("니가 요청한경로 : " + req.url);
    res.write("<br>허허 시작 레츠기릿!!");
    res.write("<br>라라라라");
    res.write("<br>우쭈쭈");
    res.write("<br>으허허허");
    next();
});
app.get('/',(req,res,next)=>{
    res.write("<br>난 두번째!!!");
    res.end();
});
app.get('/test',(req,res,next)=>{
    res.write("니가 요청한경로 : " + req.url);
    res.end();
});
app.get('/join2',(req,res,next)=>{
    var username = req.query.username;
    var userage = req.query.userage;
    var userid = req.query.userid;
    var userpwd = req.query.userpwd;
    var useraddress = req.query.useraddress;
    if(username.trim()==""){
        res.write("<script>alert('이름 없니?');location.href='/join';</script>");
    }
    if(userage.trim()==""){
        res.write("<script>alert('나이가 없니?');location.href='/join';</script>");
    }
    var sql = "select userid from user_info where userid=?";
    var values = [userid];
    connection.query(sql,values,(err,rows)=>{
        if(err) throw err;
        console.log(rows.length);
        if(rows.length==0){
            sql = "insert into user_info(username,userage,userid,userpwd,useraddress,dino)";
            sql += "values(?,?,?,?,?,1);";
            values = [username,userage,userid,userpwd,useraddress];
            connection.query(sql,values,(err,rows)=>{
                if(err){
                    console.log(err);
                    res.write("회원가입이 실패하였습니다.");
                    res.end();
                }else if(rows){
                    if(rows.affectedRows==1){
                        res.write("회원가입 완료~~");
                        res.end();
                    }
                }
            })
        }else{
            res.write("입력하신 아이디 : " + userid +" 가 이미 존재합니다.");
            res.end();
        }
    });
})
app.get('/list',(req,res,next)=>{
    var sql = "select * from user_info";
    var values = [];
    var result = {};
    connection.query(sql,values,(err,rows)=>{
        if(err) throw err;
        result["list"]=rows;
        res.json(result);
    })
})
app.listen(3000,function(){
    console.log("오 서버가 3000으로 시작이 잘됬으~");
})