(function(S){
	var $ = S.all;
	S.Config.debug = true
	$("#J_Frame").on("load",function(e){
		var ifr = e.target,h = ifr.contentWindow.document.body.scrollHeight;
		$("#J_Frame").css({"height":h})
	});
})(KISSY);