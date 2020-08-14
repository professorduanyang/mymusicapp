import myjsonp from '../common/js/jsonp.js'
import axios from 'axios'
import {commonParams,options} from './config.js'

//获取全部歌手的方法
export function getSingers() {
	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
	return myjsonp(url,Object.assign({},commonParams,{
		channel: 'singer',
	    page: 'list',
	    key: 'all_all_all',
	    pagesize: 100,
	    pagenum: 1,
	    hostUin: 0,
	    needNewCode: 0,
	    platform: 'yqq'
	}),options);
}

//获取歌手详情
export function getSingerDetail(singerId){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
	return myjsonp(url,Object.assign({},commonParams,{
        hostUin: 0,
	    needNewCode: 0,
	    platform: 'yqq',
	    order: 'listen',
	    begin: 0,
	    num: 80,
	    songstatus: 1,
	    singermid: singerId
	}),options);
}

//获取Vkey的方法(用于拼接播放器url)
export function getVkey(songmid){
	const songtype = []
	for (var index = 0; index < songmid.length; index ++) {
	   songtype[index] = 0
	}
	return axios.post('/api/getVkey',{
	   comm:{
	   	g_tk:5381,
		inCharset:"utf-8",
		outCharset:"utf-8",
		notice:0,
		format:"json",
		platform:"h5",
		needNewCode:1,
		uin:0
	   },
	   req_0:{
	   	module:"vkey.GetVkeyServer",
        method:"CgiGetVkey",
        param:{
          guid:"3241890503",
          uin:"0",
		  loginflag:0,
		  platform:"23",
		  songtype,
		  songmid
        }
	   }
	})
}