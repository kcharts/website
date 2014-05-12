(function(S){
	S.use('core',function(){
		var $=S.all;
		//nav
		var aLi=$('#nav li');
		var oBox=$('#nav .box');
		var oCur=$('#nav .cur')[0];

		oBox[0].style.left=oCur.children[0].offsetLeft+'px';
		oBox[0].style.width=oCur.children[0].offsetWidth+'px';
		for(var i=0;i<aLi.length-1;i++)
		{
		  aLi[i].onmouseover=function()
		  {
		    oBox.stop().animate({'left':this.offsetLeft+20,'width':this.offsetWidth-40},0.4,'easeOutStrong');
		  }

		  aLi[i].onmouseout=function()
		  {
		    oBox.stop().animate({'left':oCur.offsetLeft+20,'width':oCur.offsetWidth-40},0.4,'easeOutStrong');
		  }
		}
});
})(KISSY)