//const  BASEURL  =  "http://127.0.0.1:8005";
const BASEURL="http://39.97.254.1:8005"

var storage = window.localStorage; 

function GetRequest() {
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

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

//时间格式化
function dateFormat(fmt, date) {
	var date = new Date(date); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for(let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if(ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}