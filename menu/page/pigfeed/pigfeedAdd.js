var userLoca = parent.parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery;

	form.on("submit(addPigSite)", function(data) {
		// 实际使用时的提交信息
		$.post(BASEURL + "/piglet/addOrModifyPiglet", {
			pId: $(".pigId").val(),
			pTotal: $(".pigTotal").val(),
			pIds: user.pid
		}, function(res) {
			if(res.code == 0) {
				top.layer.msg("操作成功");
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			} else {
				top.layer.msg("失败");
			}
		})
	})
})