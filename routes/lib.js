exports.index = function(req, res){
  var chartType = req.query.type === undefined ? "linechart" : req.query.type;

  var exit = chartType == 'dashboard' || chartType == 'mapchart' || chartType == 'sumdetailchart' || chartType == 'radarchart';
  console.log(chartType);
  console.log(exit);

  //res.render('test1', {chartType:chartType,exit:exit});
  res.render('lib', { chartType:chartType,exit:exit});
};
