<template>
	<el-card class="music-card" v-drag="{ initX: '1rem', initY: '80vh' }">
		<div class="music-card-content">
			<div class="del-icon" @click="cardClose" v-show="isCard">×</div>
			<div class="left" @click="cardShow">
				<el-image :class="{ paused: !state.isStop }" class="left-img" :src="songs[state.currentSongIndex].preview"></el-image>
			</div>
			<div class="right" v-show="isCard">
				<div class="right-title">
					{{ songs[state.currentSongIndex].name }}
				</div>
				<div class="right-silde">
					<div class="right-silde-start">
						{{ secondsToMinutes(state.currentSongTime) }}
					</div>
					<el-slider v-model="state.currentSongTime" :show-tooltip="false" :max="state.timeMax" size="small" @change="timeHandler" />
					<div class="right-silde-end">
						{{ secondsToMinutes(state.timeMax) }}
					</div>
				</div>
				<div class="btn-list">
					<div @click="rewindSong" class="btn-item">⏪</div>
					<div @click="play" class="btn-item" v-show="state.isStop">▶️</div>
					<div @click="pause" class="btn-item" v-show="!state.isStop">⏸️</div>
					<div @click="nextSong" class="btn-item">⏩</div>
				</div>
			</div>
			<audio ref="audioTag" @loadedmetadata="getDuration" @timeupdate="getCurrentTime" @ended="nextSong"></audio>
		</div>
	</el-card>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
const vDrag = {
	// 在绑定元素的父组件
	// 及他自己的所有子节点都挂载完成后调用
	mounted(el) {
		const moveDOm = el.getElementsByClassName('left-img')[0];
		// 确保元素只能在视口内拖拽
		let maxLeft = document.documentElement.clientWidth - el.clientWidth;
		let maxTop = document.documentElement.clientHeight - el.clientHeight;
		// 鼠标事件
		moveDOm.onmousedown = function (e) {
			// 添加样式
			el.classList.add('dragging');
			// 鼠标按下，计算当前元素距离可视区的距离
			let offsetX = e.clientX - el.offsetLeft;
			let offsetY = e.clientY - el.offsetTop;
			document.onmousemove = function (e) {
				// 计算移动的距离
				let moveX = e.clientX - offsetX;
				let moveY = e.clientY - offsetY;
				// 限制边界
				moveX = Math.max(Math.min(moveX, maxLeft), 0);
				moveY = Math.max(Math.min(moveY, maxTop), 0);
				// 移动当前元素
				el.style.left = moveX + 'px';
				el.style.top = moveY + 'px';
			};

			document.onmouseup = function (e) {
				el.classList.remove('dragging');
				document.onmousemove = null;
				document.onmouseup = null;
			};
			// 防止粘粘
			return false;
		};
		// 移动端
		moveDOm.ontouchstart = function (event) {
			const { pageX, pageY } = event.touches[0];
			let offsetX = pageX - el.offsetLeft;
			let offsetY = pageY - el.offsetTop;
			document.ontouchmove = function (e) {
				// 移动距离
				let left = e.touches[0].pageX - offsetX;
				let top = e.touches[0].pageY - offsetY;
				// 限制范围
				left = Math.max(Math.min(left, maxLeft), 0);
				top = Math.max(Math.min(top, maxTop), 0);
				el.style.left = left + 'px';
				el.style.top = top + 'px';
			};
		};

		el.ontouchend = function () {
			document.ontouchmove = null;
		};
	},
};

const songs = ref([
	{
		key: 'haqs',
		name: '黑暗骑士-五月天',
		url: '',
		preview: '',
	},
	{
		key: 'fqxdsws',
		name: '父亲写的散文诗-刘乐瑶',
		url: '',
		preview: '',
	},
]);

// 播放器DOM
const audioTag = ref(null);
const isCard = ref(true);

const state = reactive({
	// 当前歌曲
	currentSongIndex: 0,
	// 当前时间
	currentSongTime: 0,
	// 总时长
	timeMax: 0,
	isStop: true,
});

