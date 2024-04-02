<template>
	<el-dialog v-model="state.dialogUploadVisible" :lock-scroll="false" draggable width="400px" @close="closeDialogEnd()">
		<template #header> 上传文件 </template>
		<div>
			<el-upload
				:multiple="props.multiple"
				:limit="!props.multiple ? 1 : 100"
				ref="uploadRef"
				drag
				:auto-upload="false"
				:file-list="state.fileList"
				action=""
				:on-change="handleChange"
				accept=".jpg,.jpeg,.png,.gif,.webp"
			>
				<template #file="{ file }">
					<div class="update-card">
						<div class="update-img">
							<img class="update-img-item" :src="file.url" alt="" />
							<div class="update-img-text">
								<div class="mb5">{{ file.name }}</div>
								<div class="mb8">分辨率: {{ `${file.width}*${file.height}` }}</div>
								<div>
									<el-tag :type="file.valid ? 'success' : 'danger'">{{ file.valid ? '合格' : '不合格' }}</el-tag>
								</div>
							</div>
							<div class="update-img-icon" :style="{ backgroundColor: file.valid ? '#67c23a' : '#DE2910' }"></div>
							<i class="icon-close" @click="delImg(file)">x</i>
						</div>
					</div>
				</template>
				<el-icon class="el-icon--upload"> 📁 </el-icon>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<template #tip>
					<div class="el-upload__tip">请上传分辨率大于 <span class="bold-red">500x500</span> 的图片</div>
				</template>
			</el-upload>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancel">取消</el-button>
				<el-button type="primary" @click="uploadFile" :loading="state.loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
const uploadRef = ref();
const emits = defineEmits(['getUrl']);
const props = defineProps({
	multiple: {
		type: Boolean,
		default: false,
	},
});
const state = reactive({
	loading: false,
	dialogUploadVisible: false,
	// 上传的文件
	fileList: [],
});

// 打开上传页面
const openDialog = () => {
	state.dialogUploadVisible = true;
};

// 通过onChanne方法获得文件列表
const handleChange = async (file, fileList) => {
	let promiseAll = [];
	fileList.forEach((el) => {
		promiseAll.push(checkImageResolution(el, 500, 500));
	});
	Promise.all(promiseAll).then(() => {
		state.fileList = fileList;
	});
};

const delImg = (file) => {
	state.fileList = state.fileList.filter((el) => el.uid != file.uid);
};

const uploadFile = async () => {
	if (state.fileList.length < 1) {
		ElMessage.warning('请先上传图片');
		return;
	}
	let errImg = state.fileList.find((el) => el.valid == false);
	if (errImg) return ElMessage.warning('存在不合格图片,请删除后重新尝试！');
	let res = null;
	let result = null;
	state.loading = true;
	try {
		if (props.multiple) {
			let params = state.fileList.map((el) => {
				return el.raw;
			});
			// 多图接口...
		} else {
			let params = state.fileList[0].raw;
			// 单图接口...
		}
		ElMessage.success('上传成功');
		emits('getUrl', result);
		state.dialogUploadVisible = false;
		state.loading = false;
	} catch {
		state.loading = false;
	}
};

const checkImageResolution = (file, maxWidth, maxHeight) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function (event) {
			const img = new Image();
			img.onload = function () {
				const width = this.width;
				const height = this.height;
				file.width = width;
				file.height = height;
				file.url = event.target?.result;
				if (width < maxWidth && height < maxHeight) {
					file.valid = false;
					// ElMessage.warning(`图片分辨率不符合要求，分辨率至少“800x800”，当前分辨率为“${width}*${height}”`);
					resolve({ valid: false, width, height });
				} else {
					file.valid = true;
					resolve({ valid: true, width, height });
				}
			};
			img.onerror = function () {
				reject(new Error('无法加载图像'));
			};
			img.src = event.target?.result;
		};
		reader.onerror = function () {
			reject(new Error('读取文件出错'));
		};
		reader.readAsDataURL(file.raw);
	});
};

// 取消
const cancel = () => {
	state.dialogUploadVisible = false;
};

const closeDialogEnd = () => {
	state.fileList = [];
};

// 导出对象
defineExpose({ openDialog });
</script>

<style scoped lang="scss">
.update-card {
	margin: 10px 0 0;
	padding: 0;
	list-style: none;
	position: relative;

	.update-img {
		position: relative;
		overflow: hidden;
		z-index: 0;
		background-color: var(--el-fill-color-blank);
		border: 1px solid var(--el-border-color);
		border-radius: 6px;
		box-sizing: border-box;
		margin-top: 10px;
		padding: 10px;
		display: flex;
		align-items: center;
		.update-img-item {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			width: 70px;
			height: 70px;
			-o-object-fit: contain;
			object-fit: contain;
			position: relative;
			z-index: 1;
			background-color: var(--el-color-white);
		}
		.update-img-text {
			color: var(--el-text-color-regular);
			align-items: center;
			padding: 0 4px;
			transition: color var(--el-transition-duration);
			font-size: 12px;
		}
		.update-img-icon {
			position: absolute;
			right: -17px;
			top: -7px;
			width: 46px;
			height: 26px;
			background: var(--el-color-success);
			text-align: center;
			transform: rotate(45deg);
		}
		.icon-close {
			position: absolute;
			right: 10px;
			cursor: pointer;
		}
	}
}
</style>
