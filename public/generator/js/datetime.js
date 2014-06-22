KISSY.add(function(S, DateTime) {
	var $ = S.all,
		Evt = S.Event,
		IO = S.io;
	//产生配置

	function genConfig() {
		try {
			var defaultCfg = {
				renderTo: "#demo1",
				anim: {},
				title:{
					content:['Untitled']
				},
				subTitle:{
					content:['untitled']
				},
				defineKey: {
					x: "week",
					y: "y"
				},
				xLabels:{},
				yAxis: {
				min:0,
				num:8
			},
				tip: {
					template: "总支出：<span>{{y}}</span> 元<br/>",
					css: {
						"border-color": "{COLOR}"
					}
				},
				legend:{
					isShow:true
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

	//获取数据

	function getSeries(datas, txts) {
		var obj = [];
		for (var i in datas) {
			obj[i] = {};
			if (txts[i] !== undefined) {
				obj[i]['text'] = txts[i];
			}
			obj[i]['data'] = datas[i];
		}
		return obj;
	}
	//支持字符串的number判断

	function isNum(arg) {
		if (S.isNumber(arg)) return true;
		if (!isNaN(arg - 0)) return true;
		return false;
	}
	//去除array中多余的空格

	function formatAry(ary) {
		for (var i in ary) {
			if (ary[i] - 0 === 0) {
				ary.splice(i, 1);
			}
		}
		return ary;
	}
	//若一个数字都没有 则判定为横轴数据 全为数字也不一定是datarow

	function isDataRow(args) {
		var len = args.length || 0,
			j = 0;
		for (var i in args) {
			if (!isNum(args[i])) {
				j++;
			}
		}
		if (len > 0 && len == j) {
			return false;
		}
		if (args[0] && !isNum(args[0]) && j == 1) {
			return true;
		}
		return false;
	}
	//格式化数据

	function formatData(data) {
		var axis = [],
			series, data2, texts = [];
		var data = S.trim(data).replace(/\n/g, ",").split(",");
		for (var i in data) {
			data[i] = S.trim(data[i]);
		}
		var axisIndex = !isDataRow(data[data.length - 1].split(" ")) ? data.length - 1 : (!isDataRow(data[0].split(" ")) ? 0 : undefined);
		//没有配置text则默认索引1,2,3
		if (axisIndex !== undefined) {
			axis = formatAry(data[axisIndex].split(" "));
		}
		if (axisIndex === 0) {
			data2 = data.splice(1, data.length - 1);
		} else if (axisIndex === undefined) {
			data2 = data;
		} else {
			data2 = data.splice(0, data.length - 1);
		}
		data2 = formatAry(data2)
		for (var i in data2) {
			data2[i] = data2[i].replace(/\s+/g, ",").split(",");
			//去除text为空格的情况
			for (var j in data2[i]) {
				//判断是否为数字
				if (isNaN(data2[i][j] - 0)) {
					if (data2[i][j - 1] !== undefined) {
						data2[i][j - 1] += " " + data2[i][j];
						data2[i].splice(j, 1);
					}
				}
			}
			texts[i] = data2[i][0];
			data2[i] = data2[i].splice(1, data2[i].length - 1);
		}
		series = getSeries(data2, texts);
		if (axisIndex === undefined) {
			for (var i = 0; i < series[0]['data']['length']; i++) {
				axis[i] = i;
			}
		}
		return {
			series: series,
			axis: axis
		};
	}


	//处理横轴数据

	function formatXAxis(data) {
		if (!data) {
			alert("请输入横轴数据");
			return;
		}
		return {
			xAxis: {
				text: data.split("\n").join("").replace(/\s+/g, "").replace(/\{|\}|\[|\]|'|text:/g, "").split(",")
			}
		};
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

		var config = genConfig(),
			seriesData,
			xaxisData;
		//单独处理横轴间隔输出问题
		config.xLabels.template = function(index,txt){
			return index % (config.xLabels.step||1) == 0 ? txt : "";
		}
		seriesData = formatData($("#J_series").val());
		xaxisData = {xAxis:{text:seriesData.axis}};
		var cfg = S.mix(S.mix(config, seriesData), xaxisData);
		var datetime = new DateTime(cfg);
		$("#J_codePane").val(JsonUti.convertToString(cfg));
	});
	$("#J_btnGen").fire("click");
}, {
	requires: [
		'gallery/kcharts/1.3/datetime/', 'gallery/colorPicker/1.0/', 'gallery/colorPicker/1.0/index.css'
	]
});