var userLoca = parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer', 'laydate'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laydate = layui.laydate;
 
	//日期
	laydate.render({
		elem: '#findtime',
		type: 'datetime'
	});
	form.verify({
		purpose: function(val) {
			if(val == '') {
				return "请输入用途";
			}
		},
		money: function(val) {
			if(val == '') {
				return "金额不能为空";
			}
			if(!/^(\d+)(.\d{0,2})?$/.test(val)) {
				return "金额小数最多两位";
			}
		},
	})

	//添加死亡
	form.on("submit(addPigSite)", function(data) {
		if(data.field.sid == "") {
			top.layer.msg("请选择付钱的人");
			return false;
		}
		// 实际使用时的提交信息
		$.post(BASEURL + "/dailyPay/addOrModifyExpend", {
			eId: $(".pigId").val(),
			ePurpose: $(".purpose").val(),
			eMoney: $(".money").val(),
			sId: data.field.sid,
			uNumber: user.unumber,
			pId: user.pid
		}, function(res) {
			console.log(res)
			if(res.code == 0) {
				top.layer.msg("操作成功");
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			} else {
				top.layer.msg("操作失败");
			}
		})
	})
})

//查询本场员工
$(function() {
	$.get(BASEURL + "/staff/getStaffByList", {
		pid: user.pid,
		sstate: 1
	}, function(res) {
		var htmls;
		if(res.code == 0) {
			for(var i = 0; i < res.data.length; i++) {
				htmls += '<option value="' + res.data[i].sid + '">' + res.data[i].sname + '</option>'
			}
			$("#sid").append(htmls)
		} else {
			top.layer.msg(res.msg);
		}
	}, "json")
})