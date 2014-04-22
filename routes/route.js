var index = require('./index');
var lib = require('./lib');
var test = require('./test');
module.exports = function(app){

  app.get('/index.html',index.index);

  app.get('/',function(req,res){
    res.render('index',{title:'首页'});
  });

  app.get('/test',test.test);
  app.get('/testGet',test.testGet);
  app.post('/testPost',test.testPost);
  app.post('/testJson',test.testJson);
  app.post('/addTest',test.addTest);
};