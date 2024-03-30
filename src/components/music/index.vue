<template>
    <el-card class="music-card">
        <div class="music-card-content">
            <div class="del-icon" @click="cardClose" v-show="isCard">×</div>
            <div class="left" @click="cardShow">
                <el-image :class="{ paused: !state.isStop }" class="left-img"
                    :src="songs[state.currentSongIndex].preview"></el-image>
            </div>
            <div class="right" v-show="isCard">
                <div class="right-title">
                    {{ songs[state.currentSongIndex].name }}
                </div>
                <div class="right-silde">
                    <div class="right-silde-start">
                        {{ secondsToMinutes(state.currentSongTime) }}
                    </div>
                    <el-slider v-model="state.currentSongTime" :show-tooltip="false" :max="state.timeMax" size="small"
                        @change="timeHandler" />
                    <div class="right-silde-end">
                        {{ secondsToMinutes(state.timeMax) }}
                    </div>
                </div>
                <div class="btn-list">
                    <div @click="rewindSong" class="btn-item">⏪</div>
                    <div @click="play" class="btn-item" v-show="state.isStop">
                        ▶️
                    </div>
                    <div @click="pause" class="btn-item" v-show="!state.isStop">⏸️</div>
                    <div @click="nextSong" class="btn-item">⏩</div>
                </div>
            </div>
            <audio ref="audioTag" @loadedmetadata="getDuration" @timeupdate="getCurrentTime" @ended="nextSong"></audio>
        </div>
    </el-card>
</template>
<script setup>
import { reactive, ref, onMounted, } from "vue";

const songs = ref([{
    key: "haqs",
    name: '黑暗骑士-五月天',
    url: '',
    preview: '',
},
{
    key: "fqxdsws",
    name: '父亲写的散文诗-刘乐瑶',
    url: '',
    preview: '',
}
])

// 播放器DOM
const audioTag = ref(null);
const isCard = ref(true)

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
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
};

const cardClose = () => {
    isCard.value = false
}

const cardShow = () => {
    if (!isCard.value) isCard.value = true
}

const init = async () => {
    for (let i = 0; i < songs.value.length; i++) {
        let el = songs.value[i];
        let mp3 = await import(`../../assets/audio/${el.key}.mp3`)
        el.url = mp3.default
        let preview = await import(`../../assets/image/${el.key}.jpg`)
        el.preview = preview.default
    }
    audioTag.value.src = songs.value[state.currentSongIndex].url;
}


onMounted(() => {
    init()
});
</script>

<style scoped lang="scss">
.music-card {
    position: fixed;
    bottom: 1rem;
    display: inline-block;
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
                color: #409EFF;
            }
        }
        .left {
            width: 90px;
            cursor: pointer;
            .left-img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
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
                    margin:10px 5px;
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
</style>