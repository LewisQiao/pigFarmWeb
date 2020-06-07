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
				return "材料用途不能为空";
			}

		},
		usage: function(val) {
			if(val == '') {
				return "材料用途数量不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "材料用途数量必须是整数";
			}
		},
	})

	//添加材料
	form.on("submit(addPigSite)", function(data) {
		if("" == $("#number").val()) {
			top.layer.msg("请选择材料");
			return false;
		}
		if("" == $("#sid").val()) {
			top.layer.msg("请选择使用人");
			return false;
		}
		// 实际使用时的提交信息
		$.post(BASEURL + "/material/addOrModifyUseMaterial", {
			id: $(".pigId").val(),
			mNumber: $("#number").val(),
			mPurpose: $(".purpose").val(),
			uNumber: user.unumber,
			mRemarks: $(".remarks").val(),
			mUsage: $(".usage").val(),
			mSid: $("#sid").val(),
			pId: user.pid
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

//查询本场未使用完的材料
$(function() {
	$.post(BASEURL + "/material/getUnfinishedMaterialList", {
		pid: user.pid
	}, function(res) {
		var html;
		if(res.code == 0) {
			for(var i = 0; i < res.data.length; i++) {
				if(null == res.data.msurplus || res.data.msurplus < res.data.mcount) {
					html += '<option value="' + res.data[i].mnumber + '">' + res.data[i].mname + '</option>'
				}
			}
			$(".number").append(html)
		} else {
			top.layer.msg(res.msg);
		}
	}, "json")

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