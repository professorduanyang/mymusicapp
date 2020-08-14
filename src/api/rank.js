import myjsonp from '../common/js/jsonp.js'
import {options} from './config.js'

//获取排行耪信息
export function getTopList(){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
    return myjsonp(url,{
      g_tk: 1928093487,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      format: 'jsonp',
      uin: 0,
      needNewCode: 1,
      platform: 'h5'
    },options)
}

//根据排行榜id获取歌曲列表
export function getSongsList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    return myjsonp(url,{
      topid,
      g_tk: 1928093487,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      format: 'jsonp',
      needNewCode: 1,
      uin: 0,
      tpl: 3,
      page: 'detail',
      type: 'top',
      platform: 'h5'
    },options)
}