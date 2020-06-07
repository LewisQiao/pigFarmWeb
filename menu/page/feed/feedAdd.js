var userLoca = parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer', 'layedit', 'laydate', 'upload'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		laypage = layui.laypage,
		upload = layui.upload,
		layedit = layui.layedit,
		laydate = layui.laydate,
		$ = layui.jquery;
	
	form.verify({
		feedName: function(val) {
			if(val == '') {
				return "饲料名称不能为空";
			}
		},
		feedfreight: function(val) {
			if(val == '') {
				return "饲料运费不能为空";
			}
			if(!/^(\d+)(.\d{0,2})?$/.test(val)) {
				return "饲料运费小数最多两位";
			}
		},
		feedcount: function(val) {
			if(val == '') {
				return "饲料总数不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "饲料总数必须是整数";
			}
		},
	})
	form.on("submit(addfeed)", function(data) {
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		$.post(BASEURL + "/feed/insertOrModifyFeed", {
			pId: user.pid,
			fId: $(".feedId").val(),
			fName: $(".feedName").val(),
			fFreight: $(".feedfreight").val(),
			fTotal: $(".feedcount").val(),
			uNumber: user.unumber
		}, function(res) {
			if(res.code == 0) {
				top.layer.close(index);
				layer.msg("添加成功");
				//刷新父页面
				parent.location.reload();
				layer.closeAll("iframe");
			} else {
				console.log(res)
				layer.msg("添加" + res.msg);
			}
		}, "json")
	})
})