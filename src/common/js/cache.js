import storage from 'good-storage'
import Song from './song.js'

const PLAY_MAX_LENGTH = 10 //播放记录最多10条
const SEARCH_MAX_LENGTH = 15 //搜索历史纪录15条
const COLLECT_MAX_LENGTH = 15 //收藏列表最多15条

//定义插入的方法
function insertIntoList(list,query,compare,length){
   let index = list.findIndex(compare) //查看之前记录中是否有该数据
   if (index == 0) {
   	return //如果第一条就是直接返回
   }
   if (index > 0) {
   	list.splice(index,1) //有的话先删掉
   }
   list.unshift(query) //加到列表第一个
   if (length && list.length > length) {
   	list.pop() //超过上限了,删掉原列表中最后一个
   }
}

//将搜索结果加入历史纪录(最多15条)
export function saveHistory(query){
   let historyList = storage.get('historyList',[])
   insertIntoList(historyList,query,(item) => {
   	return query === item
   },SEARCH_MAX_LENGTH)
   storage.set('historyList',historyList)
   return historyList
}

//添加播放记录(最多10条)
export function savePlayRecord(song){
   let playRecord = storage.get('playRecord',[])
   insertIntoList(playRecord,song,(item) => {
      return item.id === song.id
   },PLAY_MAX_LENGTH)
   storage.set('playRecord',playRecord)
   return playRecord
}

//添加进收藏列表(最多15条)
export function saveCollectList(song){
   let collectList = storage.get('collectList',[])
   insertIntoList(collectList,song,(item) => {
      return item.id === song.id
   },COLLECT_MAX_LENGTH)
   storage.set('collectList',collectList)
   return collectList
}

//从收藏列表删除
export function deleteFromCollectList(song){
   let collectList = storage.get('collectList',[])
   const index = collectList.findIndex(item => {
      return item.id === song.id
   })
   collectList.splice(index,1)
   storage.set('collectList',collectList)
   return collectList
}

