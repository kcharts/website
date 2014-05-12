function iframeFitHeight(id,offset){
	var S = KISSY,
		$ = S.all,
		$ifr = $(id),
		offset = offset || 0;

	if($ifr[0] && $ifr[0].contentWindow.document.body){
		S.log($ifr[0].contentWindow.document.body.scrollHeight + offset)
		// $ifr.height($ifr[0].contentWindow.document.body.scrollHeight + offset);
	}
}

function getPos(obj)
{
	var l=0;
	var t=0;

	while(obj)
	{
		l+=obj.offsetLeft;
		t+=obj.offsetTop;

		obj=obj.offsetParent;
	}

	return {left:l,top:t};
}

function getStyle(obj,name)
{
	return obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];
}

function getByClass(obj,sClass)
{
	if(obj.getElementsByClassName)
	{
		return obj.getElementsByClassName(sClass);
	}
	else
	{
		var arr=[];
		var aEle=obj.getElementsByTagName('*');

		var re=new RegExp('\\b'+sClass+'\\b');

		for(var i=0;i<aEle.length;i++)
		{
			if(re.test(aEle[i].className))
			{
				arr.push(aEle[i]);
			}
		}
		return arr;
	}
}

function rnd(m,n)
{
	return parseInt(Math.random()*(n-m))+m;
}

function toDou(n)
{
	if(n<10)
	{
		return '0'+n;
	}
	else
	{
		return ''+n;
	}
}

function data2time(n)
{
	var date=new Date();

	date.setTime(n*1000);
	return date.getFullYear()+'-'+toDou(date.getMonth()+1)+'-'+toDou(date.getDate())+'   '+toDou(date.getHours())+':'+toDou(date.getMinutes())+':'+toDou(date.getSeconds());
}

//jsonp函数
function jsonp(url,json,fn)
{
	var fnName='jsonp'+Math.random();
	fnName=fnName.replace('.','');

	window[fnName]=function(json)
	{
		oHead.removeChild(oS);
		window[fnName]=null;
		fn(json);
	}

	json.cb=fnName;
	json.t=Math.random();

	var arr=[];

	for(var name in json)
	{
		arr.push(name+'='+json[name]);
	}

	var str=url+'?'+arr.join('&');

	var oS=document.createElement('script');
	var oHead=document.getElementsByTagName('head')[0];
	oS.src=str;
	oHead.appendChild(oS);
}

//模板复制
function cloneEle(obj,data)
{
	var oTmp=document.createElement('div');

	obj.parentNode.insertBefore(oTmp,obj);

	oTmp.appendChild(obj);

	var str=oTmp.innerHTML;

	oTmp.parentNode.insertBefore(obj,oTmp);

	obj.parentNode.removeChild(oTmp);

	str=str.replace(/\{\$\w+\}/g,function(s){
		s=s.substring(2,s.length-1);
		if(data[s]!=undefined)
		{
			return data[s];
		}
		else
		{
			return '';
		}
	});
	oTmp.innerHTML=str;
	return oTmp.children[0];
}

//运动类
function  setStyle(obj,name,value)
{
	if(name=='opacity')
	{
		obj.style.filter='alpha(opacity:'+value+')';
		obj.style.opacity=value/100;
	}
	else
	{
		obj.style[name]=value+'px';
	}
}

function getStyleMove(obj,name)
{
	var value=obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];

	if(name=='opacity')
	{
		return Math.round(parseFloat(value)*100);
	}
	else
	{
		return parseInt(value);
	}
}

function startMove(obj,json,fnEnd,level)
{
	if(!level)level=8;
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var isAll=true;
		for(var name in json)
		{
			var cur=getStyleMove(obj,name);
			var speed=(json[name]-cur)/level;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);

			if(cur!=json[name])
			{
				isAll=false;
			}

			setStyle(obj,name,cur+speed);
		}

		if(isAll)
		{
			clearInterval(obj.timer);
			fnEnd && fnEnd();
			return;
		}

	},30);
}

//start_json:开始的位置
//speed_json:开始的速度
//target_json：目标位置
function elecMove(obj,start_json,speed_json,target_json,fnEnd)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var isAll=true;
		for(var name in target_json)
		{
			speed_json[name]+= (target_json[name]-start_json[name])/5;
			speed_json[name]*=0.7;
			start_json[name]+=speed_json[name];

			if(target_json[name]!=Math.round(start_json[name]))
			{
				isAll=false;
			}

			obj.style[name]=Math.round(start_json[name])+'px';
		}
		if(isAll)
		{
			clearInterval(obj.timer);
			fnEnd&& fnEnd();
			return;
		}
	},30);
}

function elecMoveEsay(obj, iTarget,name,fn)
{
	var speed=0;
	var left=getStyleMove(obj,'top');

	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		speed+=(iTarget-left)/5;
		speed*=0.7;

		left+=speed;

		obj.style[name]=Math.round(left)+'px';
		if(iTarget==Math.round(left))
		{
			clearInterval(obj.timer);
			fn&&fn();
			return;
		}

	}, 30);
}