const getDuration = () => {
	state.timeMax = audioTag.value?.duration ?? 0;
};

const getCurrentTime = () => {
	state.currentSongTime = audioTag.value?.currentTime ?? 0;
};

const timeHandler = (e) => {
	if (audioTag.value) audioTag.value.currentTime = e;
};

const play = () => {
	state.isStop = false;
	if (audioTag.value) audioTag.value.play();
};

const pause = () => {
	state.isStop = true;
	if (audioTag.value) audioTag.value.pause();
};

const rewindSong = () => {
	state.currentSongIndex = (state.currentSongIndex - 1) % songs.value.length;
	if (state.currentSongIndex < 0) state.currentSongIndex = 0;
	playCurrentTrack();
};

const nextSong = () => {
	state.currentSongIndex = (state.currentSongIndex + 1) % songs.value.length;
	playCurrentTrack();
};

const playCurrentTrack = () => {
	if (audioTag.value) {
		state.isStop = false;
		audioTag.value.pause(); // 暂停当前音频
		audioTag.value.currentTime = 0; // 重置当前音频的播放时间
		// 设置新的音频源并播放
		audioTag.value.src = songs.value[state.currentSongIndex].url;
		audioTag.value.play();
	}
};

// 歌长格式化
const secondsToMinutes = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	// 使用padStart函数来确保秒数和分钟数都是两位数
	const formattedMinutes = String(minutes).padStart(2, '0');
	const formattedSeconds = String(remainingSeconds).padStart(2, '0');
	return `${formattedMinutes}:${formattedSeconds}`;
};

const cardClose = () => {
	isCard.value = false;
};

const cardShow = () => {
	if (!isCard.value) isCard.value = true;
};

const init = async () => {
	for (let i = 0; i < songs.value.length; i++) {
		let el = songs.value[i];
		let mp3 = await import(`../../assets/audio/${el.key}.mp3`);
		el.url = mp3.default;
		let preview = await import(`../../assets/image/${el.key}.jpg`);
		el.preview = preview.default;
	}
	audioTag.value.src = songs.value[state.currentSongIndex].url;
};

onMounted(() => {
	init();
});
</script>

<style scoped lang="scss">
.music-card {
	position: fixed;
	top: 80%;
	left: 1rem;
	display: inline-block;
	// 防止选中
	user-select: none;
	-webkit-user-select: none; /* Safari */
	.music-card-content {
		position: relative;
		display: flex;
		.del-icon {
			position: absolute;
			right: -10px;
			top: -18px;
			cursor: pointer;
			font-weight: 600;
			&:hover {
				color: #409eff;
			}
		}
		.left {
			width: 90px;
			cursor: pointer;
			.left-img {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				// 防止选中
				user-select: none;
				-webkit-user-select: none; /* Safari */
			}
		}
		.right {
			width: 150px;
			display: flex;
			flex-flow: column;
			justify-content: space-evenly;
			:deep(.el-slider__button-wrapper) {
				display: none;
			}

			.right-title {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 100%;
				display: flex;
				justify-content: center;
			}

			.right-silde {
				display: flex;
				align-items: center;
				.right-silde-start {
					margin: 10px 5px;
				}
				.right-silde-end {
					margin: 10px 5px;
				}
			}
			.btn-list {
				display: flex;
				justify-content: center;
				font-size: 22px;
				margin-left: 5px;
				.btn-item {
					cursor: pointer;
					margin-right: 10px;
				}
			}
		}

		/* 定义唱片旋转动画 */
		@keyframes rotate {
			0% {
				transform: rotate(0deg);
			}

			100% {
				transform: rotate(360deg);
			}

			/* 旋转一周 */
		}
	}
}

.paused {
	animation: rotate 4s infinite linear;
}

.dragging {
	opacity: 0.5; /* 降低拖拽中元素的透明度 */
	cursor: grabbing; /* 改变鼠标指针为抓取手型 */
	/* 添加其他样式以突出显示拖拽中的元素 */
}
</style>
