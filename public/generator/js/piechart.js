KISSY.add(function(S,PieChart) {
	var $ = S.all,
		Evt = S.Event,
		IO = S.io;
	//产生配置
	function genConfig() {

		var defaultCfg = {
						 data:[
						 {label:"Chrome", data:'1'},
						 { label:"FireFox", data:2 },
						 { label:"IE", data:3 },
						 { label:"Opera",data:4 },
						 { label:"Safari", data:5 }],
						 renderTo:"#demo1",
		      			rpadding:80,
						anim:{
							easing:'swing',
							duration:800
						}
					 };

		var config = {};

		$(".ks-chart-gen-attrs").each(function() {
			var attrName = this.attr("attrname"),
				subAttrName = this.attr("subattrname"),
				subAttrVal = (function(el) {
					if (el.attr("type") == "checkbox") {
						return el.attr("checked") ? true : false;
					} else {
						return el.val();
					}
				})(this),
				attrType = this.attr("attrtype");
		})
		return S.mix(defaultCfg, config, undefined, undefined, true);
	}


	var JsonUti = {
		//定义换行符
		n: "\n",
		//定义制表符
		t: "\t",
		//转换String
		convertToString: function(obj) {
			return JsonUti.__writeObj(obj, 1);
		},
		//写对象
		__writeObj: function(obj, level, isInArray) {
			//如果为空，直接输出null
			if (obj == null) {
				return "null";
			}
			//为普通类型，直接输出值
			if (obj.constructor == Number || obj.constructor == Date || obj.constructor == String || obj.constructor == Boolean) {
				var v = obj.toString();
				var tab = isInArray ? JsonUti.__repeatStr(JsonUti.t, level - 1) : "";
				if (obj.constructor == String || obj.constructor == Date) {
					//时间格式化只是单纯输出字符串，而不是Date对象
					return tab + ("\"" + v + "\"");
				} else
				if (obj.constructor == Boolean) {
					return tab + v.toLowerCase();
				} else {
					return tab + (v);
				}
			}

			//写Json对象，缓存字符串
			var currentObjStrings = [];
			//遍历属性
			for (var name in obj) {
				var temp = [];
				//格式化Tab
				var paddingTab = JsonUti.__repeatStr(JsonUti.t, level);
				temp.push(paddingTab);
				//写出属性名
				temp.push(name + " : ");

				var val = obj[name];
				if (val == null) {
					temp.push("null");
				} else {
					var c = val.constructor;

					if (c == Array) { //如果为集合，循环内部对象
						temp.push(JsonUti.n + paddingTab + "[" + JsonUti.n);
						var levelUp = level + 2; //层级+2
						var tempArrValue = []; //集合元素相关字符串缓存片段
						for (var i = 0; i < val.length; i++) {
							//递归写对象
							tempArrValue.push(JsonUti.__writeObj(val[i], levelUp, true));
						}

						temp.push(tempArrValue.join("," + JsonUti.n));
						temp.push(JsonUti.n + paddingTab + "]");
					} else
					if (c == Function) {
						temp.push("[Function]");
					} else {
						//递归写对象
						temp.push(JsonUti.__writeObj(val, level + 1));
					}
				}
				//加入当前对象“属性”字符串
				currentObjStrings.push(temp.join(""));
			}
			return (level > 1 && !isInArray ? JsonUti.n : "") //如果Json对象是内部，就要换行格式化
			+
				JsonUti.__repeatStr(JsonUti.t, level - 1) +
				"{" +
				JsonUti.n //加层次Tab格式化
			+
				currentObjStrings.join("," + JsonUti.n) //串联所有属性值
			+
				JsonUti.n +
				JsonUti.__repeatStr(JsonUti.t, level - 1) +
				"}"; //封闭对象
		},
		__isArray: function(obj) {
			if (obj) {
				return obj.constructor == Array;
			}
			return false;
		},
		__repeatStr: function(str, times) {
			var newStr = [];
			if (times > 0) {
				for (var i = 0; i < times; i++) {
					newStr.push(str);
				}
			}
			return newStr.join("");
		}
	};

		//支持字符串的number判断
	function isNum(arg) {
		if (!isNaN(arg - 0)) return true;
		return false;
	}
	//格式化数据
	function formatData(data) {
		var data = S.trim(data).replace(/\n/g, ",").split(","),
		series = [];
		for(var i in data){
			var tmp = data[i].replace(/\s+/g," ").split(" ");
			S.log(tmp[1])
			if(tmp.length == 1 && isNum(tmp[0])){
				series.push({label:i,data:tmp[0] - 0});
			}else if(tmp.length > 1){
				if(isNum(tmp[0])){
					series.push({label:tmp[1]||i,data:tmp[0] - 0});
				}else if(isNum(tmp[1])){
					series.push({label:tmp[0]||i,data:tmp[1] - 0});
				}
			}
		}
		return series;
	}

	function genChart(){
		$("#demo1").html("")
		var config = genConfig();
		var data = formatData($("#J_series").val());
		S.mix(config,{data:data});
		var piechart = new PieChart(config)
        //删除endframe这个side effect
        config = S.clone(config);

        if(config.anim){
          delete config.anim.endframe;
        }

		$("#J_codePane").val(JsonUti.convertToString(config));
	}

	genChart()

	$("#J_btnGen").on("click", function() {
		genChart();
	});
	// $("#J_btnGen").on("click", function() {
	// 	var config = genConfig(),
	// 		seriesData,
	// 		xaxisData;

	// 	seriesData = formatData($("#J_series").val());
	// 	xaxisData = {xAxis:{text:seriesData.axis}};
	// 	var cfg = S.mix(S.mix(config, seriesData), xaxisData);
	// 	var barchart = new BarChart(cfg);

	// 	$("#J_codePane").val(JsonUti.convertToString(cfg));

	// });

	// $("#J_btnGen").fire("click");


}, {
	requires: ['gallery/kcharts/1.3/piechart/']
});