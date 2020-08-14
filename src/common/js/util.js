//获取min到max不重复的随机整数
export function getRandom(min,max){
	var arr = []
	for (let index = min; index <= max; index++ ) { 
		let result = compute(min,max)
		while (arr.includes(result)) {
			result = compute(min,max)
		}
		arr.push(result)
	}
	return arr
}

//获取min到max间的随机整数
export function getInteger(min,max){
	return compute(min,max)
}

function compute(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min)
}

//查找音乐列表中某首歌的位置
export function findSongIndex(list,song){
	return list.findIndex(item => {
		return item.id == song.id
	})
}

//防抖(思想:短时间内连续操作都无效,直到停下来后最后一次才生效)
export function debounce(fn,delay){
	//这是防抖的标准写法,记这种!!!
	return function(...args) {
	   if (window.timer) {
	   	  clearTimeout(timer)
	   }
	   window.timer = setTimeout(() => {
          if (typeof fn === 'function') {
          	 fn.apply(this,args)
          }
	   },delay)
	}
  /*
    自己这种写法更容易理解,但是拿不到外界给的参数---例如debounce(fn,delay)(arg1,arg2..),而标准写法返回一个函数中调用fn,可以拿到
	if (window.timer) {
   	  clearTimeout(window.timer)
    }
    window.timer = setTimeout(() => {
      if (typeof fn === 'function') {
      	 fn()
      }
    },delay)
  */
}