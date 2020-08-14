import myjsonp from '../common/js/jsonp.js'
import axios from 'axios'
import {commonParams,options} from './config.js'

//查询热门搜索
export function searchForHotKeys() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    return myjsonp(url,Object.assign({},commonParams,{
      uin: 0,
      needNewCode: 1,
      platform: 'h5'
    }),options)
}

//关键字搜索
export function searchForKeywords(keyword,pageNum,pageSize){
    const params ={
        w: keyword,//关键字
        p: pageNum,//当前页
        n: pageSize,//请求数量
        format:'json'
    }
    return axios.get('/api/search',{
        params
    })
}