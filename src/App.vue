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
// 动态引入
import MusicCard from '@/components/music/index.vue';
import ImgUpdate from '@/components/imgUpdate/index.vue';
import Export from '@/components/export/index.vue';
import Scroll from '@/components/scroll/index.vue';

import { exportInfo, navData } from '@/utils/commData';
const state = reactive({
	musicShow: true,
	scrollShow: false,
});

const exportRef = ref(null);
const imgRef = ref(null);
const scrollRef = ref(null);
// 处理
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

const imgHandler = (params) => {};
</script>

<style scoped lang="scss"></style>
