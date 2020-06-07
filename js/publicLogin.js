//const  BASEURL  =  "http://127.0.0.1:8085";
const BASEURL="http://39.97.254.1:8005"
function _post(url, params = {}) {
	var index = layer.load(1, {
		shade: [0.1, '#fff'] //0.1透明度的白色背景
	});
	return new Promise((resolve, reject) => {
		$.ajax({
			url: BASEURL + url,
			type: "post",
			dataType: 'json',
			data: params,
			success: res => {
				console.log(res)
				if(res.code) {
					resolve(res);
					layer.close(index);
				} else {
					reject(res);
					layer.close(index);
				}
			},
			error: err => {
				layer.close(index);
				reject(err)
			}
		});
	});
}

function _get(url, params = {}) {
	var index = layer.load(1, {
		shade: [0.1, '#fff'] //0.1透明度的白色背景
	});
	return new Promise((resolve, reject) => {
		$.ajax({
			url: BASEURL + url,
			type: "get",
			dataType: 'json',
			data: params,
			success: res => {
				if(!res.code) {
					layer.close(index);
					resolve(res)
				}
			},
			error: err => reject(err)
		});
	});
}