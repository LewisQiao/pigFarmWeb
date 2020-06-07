var userLoca = parent.parent.$("#user").val();
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
		useFeedCount: function(val) {
			if(val == '') {
				return "使用量不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "使用量必须是整数";
			}
		},
		usePigsty: function(val) {
			if(val == '') {
				return "几号圈不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "饲料总数必须是整数";
			}
		},
	})
	form.on("submit(addUseFeed)", function(data) {
		if($(".feedId").val() == 0) {
			layer.msg('请选择使用的那一批饲料', {
				icon: 5
			});
			return false;
		}
		if($(".useFeedUser").val() == 0) {
			layer.msg('请选择使用人', {
				icon: 5
			});
			return false;
		}
		var unumber = user.unumber;
		var pid = user.pid;
		$.post(BASEURL + "/feed/useFeedRecord", {
			id: $(".id").val(),
			pId: pid,
			fUseFid: $(".feedId").val(),
			fUserNumber: $(".useFeedCount").val(),
			fSid: $(".useFeedUser").val(),
			uNumber: unumber,
			fPigsty: $(".usePigsty").val(),
		}, function(res) {
			if(res.code == 0) {
				layer.msg(res.msg);
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			} else {
				layer.msg(res.msg);
			}
		}, "json")
	})
})

/***
 * 查询本场可以使用的饲料和本场在职员工
 */
$(function() {
	$.post(BASEURL + "/feed/getFeedByPid", {
		pid: user.pid
	}, function(res) {
		var html;
		if(res.code == 0) {
			for(var i = 0; i < res.data.length; i++) {
				html += '<option value="' + res.data[i].fid + '">' + res.data[i].fname + '</option>'
			}
			$("#feedId").append(html)
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
			$("#useFeedUser").append(htmls)
		} else {
			top.layer.msg(res.msg);
		}
	}, "json")
})