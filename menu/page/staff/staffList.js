var storage = window.localStorage;
layui.use(['form', 'layer', 'table', 'laytpl'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laytpl = layui.laytpl,
		table = layui.table;

	//用户列表
	var tableIns = table.render({
		elem: '#userList',
		url: BASEURL+'/staff/getStaffByList?pid='+storage.getItem("pid")+"&sstate=1",
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
					field: 'sname',
					title: '员工姓名',
					minWidth: 100,
					align: "center"
				},
				{
					field: 'sage',
					title: '员工年龄',
					minWidth: 50,
					align: 'center',
					templet: function(d) {
						return d.shideAge == 1 ? d.sage : "**";
					}
				},
				{
					field: 'sidNumber',
					title: '身份证号',
					minWidth: 180,
					align: 'center',
					templet: function(d) {
						return d.shideIdNumber == 1 ? d.sidNumber : "*****	";
					}
				},
				{
					field: 'sstate',
					title: '状态',
					align: 'center',
					templet: function(d) {
						return d.sstate == "1" ? "在职" : "离职";
					}
				},
				{
					field: 'sentryTime',
					title: '创建时间',
					align: 'center',
					templet: 
					function(d) {
						return dateFormat("YYYY-mm-dd HH:MM",d.sentryTime)
					}
				},
				{
					title: '操作',
					minWidth: 175,
					templet: '#staffAdd',
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
	function addStaff(edit) {
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
			content: "staffAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".sid").val(edit.sid);
					body.find(".sname").val(edit.sname);
					body.find(".sage").val(edit.sage);
					body.find(".hideage radio[value=" + edit.shideAge + "]").prop("checked", "checked"); 
					body.find(".sidcarrd").val(edit.sidNumber);
					body.find(".hideidcard radio[value=" + edit.shideIdNumber + "]").prop("checked", "checked"); 
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回员工列表', '.layui-layer-setwin .layui-layer-close', {
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
		addStaff();
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
			layer.confirm('确定删除选中的员工？', {
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
			layer.msg("请选择需要删除的员工");
		}
	})

	//列表操作
	table.on('tool(userList)', function(obj) {
		var layEvent = obj.event,
			data = obj.data;
		if(layEvent === 'edit') { //编辑
			addStaff(data);
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
	function deleteStaff(sid){
		 $.post(BASEURL+"/staff/addOrModifyStaff",{
		 	 sId : $(".sid").val(),
		     sName : $(".sname").val(),  
		     sAge : $(".sage").val(),  
		     sIdNumber : $(".sidcarrd").val(), 
		     sState : 1,  
		     sHideAge : data.field.hideage,
		     sHideIdNumber : data.field.hideidcard,
		     pId : storage.getItem("pid")
		 },function(res){
			if(res.code == 0){
			    top.layer.msg("发布成功");
			    layer.closeAll("iframe");
			    //刷新父页面
			    parent.location.reload();
			}else{
				top.layer.msg("发布失败");
			}
		 })
	}
})
