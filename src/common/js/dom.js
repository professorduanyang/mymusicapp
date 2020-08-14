//获取浏览器的CSS前缀
function getPrefix(){
  let obj = {
  	webkit:'webkitTransition',//Chrome浏览器
  	Moz:'MozTransition',//火狐浏览器
  	O:'OTransition',//Opera浏览器
  	ms:'msTransition',//IE浏览器
  	standard:'transition'//标准浏览器
  };
  let divS = document.createElement('div').style;
  //判断当前样式中是否存在该属性,从而得到当前浏览器前缀
  for (let key in obj) {
  	if (divS[obj[key]] !== undefined) {
  	   return key;
  	}
  }
  return false;
}

export function getStylePrefix(styleName){
  let prefix = getPrefix();
  if (!prefix) {
  	return false;
  }
  //标准浏览器下,直接返回样式名即可(例如transform)
  if (prefix == 'standard') {
  	return styleName;
  }
  //其他浏览器,返回诸如webkitTransform格式(前缀名+样式名首字母大写)
  return prefix + styleName.charAt(0).toUpperCase() + styleName.substr(1);
}
