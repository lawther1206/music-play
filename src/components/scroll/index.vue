<template>
	<div>
		<!-- 导航区域 -->
		<ul class="navs" v-if="props.navData && props.navData.length > 0">
			<div class="title">快速导航</div>
			<li v-for="(item, index) in props.navData" :key="index" :class="{ active: state.active === item.id }" @click="scrollTo(item.id)">
				{{ item.title }}
			</li>
		</ul>
	</div>
</template>
<script setup>
import { onMounted, onUnmounted, reactive, nextTick, onUpdated } from 'vue';
const props = defineProps({
	navData: Array,
});

const state = reactive({
	// 存放要滚动的dom节点
	mainnNode: null,
	// 存放导航节点的offsetTop
	navContentList: [],
	active: '',
});

onMounted(() => {
	nextTick(() => {
		if (props.navData && props.navData.length > 0) {
			// 设置监听滚动的dom
			let node = document.querySelectorAll('#app');
			state.active = props.navData[0]?.id;
			if (node.length > 0) {
				state.mainnNode = node[0];
				// 监听滚动事件
				state.mainnNode.addEventListener('scroll', onScroll, { passive: true });
			}
		}
	});
});

onUnmounted(() => {
	removeList();
});

const removeList = () => {
	if (state.mainnNode) {
		// 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
		state.mainnNode.removeEventListener('scroll', onScroll, { passive: true });
		console.log('移除监听');
	}
};

onUpdated(() => {});

// 初始化offsetTop数组
const initList = () => {
	if (props.navData && props.navData.length > 0) {
		let offsetHeight = 0;
		state.navContentList = [];
		props.navData.forEach((el) => {
			let option = document.getElementById(el.id);
			if (option) {
				offsetHeight += option.offsetHeight;
				state.navContentList.push({
					id: el.id,
					top: option.offsetTop,
					offsetHeight,
				});
			}
		});
	}
};

const onScroll = () => {
	initList();
	// 获取当前文档流的 scrollTop
	const scrollTop = state.mainnNode.scrollTop;
	// 定义当前点亮的导航下标
	let navIndex = '';
	for (var n = 0; n <= state.navContentList.length; n++) {
		// 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
		if (state.navContentList[n] && scrollTop >= state.navContentList[n].top) {
			navIndex = state.navContentList[n].id;
		}
	}
	if (!navIndex) navIndex = state.navContentList && state.navContentList.length > 0 ? state.navContentList[0].id : '';
	state.active = navIndex;
};

const scrollTo = (id) => {
	initList();
	let tag = id ?? (props.navData && props.navData.length > 0 ? props.navData[0].id : '');
	state.active = tag;

	let option = state.navContentList.find((el) => {
		return el.id == id;
	});

	const targetOffsetTop = option?.top ?? 0;
	// 获取当前 offsetTop
	let scrollTop = state.mainnNode.scrollTop;
	// 定义一次跳 50 个像素
	const STEP = 50;
	// 判断是往下滑还是往上滑
	if (scrollTop > targetOffsetTop) smoothUp();
	else smoothDown();
	// 定义往下滑函数
	function smoothDown() {
		// 如果当前 scrollTop 小于 targetOffsetTop 说明视口还没滑到指定位置
		if (scrollTop < targetOffsetTop) {
			// 如果和目标相差距离大于等于 STEP 就跳 STEP
			if (targetOffsetTop - scrollTop >= STEP) scrollTop += STEP;
			else scrollTop = targetOffsetTop;
			state.mainnNode.scrollTop = scrollTop;
			requestAnimationFrame(smoothDown);
		}
	}

	// 定义往上滑函数
	function smoothUp() {
		if (scrollTop > targetOffsetTop) {
			if (scrollTop - targetOffsetTop >= STEP) scrollTop -= STEP;
			else scrollTop = targetOffsetTop;
			state.mainnNode.scrollTop = scrollTop;
			requestAnimationFrame(smoothUp);
		}
	}
};

defineExpose({ scrollTo });
</script>

<style scoped lang="scss">
/* 导航栏的样式 */
.navs {
	position: fixed;
	top: 103px;
	// right: 5%;
	right: 60px;
	background-color: #ffffff;
	border-radius: 4px;
	min-width: 200px;
	list-style: none;
	z-index: 1999;
	border: 1px solid #efeded;
}
@media only screen and (max-width: 620px) {
	.navs {
		display: none;
	}
}

.title {
	padding: 10px 20px;
	line-height: 1.6;
	font-size: 12px;
	color: var(--el-color-primary);
	border-bottom: 2px solid var(--el-color-primary);
}

.navs li {
	padding: 10px 20px;
	line-height: 1.6;
	font-size: 12px;
	color: #909399;
	cursor: pointer;
	&:hover {
		color: #fff;
		background-color: #9ccdff;
	}
}

/* 当导航被点亮后改变颜色 */
.navs .active {
	color: #fff;
	background-color: var(--el-color-primary);
	border-left: 2px solid var(--el-color-primary);
}
</style>
