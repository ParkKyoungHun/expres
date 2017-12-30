module.exports = {
    'SELECT_USER' : 
    'select userNo, userName, userId, userPwd, complete from user_info where  1=1'+
    ' and #userId=userId#'+
    ' and #userName=userName#'+
    ' and #userPwd=userPwd#'+
    ' and #userNo=userNo#'+
    ' and #complete=complete#',
    'INSERT_USER':
    'insert into user_info(userId, userName, userPwd, complete)'+
    'values(#userId#, #userName#, #userPwd#, #complete#)',
    'SELECT_USER_HIS':
    'select userNo1, userData from user_his where #userNo=userNo#'
};