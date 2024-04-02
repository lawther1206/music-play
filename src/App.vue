<template>
	<div>
		<div>
			<el-button @click="showType('music')">播放器</el-button>
			<el-button @click="showType('export')">导出</el-button>
			<el-button @click="showType('img')">上传图片</el-button>
			<el-button @click="showType('scroll')">电梯</el-button>
		</div>

		<MusicCard v-if="state.musicShow" />
		<Export ref="exportRef" :exportInfo="exportInfo" @save="exportHandler"></Export>
		<ImgUpdate ref="imgRef" @getUrl="imgHandler"></ImgUpdate>
		<Scroll :navData="navData" v-if="state.scrollShow"></Scroll>
	</div>
</template>

<script setup>

import { reactive, ref, defineAsyncComponent } from 'vue';
const MusicCard = defineAsyncComponent(() => import('./components/music/index.vue'));
const ImgUpdate = defineAsyncComponent(() => import('./components/imgUpdate/index.vue'));
const Export = defineAsyncComponent(() => import('./components/export/index.vue'));
const Scroll = defineAsyncComponent(() => import('./components/scroll/index.vue'));

import { exportInfo, navData } from '@/utils/commData';

const state = reactive({
	musicShow: false,
	scrollShow: false,
});

const exportRef = ref(null);
const imgRef = ref(null);
const scrollRef = ref(null);

const showType = (type) => {
	switch (type) {
		case 'music':
			state.musicShow = !state.musicShow;
			break;
		case 'export':
			exportRef.value?.openDialog();
			break;
		case 'img':
			imgRef.value?.openDialog();
			break;
		case 'scroll':
			state.scrollShow = !state.scrollShow;
			break;
	}
};

// 处理导出的回调
const exportHandler = (params) => {
	// ...接口请求 成功以后返回 true 失败 false
	exportRef.value?.closeDialogEnd(true);
};

const imgHandler = (params) => {
	console.log(params, 'params');
};
</script>

<style scoped lang="scss"></style>
