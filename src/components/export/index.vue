<template>
	<div>
		<el-dialog v-model="state.isShowDialog" width="600" draggable :close-on-click-modal="false" :destroy-on-close="true">
			<template #header> 导出 </template>
			<div v-loading="state.loading">
				<div class="export-item mb20" v-for="item in state.exportInfo" :key="item.key">
					<el-card shadow="never" v-if="item.show">
						<template #header>
							<div class="card-header">
								<span>{{ item.label }}</span>
							</div>
						</template>
						<div class="card-box" id="target-div">
							<!-- 单选 -->
							<div v-if="item.type == 'radio'">
								<el-radio-group v-model="item.value">
									<el-radio class="radio-item" :value="item1.key" v-for="item1 in item.option" :key="item1.key">{{ item1.label }}</el-radio>
								</el-radio-group>
								<div v-for="item1 in item.option" :key="item1.key">
									<div v-if="item1.type == 'tree' && item.value == item1.key">
										<el-tree
											:data="item1.orgData"
											@check="(data, checked) => checkHanlder(data, checked, item1)"
											node-key="id"
											:props="{ children: 'children', label: 'displayName' }"
											:default-checked-keys="item1.orgData.map((el: any) => el.id)"
											show-checkbox
											highlight-current
										/>
									</div>
								</div>
							</div>
							<!-- 多选 -->
							<div v-if="item.type == 'checkbox'">
								<el-checkbox-group v-model="item.value" class="flex-warp">
									<el-checkbox class="checkbox-item" :value="item1.key" v-for="item1 in item.option" :key="item1.key" :disabled="item1.disabled">
										<div class="mb10">{{ item1.label }}</div>

										<div class="mb15">
											<div v-if="item1.type == 'range-input'">
												<el-input-number :title="item1.left" v-model="item1.min" controls-position="right" class="w80px" /> ~
												<el-input-number :title="item1.right" v-model="item1.max" controls-position="right" class="w80px" />
											</div>
											<div v-if="item1.type == 'radio-input'">
												<el-radio-group v-model="item1.value">
													<el-radio :value="item2.key" v-for="item2 in item1.option" :key="item2.key">{{ item2.label }}</el-radio>
												</el-radio-group>
											</div>
										</div>
									</el-checkbox>
								</el-checkbox-group>
							</div>
						</div>
					</el-card>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="state.isShowDialog = false" v-if="!state.loading"> 取消 </el-button>
					<el-button type="primary" @click="submit" :loading="state.loading">{{ state.text }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps({
	exportInfo: {
		type: Array,
		default: () => [],
	},
});
const emits = defineEmits(['save']);

const state = reactive({
	exportInfo: [],
	isShowDialog: false,
	loading: false,
	text: '导出',
});

onMounted(() => {
	// 没有做深拷贝其实是引用的原来数据
	Object.assign(state.exportInfo, props.exportInfo);
});

const checkHanlder = (e, check, item1) => {
	item1.value = check.checkedKeys;
};
// 打开弹窗
const openDialog = async () => {
	state.isShowDialog = true;
};

// 提交
const submit = async () => {
	let params = {
		// 导出格式
		format: undefined,
		// 导出范围
		dataRange: undefined,
		dataRangeInput: {
			input: undefined,
		},
		options: {},
	};
	state.exportInfo.forEach((el) => {
		if (el.key == 'format') params.format = el.value;
		if (el.key == 'dataRange') {
			params.dataRange = el.value;
			let option = el.option.find((el1) => el1.key == el.value);
			params.dataRangeInput.input = option?.value ?? {};
		}
		if (el.key == 'options') {
			el.value.forEach((el1) => {
				params.options[el1] = true;
				let option = el.option.find((el2) => el2.key == el1);
				if (option && option.type) {
					if (option.key == 'num') {
						params.options.imageWidthPx = option.min;
						params.options.imageHeightPx = option.max;
					} else {
						params.options[option.key] = option.value;
					}
				}
			});
		}
	});
	state.loading = true;
	state.text = '正在导出...';
	emits('save', params);
};

const closeDialogEnd = (flag) => {
	state.text = '导出';
	state.loading = false;
	// 是否提交成功
	if (flag) state.isShowDialog = false;
};

defineExpose({ openDialog, closeDialogEnd });
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
	padding: 10px 20px;
}
.card-box {
	.checkbox-item {
		display: block;
		min-width: 220px;
		margin-bottom: 10px;
		height: auto;
		:deep(.el-checkbox__label) {
			vertical-align: top;
		}
	}
}
</style>
