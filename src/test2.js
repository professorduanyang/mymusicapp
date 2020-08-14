async function fn(){
	let result = await setTimeout(() => {
		return 100;
	}, 1);
	return result;
}
console.log(fn());