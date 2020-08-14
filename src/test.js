var treeObject = [
   {
   	 id : 1,
   	 name : '三级节点1',
   	 parent_id : 6
   },
   {
   	 id : 2,
   	 name : '四级节点1',
   	 parent_id : 3
   },
   {
   	 id : 3,
   	 name : '三级节点2',
   	 parent_id : 6
   },
   {
   	 id : 4,
   	 name : '四级节点2',
   	 parent_id : 3
   },
   {
   	 id : 5,
   	 name : '一级节点',
   	 parent_id : -1
   },
   {
   	 id : 6,
   	 name : '二级节点1',
   	 parent_id : 5
   },
   {
   	 id : 7,
   	 name : '三级节点3',
   	 parent_id : 8
   },
   {
   	 id : 8,
   	 name : '二级节点2',
   	 parent_id : 5
   },
   {
   	 id : 9,
   	 name : '四级节点3',
   	 parent_id : 1
   },
   {
   	 id : 10,
   	 name : '四级节点4',
   	 parent_id : 7
   },
   {
   	 id : 11,
   	 name : '四级节点5',
   	 parent_id : 7
   },
   {
   	 id : 12,
   	 name : '四级节点6',
   	 parent_id : 7
   }
];

var obj = {};
//递归解构的方法
function resolveTreeFormation(parentId,parentElementArr){
	//根节点
	if (parentId == -1) {
		treeObject.find((treeObj) => {
			if (treeObj.parent_id == parentId) {
				obj.id = treeObj.id;
				obj.name = treeObj.name;
				obj.children = [];
				resolveTreeFormation(obj.id,obj.children);
			}
		});
	}
	//非根节点
	else {
       //根据父节点id查子节点
       treeObject.forEach((treeObj) => {
       	  if (treeObj.parent_id == parentId) {
       	  	parentElementArr.push(treeObj);
       	  	//此时子节点仍然还有子节点
       	  	var element = parentElementArr[parentElementArr.length-1];
       	  	if (checkHasSonElement(element.id)) {
       	  		element.children = [];
       	  		resolveTreeFormation(element.id,element.children);
       	  	}
       	  }
       });
	}
}

//判断子节点是否还有子节点
function checkHasSonElement(id){
	for (var i = 0; i < treeObject.length; i++) {
		if (treeObject[i].parent_id == id) {
			return true;
		}
	}
	return false;
}

resolveTreeFormation(-1);
console.log(JSON.stringify(obj));