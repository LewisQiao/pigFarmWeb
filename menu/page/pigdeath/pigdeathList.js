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
		var url = '/pigDeath/getTroublepigByList?pid=' + user.pid + "&state=0";
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
						field: 'ttroubleTotal',
						title: '异常数量',
						align: 'center'
					},
					{
						field: 'thandle',
						title: '如何处理',
						align: 'center'
					},
					{
						field: 'tpigstyNo',
						title: '发现猪圈',
						align: 'center'
					},
					{
						field: 'pinstorageTime',
						title: '发现时间',
						align: 'center',
						templet: function(d) {
							return dateFormat("YYYY-mm-dd HH:MM", d.tfindTime);
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
			title = "添加猪仔"
		} else {
			title = "修改猪仔"
		}
		var index = layui.layer.open({
			title: title,
			type: 2,
			content: "pigdeathAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				console.log(edit)
				if(edit) {
					body.find(".pigId").val(edit.tid);
					body.find(".userGrade").val(edit.pnumber);
					//$("#findtime").val(dateFormat("YYYY-mm-dd HH:MM", edit.ptotal));
					body.find(".findtime").val(dateFormat("YYYY-mm-dd HH:MM", edit.ptotal));
					//					laydate.render({
					//						elem: '#findtime',
					//						//value: dateFormat("YYYY-mm-dd HH:MM", edit.ptotal) //参数即为：2018-08-20 20:08:08 的时间戳
					//						value: edit.ptotal
					//					});
					body.find(".troubletotal").val(edit.ttroubleTotal);
					body.find(".handle").val(edit.thandle);
					body.find(".pigstyno").val(edit.tpigstyNo);
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回异常列表', '.layui-layer-setwin .layui-layer-close', {
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
			} else if(layEvent === 'usable') { //设置死亡
				addLink(data)
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

	//设置为死亡
	function addLink(edit) {
		console.log(edit)
		var index = layer.open({
			title: "设置死淘",
			type: 2,
			area: ["360px", "280px"],
			content: "page/pigdeath/pigdeathSetup.html",
			success: function(layero, index) {
				var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
				if(edit) {
					body.find(".tid").val(edit.tid);
					body.find(".pnumber").val(edit.pnumber);
					body.find(".troubleTotal").val(edit.ttroubleTotal);
					body.find(".pigstyNo").val(edit.tpigstyNo);
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回异常列表', '.layui-layer-setwin .layui-layer-close', {
						tips: 3
					});
				}, 500)
			}
		})
	}

})