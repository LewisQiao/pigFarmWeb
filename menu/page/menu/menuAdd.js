layui.use(['tree', 'util'], function() {
	var tree = layui.tree,
		layer = layui.layer,
		util = layui.util,

	
	//模拟数据

	data = [{
		title: '饲料管理',
		id: 1,
		checked: false,
		spread: true,
		children: [{
				title: '饲料进库',
				id: 4,
				spread: true,
			},
			{
				title: '饲料使用',
				id: 4,
				spread: true,
			}
		]
	}, {
		title: '生猪管理',
		id: 2,
		field: '',
		spread: true,
		children: [{
				title: '猪仔入库',
				id: 5,
				field: '',
				spread: true,
			},
			{
				title: '生猪异常',
				id: 5,
				field: '',
				spread: true,
			},
			{
				title: '生猪死淘',
				id: 5,
				field: '',
				spread: true,
			}
		]
	}, {
		title: '数据管理',
		id: 16,
		field: '',
		spread: true,
		children: [{
			title: '材料入库',
			id: 17,
			field: '',
			fixed: true,
		}, {
			title: '材料使用记录',
			id: 27,
			field: '',
		}]
	}]

	//基本演示
	tree.render({
		elem: '#test12',
		data: data,
		showCheckbox: true //是否显示复选框
			,
		id: 'demoId1',
		isJump: true //是否允许点击节点时弹出新窗口跳转
			,
		click: function(obj) {
			var data = obj.data; //获取当前点击的节点数据
			layer.msg('状态：' + obj.state + '<br>节点数据：' + JSON.stringify(data));
		}
	});

	//按钮事件
	util.event('lay-demo', {
		getChecked: function(othis) {
			var checkedData = tree.getChecked('demoId1'); //获取选中节点的数据

			layer.alert(JSON.stringify(checkedData), {
				shade: 0
			});
			console.log(checkedData);
		},
		setChecked: function() {
			tree.setChecked('demoId1', [1, 16]); //勾选指定节点
		},
		reload: function() {
			//重载实例
			tree.reload('demoId1', {

			});

		}
	});

});