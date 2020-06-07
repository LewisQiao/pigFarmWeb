var userLoca = parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery;

	form.on("submit(addPigSite)", function(data) {
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		// 实际使用时的提交信息
		$.post(BASEURL + "/pigsite/addOrModifyPigsite", {
			pId: $(".pigsiteId").val(),
			pName: $(".pigsiteName").val(),
			pAddress: $(".pigsiteAddress").val(),
			pScale: $(".pigsiteScale").val()
		}, function(res) {
			if(res.code == 0) {
				top.layer.close(index);
				top.layer.msg("操作成功");
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			} else {
				top.layer.close(index);
				top.layer.msg("失败");
			}
		})
	})
})