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
		mname: function(val) {
			if(val == '') {
				return "材料名字不能为空";
			}
		},
		mcount: function(val) {
			if(val == '') {
				return "材料数量不能为空";
			}
			if(!/(^[1-9]\d*$)/.test(val)) {
				return "材料数量必须是整数";
			}
		},
		mprice: function(val) {
			if(val == '') {
				return "材料单价不能为空";
			}
			if(!/^(\d+)(.\d{0,2})?$/.test(val)) {
				return "材料单价小数最多两位";
			}
		},
		mtotal: function(val) {
			if(val == '') {
				return "材料总价不能为空";
			}
			if(!/^(\d+)(.\d{0,2})?$/.test(val)) {
				return "材料总价小数最多两位";
			}
		},
	})

	//添加材料
	form.on("submit(addPigSite)", function(data) {
		if(1 == data.field.openness) {
			if("" == $("#rsource").val()) {
				top.layer.msg("请选择来源");
			}
		}
		// 实际使用时的提交信息
		$.post(BASEURL + "/material/addOrModifyMaterial", {
			mId: $(".pigId").val(),
			uNumber: user.unumber,
			mName: $(".mname").val(),
			mCount: $(".mcount").val(),
			mPrice: $(".mprice").val(),
			mTotal: $(".mtotal").val(),
			mRemarks: $(".mremarks").val(),
			state: data.field.openness,
			pId: user.pid,
			rName: $(".mname").val(),
			rPhone: $(".rphone").val(),
			rSource: $("#rsource").val(),
			rRemarks: $(".rremarks").val()
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
//计算总价
function total() {
	var mcount = $(".mcount").val();
	var mprice = $(".mprice").val();
	$(".mtotal").val(mcount * mprice);
}

function newdiscovery() {
	console.log();
	if(1 == $('#IsPurchased input[name="openness"]:checked ').val()) {
		$("#reference")[0].style.display = "block";
	} else {
		$("#reference")[0].style.display = "none";
	}
}