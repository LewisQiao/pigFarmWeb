layui.use(['form', 'layer', 'table', 'laytpl'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laytpl = layui.laytpl,
		table = layui.table;

	//用户列表
	var tableIns = getPigsite();

	function getPigsite(pname) {
		var url = '/pigsite/getPigsiteList';
		if(pname != undefined && pname != "") {
			url = url + "?pname=" + pname
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
						field: 'pname',
						title: '猪场名字',
						minWidth: 100,
						align: "center"
					},
					{
						field: 'pscale',
						title: '猪场规模',
						minWidth: 200,
						align: 'center'
					},
					{
						field: 'paddress',
						title: '猪场地址',
						align: 'center'
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

	//添加猪场
	function addPigsite(edit) {
		var title;
		if(null == edit) {
			title = "添加猪场"
		} else {
			title = "修改猪场"
		}
		var index = layui.layer.open({
			title: title,
			type: 2,
			content: "pigsiteAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".pigsiteId").val(edit.pid);
					body.find(".pigsiteName").val(edit.pname);
					body.find(".pigsiteScale").val(edit.pscale);
					body.find(".pigsiteAddress").val(edit.paddress);
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回猪场列表', '.layui-layer-setwin .layui-layer-close', {
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
		var storage = window.localStorage;
		var ulevel = storage.getItem("ulevel");
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