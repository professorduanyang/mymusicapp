//引入原生的JSONP插件
import originjsonp from 'jsonp';
//url是服务端接口地址(jsonp方法必须的参数)
//params是浏览器需要传递的参数(跟jsonp方法无关，自己加的)
//options是下面jsonp方法必须的参数(主要就是通知后台的callback方法名)
export default function(url,params,options){
	return new Promise((resolve,reject) => {
		originjsonp(appendURL(url,params),options,(error,data) => {
			if (!error) {
				resolve(data);
			}
			else {
				reject(error);
			}
		});
	});
}
function appendURL(url,params){
	if (params instanceof Object && Object.keys(params).length != 0) {
	   url += '?';
       for (let key in params) {
       	  if (params[key]) {
             url += `${key}=${params[key]}&`;
       	  }
       }
       url = url.substr(0,url.length - 1);
	}
	return url;
}