;KISSY.add(function(S,Switchable){

	var $ = S.all,Evt = S.Event;

	var version = "1.3",
		demoroot = './demos/'+version+'/demo/',
		chartType;

	return {
		init:function(){

			var self = this;

			self.$J_switchable = $("#J_switchable");

			chartType = $("#H_chartType").val() || "linechart";

			self.render(chartType);

		},
		render:function(chartType){

			var self = this;
			//获取demo列表
			self.getDemoUrls(chartType,function(demoUrls){

				self.demoUrls = demoUrls;
				//渲染容器
				self.renderDemoItems();
				//渲染
				self.renderSwitchable();
			});

		},
		getDemoUrls:function(chartType,cb){
			S.io({
				url:"util.php?m=getDemoUrls",
				data:{type:chartType,t:Math.random()},
				dataType:"json",
				success:cb
			});
		},
		renderDemoItems:function(){
			var self = this,
				html = "";
			for(var i in self.demoUrls){
				html += '<div class="chart-container">'
					+'<img class="loading" src="http://img01.taobaocdn.com/tps/i1/T1cKm3XkRpXXXXXXXX-48-48.gif" style="display:block;position:absolute;width:48px;height:48px;margin:140px 330px;" />'
					+'</div>';
			}
			$(".ks-switchable-content",self.$J_switchable).html(html);
		},
		renderSwitchable:function(){

			var self = this;
			self.switchable = new Switchable.Carousel(self.$J_switchable[0],{
				 effect: 'scrollx',
	            easing: 'easeOutStrong',
	            viewSize: [750],
	            circular: false,
	            prevBtnCls: 'prev',
	            nextBtnCls: 'next',
	            triggerType:"click"
			});

			self.switchable.on("beforeSwitch",function(e){
				//渲染图表 发起ajax
				self.getChartByAjax(e.toIndex);
			});

			self.getChartByAjax(0);

		},
		getChartByAjax:function(index){
			S.log(index)
			var self = this,
				url = demoroot + chartType + "/" + self.demoUrls[index] + "?t="+Math.random(),
				$ctn = $(".chart-container",self.$J_switchable).item(index),
				$ifr;

				S.log($("iframe",$ctn))
				//清空已经存在的iframe
				if(!$("iframe",$ctn)[0]){
					$("iframe",$ctn).remove();
					//放入iframe
					$ifr = $("<iframe scrolling='no' frameborder='0' src="+url+"></iframe>").appendTo($ctn);
				}
			$("#J_OpenNew").attr("href",url)
			Evt.on($ifr,"load",function(e){
				//清空Loading图片
				$(".loading",$ctn).remove();
				$(e.target).show();
				// var h = e.target.contentWindow.document.body.scrollHeight;
				// $(e.target).css({height:h});
				// $(".scroller",$("#J_switchable")).css({height:h});

				// e.target.contentWindow.document.body.style.zoom = 0.5;
			});
		}
	};
},{requires:['switchable']});