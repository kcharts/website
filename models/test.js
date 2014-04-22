var mongodb = require('./db');

function Test(test){
  this.name = test.name;
  this.age = test.age;
}

module.exports = Test;

Test.prototype.save = function(callback) {//存储用户信息
  //要存入数据库的用户文档
  var test = {
      name: this.name,
      age :this.age
  };
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取 test 集合
    db.collection('Test', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //将用户数据插入 test 集合
      collection.insert(test,{safe: true}, function(err, test){
        mongodb.close();
        callback(err, test);//成功！返回插入的用户信息
      });
    });
  });
};

Test.get = function(name, callback){//读取用户信息
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取 test 集合
    db.collection('test', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找用户名 name 值为 name文档
      collection.findOne({
        name: name
      },function(err, doc){
        mongodb.close();
        if(doc){
          var test = new Test(doc);
          callback(err, user);//成功！返回查询的用户信息
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};