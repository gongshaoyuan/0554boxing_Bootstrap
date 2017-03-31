/*
 * @Author: 0554boxing.com
 * @Date:   2016-05-03
 */
$(document).ready(function(){

  var tips;
  var theTop = 70;
  var old = theTop;
  function initFloatTips()
  {
    tips = document.getElementById('divQQbox');
    moveTips();
  }
  function moveTips()
  {
    var tt=50;
    if (window.innerHeight)
    {
      pos = window.pageYOffset
    }else if (document.documentElement && document.documentElement.scrollTop) {
      pos = document.documentElement.scrollTop
    }else if (document.body) {
      pos = document.body.scrollTop;
    }
    //http:
    pos=pos-tips.offsetTop+theTop;
    pos=tips.offsetTop+pos/10;
    if (pos < theTop){
      pos = theTop;
    }
    if (pos != old) {
      tips.style.top = pos+"px";
      tt=10;//alert(tips.style.top);
    }
    old = pos;
    setTimeout(moveTips,tt);
  }
  initFloatTips();
  if(typeof(HTMLElement)!="undefined")//给firefox定义contains()方法，ie下不起作用
  {
    HTMLElement.prototype.contains=function (obj)
    {
      while(obj!=null&&typeof(obj.tagName)!="undefind"){//
        if(obj==this) return true;
        obj=obj.parentNode;
      }
      return false;
    }
  };




});


