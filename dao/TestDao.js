var baseDao = require('./BaseDao'),
	Test = require('../models/TestModel.js').Test;

var TestDao = new DaoBase(Test);

module.exports = TestDao;