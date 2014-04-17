/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1",27017,{});//本地27017端口
new mongodb.Db('local',server,{}).open(function(error,client){//数据库：local
    //if(error) throw error;
    var collection = new mongodb.Collection(client,'Message');//Message

    //插入
    var doc1 = {'name':'glj','age':'27'};
    collection.insert(doc1, function(err, result) {});

    collection.find(function(error,cursor){
        cursor.each(function(error,doc){
            if(doc){
                console.log("name:"+doc.name+" age:"+doc.age);
            }
        });
    });
});