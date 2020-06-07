var userLoca = parent.$("#user").val();
var users = storage.getItem(userLoca);
var user = JSON.parse(users)

layui.use(['form', 'layer', 'laydate', 'table', 'laytpl'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		laytpl = layui.laytpl,
		table = layui.table;

	//新闻列表
	var tableIns = getFeed();

	function getFeed(fname) {

		var url = '/feed/getFeedByList?pid=' + user.pid;
		if(fname != undefined && fname != "") {
			url = url + "&fName=" + fname
		}
		table.render({
			elem: '#feedList',
			url: BASEURL + url,
			cellMinWidth: 95,
			page: true,
			limits: [10, 15, 20, 25],
			limit: 10,
			height: "full-125",
			id: "newsListTable",

			cols: [
				[{
						type: "checkbox",
						fixed: "left",
						width: 50
					},
					{
						field: 'fid',
						title: 'ID',
						width: 60,
						align: "center"
					},
					{
						field: 'fname',
						title: '饲料名称',
						width: 180
					},
					{
						field: 'ffreight',
						title: '饲料运费',
						align: 'center'
					},
					{
						field: 'ftotal',
						title: '饲料总数',
						align: 'center',
					},
					{
						field: 'fuseTotal',
						title: '使用数量',
						align: 'center',
						templet: function(d) {
							if(0 == d.fuseTotal) {
								return "暂未使用";
							} else {
								return d.fuseTotal;
							}
						}
					},
					{
						field: 'fsurplusNumber',
						title: '剩余数量',
						align: 'center'
					},
					{
						field: 'ftime',
						title: '进库时间',
						align: 'center',
						minWidth: 110,
						templet: function(d) {
							return dateFormat("YYYY-mm-dd HH:MM", d.ftime)
						}
					},
					{
						field: 'freturn',
						title: '是否退回',
						align: 'center',
						minWidth: 110,
						templet: function(d) {
							if(0 == d.freturn) {
								return "未退回";
							} else {
								return "已退回";
							}
						}
					},
					{
						title: '操作',
						width: 170,
						templet: '#newsListBar',
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
			//			table.reload("newsListTable", {
			//				page: {
			//					curr: 1 //重新从第 1 页开始
			//				},
			//				where: {
			//					key: $(".searchVal").val() //搜索的关键字
			//				}
			//			})
			getFeed($(".searchVal").val());
		} else {
			layer.msg("请输入搜索的内容");
		}
	});

	//添加饲料
	function addFeed(edit) {
		var title;
		if(null == edit) {
			title = "添加";
		} else {
			title = "修改";
		}
		var index = layui.layer.open({
			title: title,
			type: 2,
			content: "feedAdd.html",
			end: function() {
				$(".layui-laypage-btn").click();
			},
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".feedId").val(edit.fid);
					body.find(".feedName").val(edit.fname);
					body.find(".feedfreight").val(edit.ffreight);
					body.find(".feedcount").val(edit.ftotal);
					if(0 == edit.freturn) {
						body.find(".openness input[name='openness'][title=新入库]").prop("checked", "checked");
					} else {
						body.find(".openness input[name='openness'][title=已退回]").prop("checked", "checked");
					}
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回饲料列表', '.layui-layer-setwin .layui-layer-close', {
						tips: 3
					});
				}, 500)
			}
		})
		layui.layer.full(index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(index);
		})
	}
	$(".addFeed_btn").click(function() {
		addFeed();
	})

	//批量删除
	$(".delAll_btn").click(function() {
		var checkStatus = table.checkStatus('newsListTable'),
			data = checkStatus.data,
			newsId = [];
		if(data.length > 0) {
			for(var i in data) {
				newsId.push(data[i].newsId);
			}
			layer.confirm('请选择要删除的饲料', {
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
			layer.msg("请选择需要删除的饲料");
		}
	})

	//列表操作
	table.on('tool(feedList)', function(obj) {
		var ulevel = user.ulevel;
		var unumber = user.unumber;
		var layEvent = obj.event,
			data = obj.data;
		if(ulevel < 3) {
			if(layEvent === 'edit') { //编辑
				addFeed(data);
			} else if(layEvent === 'del') { //删除
				layer.confirm('确定删除此饲料？', {
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
		} else {
			if(unumber == data.unumber) {
				if(layEvent === 'edit') { //编辑
					addFeed(data);
				} else if(layEvent === 'del') { //删除
					layer.confirm('确定删除此饲料？', {
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
			} else {
				layer.msg("只能操作自己添加的数据");
			}
		}
	});

})