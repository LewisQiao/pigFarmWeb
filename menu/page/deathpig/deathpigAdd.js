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
		findtime: function(val) {
			if(val == '') {
				return "请选择时间";
			}
		},
		troubletotal: function(val) {
			if(val == '') {
				return "死亡数量不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "死亡数量必须是整数";
			}
		},
	})

	//添加死亡
	form.on("submit(addPigSite)", function(data) {
		if(data.field.pnumber == 0) {
			top.layer.msg("请选择死亡猪的批次");
			return false;
		}
		// 实际使用时的提交信息
		$.post(BASEURL + "/pigDeath/addDeathPig", {
			tId: $(".pigId").val(),
			pNumber: data.field.pnumber,
			findtime: $("#findtime").val().toString(),
			tTroubleTotal: $(".troubletotal").val(),
			tReason: $(".handle").val(),
			uNumber: user.unumber,
			tPigstyNo: $(".pigstyno").val(),
			tState: 1,
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

//查询本场未出库猪
$(function() {
	$.post(BASEURL + "/piglet/getInPigByPid", {
		pid: user.pid
	}, function(res) {
		var html;
		if(res.code == 0) {
			for(var i = 0; i < res.data.length; i++) {
				html += '<option value="' + res.data[i].pnumber + '">' + res.data[i].pnumber + '</option>'
			}
			$(".userGrade").append(html)
		} else {
			top.layer.msg(res.msg);
		}
	}, "json")
})