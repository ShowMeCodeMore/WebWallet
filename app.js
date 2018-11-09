let express = require('express');
let app = express();
let userSchema = require('./public/js/user');
let bodyParser = require('body-parser');

//解析表单数据
app.use(bodyParser.urlencoded({extended:true,limit: '50mb'}))

app.use(express.static('public/html'))

//显示静态页面
app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/html/index.html")
})

/*插入数据库函数*/
function insert(name,psw,keystore){
      //数据格式
    let user =  new userSchema({
                username : name,
                userpassword : psw,
                keystore : keystore
            });
    user.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}

/*注册页面数据接收*/
app.post('/register', function (req, res) {
   //返回体设置为json格式
    res.setHeader('Content-type','application/json;charset=utf-8')
   //先查询有没有这个user
    let UserName = req.body.username;
    let UserPsw = req.body.password;
    let Keystore = req.body.keystore;
   //通过账号验证
    let updatestr = {username: UserName};
    if(UserName == ''){
       res.send({status:'success',message:false}) ;
    }
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        } else {
            if(obj.length == 0){
                //如果查出无数据,就将账户密码插入数据库
                insert(UserName,UserPsw,Keystore);
                //返回数据到前端
                res.send({status:'success',message:true}) 
            }else{
                res.send({status:'success',message:false}) 
            }
        }
    })  
});

/*登录处理*/
app.post('/login', function (req, res, next) {
  //先查询有没有这个user
    let UserName = req.body.username;
    let UserPsw = req.body.userpassword;
  //通过账号密码搜索验证
    let updatestr = {username: UserName,userpassword:UserPsw};
    res.setHeader('Content-type','application/json;charset=utf-8')
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        } else {
            if(obj.length == 1){
                console.log('登录成功');
                console.log(JSON.stringify(obj))
                res.send({status:'success',message:true,data:obj});
            }else{
                console.log('请注册账号'); 
                res.send({status:'success',message:false}); 
            }
        }
    })
});

/*查询钱包主界面信息*/
app.post('/toMain', function (req, res, next) {
    let updatestr = {username: req.body.username};
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        } else {
            if(obj.length == 1){
                console.log('有此帐号');
                res.send({status:'success',message:true,data:obj});
            }else{
                console.log('没有此帐号');
                res.send({status:'success',message:false});
            }
        }
    })
});

app.listen(1993,function(){
    console.log('server connect');
})
