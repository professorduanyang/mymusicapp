export default class Singer {
	constructor(id,name,mid){
	  this.id = id;
	  this.mid = mid;//歌手id
      this.name = name;//歌手姓名
      this.avatar = 'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+mid+'.jpg?max_age=2592000';//歌手图片地址
	}
}