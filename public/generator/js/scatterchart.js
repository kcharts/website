KISSY.add(function(S, ScatterChart) {
	var $ = S.all,
		Evt = S.Event,
		IO = S.io;

	//产生配置
	function genConfig() {
		try {
			var defaultCfg = {
				renderTo: "#demo1",
				title:{
					content:['Untitled']
				},
				subTitle:{
					content:['untitled']
				},
				tip:{
	                template:function(data){
	                    return data.y[0]+","+data.y[1];
	                },
	                alignX:"right",
	                alignY:"bottom",
	                offset:{
	                    x:-10,
	                    y:-10
	                },
	                boundryDetect:true
	            },
				xGrids:{
	                isShow:false
	            },
	            xAxis: {
	                num:10
	             },
	             xLabels:{
	               css:{
	                    "padding-top":"5px"
	               }
	             },
	              yLabels:{
	               css:{
	                    "text-indent":"-5px"
	               }
	             },
	             yAxis:{
	                isShow:false
	             },
				legend:{
					isShow:true
				},
				xAxis: {
	                num:10
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

				if (attrName && (subAttrVal || false === subAttrVal)) {
					if (!config[attrName]) {
						config[attrName] = {};
					}

					if (attrType && !config[attrName][attrType]) {
						config[attrName][attrType] = {};
					}

					if (subAttrName) {
						if (attrType) {
							config[attrName][attrType][subAttrName] = subAttrVal;
						} else {
							config[attrName][subAttrName] = subAttrVal;
						}
					} else {
						config[attrName] = subAttrVal;
					}

				}
			})
			return S.mix(defaultCfg, config, undefined, undefined, true);
		} catch (e) {
			alert("配置项有误，请检查");
		}
	}

	//支持字符串的number判断
	function isNum(arg) {
		if (S.isNumber(arg/1)) return true;
		if (!isNaN(arg - 0)) return true;
		return false;
	}
	//格式化数据
	function formatData(data) {
		var data = S.trim(data).replace(/\n/g, ",").split(",");
		var __isNum = function(str){
			var flag = true;
			var args = str.split(" ");

			for(var i in args){
				if(!isNum(args[i])){
					flag = false;
					return false;
				}else{
					flag &= true;
				}
			}
			return flag;
		}
		var series = [],obj = {data:[]};
		for(var i in data){
			if(__isNum(data[i])){
				// obj && obj.name && obj.data && series.push(obj);
				// obj = {};
				// obj.name = data[i];
				// obj.data = [];
				obj.text = 'data';
				obj.data.push(data[i].split(" "));
			}
		}
		series.push(obj);
		return series;
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
				temp.push("\"" + name + "\" : ");

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


	$("#J_btnGen").on("click", function() {
		var config = genConfig();
		var series = formatData($("#J_series").val());
		S.log(series)
		var cfg = S.mix(config, {series:series});
		var scatterchart = new ScatterChart(cfg);

		$("#J_codePane").val(JsonUti.convertToString(cfg));

	});

	$("#J_btnGen").fire("click");


}, {
	requires: [
		'gallery/kcharts/1.3/scatterchart/'
	]
});