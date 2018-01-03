var index=0,
	timer=null,
	container=document.getElementById("container"),
	banner=document.getElementById("banner"),
	box=banner.getElementsByTagName("div"),
	nav=document.getElementsByTagName("li");

function changeImg(){
	for(var i=0;i<box.length;i++){
		box[i].style.display="none";
		nav[i].style.backgroundColor="#fff"
	}

	box[index].style.display="block";
	nav[index].style.backgroundColor="yellow";
}

function startAutoPlay(){
	timer=setInterval(function(){		
		index++;
		if(index>3) index=0;
		changeImg();
	},1000);
}

function start(){
	//鼠标在元素上时停止播放
	container.onmouseover=function(){
		clearInterval(timer);
	}

	//鼠标离开元素开始播放
	container.onmouseout=function(){
		startAutoPlay();
	}

	container.onmouseout();

	//点击导航切换
	for(var i=0;i<nav.length;i++){
		nav[i].setAttribute("data-num",i);
		nav[i].onclick=function(){
			index=this.getAttribute("data-num");
			changeImg();
		}
	}
}

window.onload=start;

