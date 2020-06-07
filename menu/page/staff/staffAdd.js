var userLoca = parent.parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery;

	form.verify({
		sname: function(val) {
			if(val == '') {
				return "员工姓名不能为空";
			}
		},
		sage: function(val) {
			if(val == '') {
				return "员工年龄不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "年龄必须是整数";
			}
		},
		sidcarrd: function(val) {
			if(val == '') {
				return "身份证不能为空";
			}
			if(!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)) {
				return "身份证不合法";
			}
		},
	})
	form.on("submit(addStaff)", function(data) {
		//实际使用时的提交信息
		$.post(BASEURL + "/staff/addOrModifyStaff", {
			sId: $(".sid").val(),
			sName: $(".sname").val(),
			sAge: $(".sage").val(),
			sIdNumber: $(".sidcarrd").val(),
			sState: 1,
			sHideAge: data.field.hideage,
			sHideIdNumber: data.field.hideidcard,
			pId: user.pid
		}, function(res) {
			if(res.code == 0) {
				top.layer.msg("发布成功");
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			} else {
				top.layer.msg("发布失败");
			}
		})
	})

	//格式化时间
	function filterTime(val) {
		if(val < 10) {
			return "0" + val;
		} else {
			return val;
		}
	}
	//定时发布
	var time = new Date();
	var submitTime = time.getFullYear() + '-' + filterTime(time.getMonth() + 1) + '-' + filterTime(time.getDate()) + ' ' + filterTime(time.getHours()) + ':' + filterTime(time.getMinutes()) + ':' + filterTime(time.getSeconds());

})