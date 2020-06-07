var userLoca = parent.parent.$("#user").val();
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
				return "异常数量不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "异常数量必须是整数";
			}
		},
	})

	//添加异常
	form.on("submit(addPigSite)", function(data) {
		if(data.field.pnumber == 0) {
			top.layer.msg("请选择异常猪的批次");
			return false;
		}
		console.log(data)
		// 实际使用时的提交信息
		$.post(BASEURL + "/pigDeath/addOrModifyTroublepig", {
			tId: $(".pigId").val(),
			pNumber: data.field.pnumber,
			findtime: $("#findtime").val().toString(),
			tTroubleTotal: $(".troubletotal").val(),
			tHandle: $(".handle").val(),
			uNumber: user.unumber,
			tPigstyNo: $(".pigstyno").val(),
			tState: 0,
			pId: user.pid
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

	//添加死亡数量
	form.on("submit(addLink)", function(data) {
		if(null == $(".deathcount").val()) {
			top.layer.msg("请输入死亡数量");
			return false;
		}
		if(!/(^[1-9]\d*$)/.test($(".deathcount").val())) {
			top.layer.msg("死亡数量必须是整数");
			return false;
		}
		if(parseInt($(".deathcount").val()) > parseInt($(".troubleTotal").val())) {
			top.layer.msg("死亡数量不能大于异常数量");
			return false;
		}
		console.log($(".troubleTotal").val())
		console.log($(".pigstyNo").val())
		// 实际使用时的提交信息
		$.post(BASEURL + "/pigDeath/addDeathPid", {
			tId: $(".tid").val(),
			pNumber: $(".pnumber").val(),
			tTroubleTotal: $(".troubletotal").val(),
			tReason: $(".treason").val(),
			uNumber: user.unumber,
			tPigstyNo: $(".pigstyNo").val(),
			deathCont: $(".deathcount").val(),
			tState: 1,
			pId: user.pid
		}, function(res) {
			if(res.code == 0) {
				top.layer.msg("操作成功");
				layer.closeAll("iframe");
				//刷新父页面
				//
				$(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

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