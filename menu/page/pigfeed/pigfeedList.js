var userLoca = parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer', 'table', 'laydate', 'laytpl'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laytpl = layui.laytpl,
		table = layui.table;

	//用户列表
	var tableIns = getPigsite();

	function getPigsite(pnumber) {
		var url = '/piglet/getPigletByPid?pid=' + user.pid;
		if(pnumber != undefined && pnumber != "") {
			url = url + "&pnumber=" + pnumber
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
						field: 'pnumber',
						title: '进库编号',
						minWidth: 200,
						align: "center"
					},
					{
						field: 'ptotal',
						title: '猪仔数量',
						align: 'center'
					},
					{
						field: 'pstate',
						title: '出库状态',
						minWidth: 120,
						align: 'center',
						templet: function(d) {
							if(d.pstate == 0) {
								return '<input id="pstate,' + d.pid + '" type="checkbox" name="pstate" value="' + d.pstate + '" lay-filter="newsTop" lay-skin="switch" lay-text="已进库|已出库" ' + "checked" + '>'
							} else {
								return '<input id="pstate,' + d.pid + '" type="checkbox" name="pstate"  value="' + d.pstate + '" lay-filter="newsTop" lay-skin="switch" lay-text="已进库|已出库" ' + "" + '>'
							}
						}
					},
					{
						field: 'pdeathTotal',
						title: '死亡数量',
						align: 'center',
						templet: function(d) {
							if(null == d.pdeathTotal) {
								return 0;
							} else {
								return d.pdeathTotal;
							}
						}
					},
					{
						field: 'pproblemTotal',
						title: '异常数量',
						align: 'center',
						templet: function(d) {
							if(null == d.pproblemTotal) {
								return 0;
							} else {
								return d.pproblemTotal;
							}
						}
					},
					{
						field: 'ptotal',
						title: '正常数量',
						align: 'center',
						templet: function(d) {
							var pdeathTotal;
							var pproblemTotal;
							if(null == d.pdeathTotal) {
								pdeathTotal = 0;
							} else {
								pdeathTotal = d.pdeathTotal;
							}
							if(null == d.pproblemTotal) {
								pproblemTotal = 0;
							} else {
								pproblemTotal = d.pproblemTotal;
							}
							return d.ptotal - pdeathTotal - pproblemTotal;
						}
					},
					{
						field: 'pinstorageTime',
						title: '进库时间',
						align: 'center',
						templet: function(d) {
							return dateFormat("YYYY-mm-dd HH:MM", d.pinstorageTime);
						}
					},
					{
						field: 'poutboundTime',
						title: '出库时间',
						align: 'center',
						templet: function(d) {
							if(0 == d.pstate) {
								return "未出库";
							} else {
								return dateFormat("YYYY-mm-dd HH:MM", d.poutboundTime);
							}
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

	//是否置顶
	form.on('switch(newsTop)', function(data) {
		var arr = data.elem.id.split(",");
		console.log(data.elem.value)
		if(data.elem.value != 1) {
			//询问框
			layer.confirm('确定该批猪已出库？', {
				btn: ['确定', '取消'] //按钮
			}, function() {
				let state;
				if(data.elem.checked == false) {
					state = 1;
				} else {
					state = 0;
				}
				console.log(state)
				$.post(BASEURL + "/piglet/addOrModifyPiglet", {
					pId: arr[1],
					pState: state
				}, function(res) {
					console.log(res)
					if(res.code == 0) {
						top.layer.msg("修改成功")
					} else {
						data.elem.checked = !data.elem.checked;
						form.render();
					}
				}, "json")
			}, function() {
				data.elem.checked = !data.elem.checked;
				form.render();
			});
		} else {
			data.elem.checked = !data.elem.checked;
			form.render();
			top.layer.msg("该批次猪已出库")
		}
	})

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
			title = "添加猪仔"
		} else {
			title = "修改猪仔"
		}
		var index = layui.layer.open({
			title: title,
			type: 2,
			content: "pigfeedAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".pigId").val(edit.pid);
					body.find(".pigTotal").val(edit.ptotal);
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回猪仔列表', '.layui-layer-setwin .layui-layer-close', {
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