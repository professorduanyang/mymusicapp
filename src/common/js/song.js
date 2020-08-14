export default class Song {
	constructor({id,mid,singer,songname,album,duration,image,url}){
	  this.id = id;//歌曲id
	  this.mid = mid;//歌曲mid
	  this.songname = songname;//歌曲名
	  this.singer = filterSinger(singer);//歌手详细信息(id,mid,name)
	  this.album = album;//专辑信息
	  this.duration = duration;//播放时长
	  this.image = image;//歌曲图片
	  this.url = url;//播放地址
	}
}

//抓包得到的singer是个数组,需要转成字符串格式,/隔开
function filterSinger(singer){
	var res = '';
	if (singer instanceof(Array) && singer.length) {
	   singer.forEach((item) => {
          if (item.name) {
          	res += item.name + '/';
          }
	   });
	   return res.substr(0,res.length - 1);
	}
	return res;
}