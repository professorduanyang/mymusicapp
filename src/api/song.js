import axios from 'axios'

//获取歌词的方法
export function getLyric(songmid) {
    const data = {
        songmid,
        g_tk:1928093487,
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        format:'json',
        platform: 'yqq',
        hostUin:0,
        needNewCode:0,
        categoryId:10000000,
        pcachetime: +new Date()
    }
    return axios.get('/api/lyric',{
        params:data
    })
}