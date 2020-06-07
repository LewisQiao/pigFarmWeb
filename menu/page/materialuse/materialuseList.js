var userLoca = parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer', 'table', 'laydate', 'laytpl'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laytpl = layui.laytpl,
		table = layui.table,
		laydate = layui.laydate;

	//用户列表
	var tableIns = getPigsite();

	function getPigsite(pnumber) {
		var url = '/material/getUseMaterialByList?pid=' + user.pid;
		if(pnumber != undefined && pnumber != "") {
			url = url + "&purpose=" + pnumber
		}
		table.render({
			elem: '#pigsiteList',
			url: BASEURL + url,
			cellMinWidth: 95,
			page: true,
			height: "full-125",
			limits: [10, 15, 20, 25],
			limit: 20,
			id: "userListTable",
			cols: [
				[{
						type: "checkbox",
						fixed: "left",
						width: 50
					},
					{
						field: 'm_number',
						title: '材料编号',
						minWidth: 200,
						align: "center"
					},
					{
						field: 'm_usage',
						title: '使用数量',
						align: 'center'
					},
					{
						field: 'm_name',
						title: '材料名字',
						align: "center"
					},
					{
						field: 'm_purpose',
						title: '用途',
						align: 'center'
					},
					{
						field: 'm_remarks',
						title: '备注',
						align: 'center'
					},
					{
						field: 's_name',
						title: '使用人',
						align: 'center'
					},
					{
						field: 'm_use_time',
						title: '使用时间',
						align: 'center',
						templet: function(d) {
							return dateFormat("YYYY-mm-dd HH:MM", d.m_use_time);
						}
					},
					{
						title: '操作',
						minWidth: 175,
						templet: '#pigsiteListBar',
						fixed: "right",
						align: "center"
					}
				]
			]
		});
	}

	//搜索【此功能需要后台配合，所以暂时没有动态效果演示】
	$(".search_btn").on("click", function() {
		if($(".searchVal").val() != '') {
			//用户列表
			getPigsite($(".searchVal").val());
		} else {
			layer.msg("请输入搜索的内容");
		}
	});

	//添加猪仔
	function addPigsite(edit) {
		var title;
		if(null == edit) {
			title = "添加材料"
		} else {
			title = "修改材料"
		}
		var index = layui.layer.open({
			title: title,
			type: 2,
			content: "materialuseAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".pigId").val(edit.id);
					body.find(".number").val(edit.u_number);
					body.find(".purpose").val(edit.m_purpose);
					body.find(".usage").val(edit.m_usage);
					body.find(".remarks").val(edit.m_remarks);
					body.find(".sid").val(edit.m_sid);
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回使用列表', '.layui-layer-setwin .layui-layer-close', {
						tips: 3
					});
				}, 500)
			}
		})
		layui.layer.full(index);
		window.sessionStorage.setItem("index", index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(window.sessionStorage.getItem("index"));
		})
	}
	$(".addPigsite_btn").click(function() {
		addPigsite();
	})

	//列表操作
	table.on('tool(pigsiteList)', function(obj) {
		var ulevel = user.ulevel;
		var layEvent = obj.event,
			data = obj.data;
		if(ulevel < 3) {
			if(layEvent === 'edit') { //编辑
				addPigsite(data);
			} else if(layEvent === 'del') { //删除
				layer.msg("暂不支持删除");
				//			layer.confirm('确定删除此用户？', {
				//				icon: 3,
				//				title: '提示信息'
				//			}, function(index) {
				//				// $.get("删除文章接口",{
				//				//     newsId : data.newsId  //将需要删除的newsId作为参数传入
				//				// },function(data){
				//				tableIns.reload();
				//				layer.close(index);
				//				// })
				//			});
			}
		} else {
			layer.msg("只能操作自己添加的数据");
		}
	});

})