import myjsonp from '../common/js/jsonp.js';
import axios from 'axios';
import {commonParams,options} from './config.js';

export function getSliders(){
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    return myjsonp(url,Object.assign({},commonParams,{platform: 'h5',uin: 0,needNewCode: 1}),options);
}

export function getHotSongs(){
	return axios.get(
		'/api/getHotSongs',
		{
		  params:Object.assign(
			  {},commonParams,
			  {
			  	platform:'yqq',
			  	hostUin:0,
			  	sin:0,
			  	ein:29,
			  	sortId:5,
			  	needNewCode:0,
			  	categoryId:10000000,
			  	rnd:Math.random(),
			  	format:'json'
			  }
		  )
		}
	);
}

export function getSlidersAndSongs() {
	return axios.all([getHotSongs(),getSliders()]);
}

export function getSongList(disstid){
	return axios.get(
		'/api/getSongs',
		{
		  params:{
			type: 1,
			json: 1,
			utf8: 1,
			onlysong: 0,
			new_format: 1,
			disstid:disstid,
			g_tk: 5381,
			loginUin: 1378714540,
			hostUin: 0,
			format: 'json',
			inCharset: 'utf8',
			outCharset: 'utf-8',
			notice: 0,
			platform: 'yqq.json',
			needNewCode: 0
		  }
		}
	)
}
