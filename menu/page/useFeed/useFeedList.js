layui.use(['form', 'layer', 'laydate', 'table', 'laytpl'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		laytpl = layui.laytpl,
		table = layui.table;

	//新闻列表
	var tableIns = getFeed();

	function getFeed(sname) {
		var storage = window.localStorage;
		var pid = storage.getItem("pid");
		var url = '/feed/getUseFeedRecord?pid=' + pid;
		if(sname != undefined && sname != "") {
			url = url + "&uname=" + sname
		}
		table.render({
			elem: '#feedList',
			url: BASEURL + url,
			cellMinWidth: 95,
			page: true,
			limits: [10, 15, 20, 25],
			limit: 20,
			height: "full-125",
			id: "newsListTable",
			cols: [
				[{
						type: "checkbox",
						fixed: "left",
						width: 50
					},
					{
						field: 'id',
						title: 'ID',
						width: 60,
						align: "center"
					},
					{
						field: 'f_name',
						title: '使用的饲料',
						width: 130
					},
					{
						field: 'f_user_number',
						title: '使用数量',
						align: 'center'
					},
					{
						field: 'f_use_time',
						title: '使用的时间',
						align: 'center',
						templet: function(d) {
							return dateFormat("YYYY-mm-dd HH:MM", d.f_use_time)
						}
					},
					{
						field: 's_name',
						title: '使用人',
						align: 'center',
					},
					{
						field: 'f_pigsty',
						title: '猪圈号',
						align: 'center',
						width: 80,
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
			content: "useFeedAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(edit) {
					body.find(".id").val(edit.id);
					body.find(".useFeedCount").val(edit.f_user_number);
					body.find(".usePigsty").val(edit.f_pigsty);
					$("select[name='feedId']").val(edit.f_use_fid);
					$("select[name='useFeedUser']").val(edit.f_sid);
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
		var storage = window.localStorage;
		var ulevel = storage.getItem("ulevel");
		var unumber = storage.getItem("unumber");
		var layEvent = obj.event,
			data = obj.data;
		if(ulevel < 3) {
			console.log(data)
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
			}else{
				layer.msg("只能操作自己添加的数据");
			}
		}
	});

})