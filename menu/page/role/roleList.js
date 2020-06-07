var userLoca = parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer', 'table', 'laytpl'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laytpl = layui.laytpl,
		table = layui.table;

	//用户列表
	var tableIns = table.render({
		elem: '#userList',
		//      url : '../../../json/userList.json',
		url: BASEURL+'/user/getUserList?pid=' + user.pid,
		cellMinWidth: 95,
		date: {
			id: 1
		},
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
					field: 'uname',
					title: '用户名',
					minWidth: 100,
					align: "center"
				},
				{
					field: 'uaccount',
					title: '账号',
					minWidth: 200,
					align: 'center'
				},
				{
					field: 'ustatus',
					title: '状态',
					align: 'center',
					templet: function(d) {
						return d.ustatus == "1" ? "正常使用" : "限制使用";
					}
				},
				{
					field: 'ucreateTime',
					title: '创建时间',
					align: 'center',
					templet: 
					function(d) {
						return dateFormat("YYYY-mm-dd HH:MM",d.ucreateTime)
					}
				},
				{
					field: 'uloginCount',
					title: '登录次数',
					align: 'center',
					templet: 
						function(d) {
							if(null != d.uloginCount){
								return d.uloginCount
							}
							else{
								return 0
							}
							 
						}					
				},
				{
					field: 'ulastLoginTime',
					title: '上次登录时间',
					align: 'center',
					templet: 
					function(d) {
						if(null != d.ulastLoginTime){
							return dateFormat("YYYY-mm-dd HH:MM",d.ulastLoginTime)
						}
						else{
							return "暂未登录"
						}
						 
					}
				},
				{
					field: 'upower',
					title: '权限',
					minWidth: 200,
					align: 'center'
				},
				{
					title: '操作',
					minWidth: 175,
					templet: '#userListBar',
					fixed: "right",
					align: "center"
				}
			]
		]
	});

	//搜索【此功能需要后台配合，所以暂时没有动态效果演示】
	$(".search_btn").on("click", function() {
		if($(".searchVal").val() != '') {
			table.reload("newsListTable", {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: {
					key: $(".searchVal").val() //搜索的关键字
				}
			})
		} else {
			layer.msg("请输入搜索的内容");
		}
	});

	//添加用户
	function addUser(edit) {
		console.log(edit)
		var title;
		if(null == edit){
			title = "添加用户"
		}else{
			title = "修改用户"
		}
		var index = layui.layer.open({
			title: title,
			type: 2,
			content: "userAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".pigId").val(edit.uid); 
					body.find(".userName").val(edit.uaccount); 
					body.find(".userZname").val(edit.uname);  
					body.find(".userPower").text(edit.upower);  
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
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
	$(".addNews_btn").click(function() {
		addUser();
	})

	//批量删除
	$(".delAll_btn").click(function() {
		var checkStatus = table.checkStatus('userListTable'),
			data = checkStatus.data,
			newsId = [];
		if(data.length > 0) {
			for(var i in data) {
				newsId.push(data[i].newsId);
			}
			layer.confirm('确定删除选中的用户？', {
				icon: 3,
				title: '提示信息'
			}, function(index) {
				// $.get("删除文章接口",{
				//     newsId : newsId  //将需要删除的newsId作为参数传入
				// },function(data){
				tableIns.reload();
				layer.close(index);
				// })
			})
		} else {
			layer.msg("请选择需要删除的用户");
		}
	})

	//列表操作
	table.on('tool(userList)', function(obj) {
		var layEvent = obj.event,
			data = obj.data;

		if(layEvent === 'edit') { //编辑
			addUser(data);
		} else if(layEvent === 'usable') { //启用禁用
			var _this = $(this),
				usableText = "是否确定禁用此用户？",
				btnText = "已禁用";
			if(_this.text() == "已禁用") {
				usableText = "是否确定启用此用户？",
					btnText = "已启用";
			}
			layer.confirm(usableText, {
				icon: 3,
				title: '系统提示',
				cancel: function(index) {
					layer.close(index);
				}
			}, function(index) {
				_this.text(btnText);
				layer.close(index);
			}, function(index) {
				layer.close(index);
			});
		} else if(layEvent === 'del') { //删除
			layer.confirm('确定删除此用户？', {
				icon: 3,
				title: '提示信息'
			}, function(index) {
				// $.get("删除文章接口",{
				//     newsId : data.newsId  //将需要删除的newsId作为参数传入
				// },function(data){
				tableIns.reload();
				layer.close(index);
				// })
			});
		}
	});

})