export const getMusic = () => {
	return new Promise((resolve, reject) => {
		let res = {
			data: {
				result: [
					{
						key: 'haqs',
						name: '黑暗骑士',
						singer: '五月天',
						url: '',
						preview: '',
					},
					{
						key: 'fqxdsws',
						name: '父亲写的散文诗',
						singer: '刘乐瑶',
						url: '',
						preview: '',
					},
				],
			},
		};
		resolve(res);
	});
};

export const exportInfo = [
	{
		key: 'dataRange',
		label: '导出范围',
		option: [
			{
				key: 1,
				label: '全部导出',
				type: 'text',
				value: {},
			},
			{
				key: 2,
				label: '按搜索条件',
				type: 'text',
				value: {
					search: 'test',
					type: 'none',
				},
			},
		],
		type: 'radio',
		value: 1,
		show: true,
	},
	{
		key: 'options',
		label: '导出设置',
		option: [
			{
				key: 'num',
				label: '默认数量',
				type: 'range-input',
				left: '宽度',
				right: '高度',
				min: 0,
				max: 10,
			},
			{
				key: 'info',
				label: '设置信息',
				type: 'radio-input',
				option: [
					{
						label: '默认',
						key: 0,
					},
					{
						label: '高效',
						key: 1,
					},
					{
						label: '低效',
						key: 2,
					},
				],
				value: 0,
			},
			{
				key: 'splice',
				label: '是否移除标题',
				// 表示是否有子项目,如果有则配置option
				type: null,
			},
		],
		type: 'checkbox',
		value: ['splice'],
		show: true,
	},
	{
		key: 'format',
		label: '导出格式',
		option: [
			{ key: 1, label: '导出格式1', type: 'text' },
			{ key: 2, label: '导出格式2', type: 'text' },
		],
		type: 'radio',
		value: 1,
		show: true,
	},
];

export const navData = [
	{
		title: '基本信息',
		id: '#scroll-basic',
	},
	{
		title: '采购信息',
		id: '#scroll-purchaseInfos',
	},
];
