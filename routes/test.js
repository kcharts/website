exports.test = function(req,res){
	res.render('test',{param:'参数',param1:'参数1'});
};

exports.testGet = function(req, res){
  var test = req.query.test;
  var test1 = req.query.test1;
  console.log(test);
  res.render('test',{param:test,param1:test1});
};

exports.testPost = function(req, res){
  var test3 = req.body.test3;
  var test4 = req.body.test4;
  console.log(test3);
  res.render('test',{param:test3,param1:test4});
};


exports.testJson = function (req, res) {
	var data = req.body.name;
	console.log(data);
	var returnData = {name:'Jack',age:10};
    res.json(returnData);
};
