var userLoca = parent.parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery;

	form.verify({
		userName: function(val) {
			if(val == '') {
				return "账户不能为空";
			}
			if(!/^1[34578]\d{9}$/.test(val)) {
				return "账户格式不正确";
			}
		},
		userPass: function(val) {
			if(val == '') {
				return "密码不能为空";
			}
		},
		userZname: function(val) {
			if(val == '') {
				return "真实姓名不能为空";
			}
		},
	})
	form.on("submit(addUser)", function(data) {
		// 实际使用时的提交信息
		$.post(BASEURL + "/user/addOrModifyUserByPid", {
			uId: $(".pigId").val(),
			uSuperiorLeaderNumber: user.unumber,
			uAccount: $(".userName").val(),
			uPassword: $(".userPass").val(),
			uName: $(".userZname").val(),
			uPower: $("#userPower").val(),
			uLevel: 4,
			pId: user.pid,
			uStatus: 1
		}, function(res) {
			console.log(res)
			if(res.code == 0) {
				top.layer.msg(res.msg);
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			} else {
				top.layer.msg(res.msg);
			}
		})
	})
})