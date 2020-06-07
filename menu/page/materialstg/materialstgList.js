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
		var url = '/material/getMaterialList?pid=' + user.pid;
		if(pnumber != undefined && pnumber != "") {
			url = url + "&mname=" + pnumber
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
						field: 'mnumber',
						title: '进库编号',
						minWidth: 200,
						align: "center"
					},
					{
						field: 'mname',
						title: '材料名字',
						align: 'center'
					},
					{
						field: 'mcount',
						title: '材料总数',
						align: 'center'
					},
					{
						field: 'mprice',
						title: '材料单价',
						align: 'center'
					},
					{
						field: 'mtotal',
						title: '材料总价',
						align: 'center'
					},
					{
						field: 'musage',
						title: '使用量',
						align: 'center',
						templet: function(d) {
							if(null == d.musage) {
								return 0;
							}
							return d.musage;
						}
					},
					{
						field: 'mcount',
						title: '剩余量',
						align: 'center',
						templet: function(d) {
							if(null == d.musage) {
								return d.mcount;
							}
							return d.mcount - d.musage;
						}
					},
					{
						field: 'mremarks',
						title: '备注',
						align: 'center'
					},
					{
						field: 'maddTime',
						title: '添加时间',
						align: 'center',
						templet: function(d) {
							return dateFormat("YYYY-mm-dd HH:MM", d.maddTime);
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
			content: "materialstgAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".pigId").val(edit.mid);
					body.find(".mname").val(edit.mname);
					body.find(".mcount").val(edit.mcount);
					body.find(".mprice").val(edit.mprice);
					body.find(".mtotal").val(edit.mtotal);
					body.find(".mremarks").val(edit.mremarks);
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回材料列表', '.layui-layer-setwin .layui-layer-close', {
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