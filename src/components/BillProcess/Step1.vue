<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'

const video = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const img = ref<HTMLElement | null>(null)
const hasCaptured = ref<boolean>(false)

const props = defineProps<{
    width: number
    height: number
    padding: number
}>()

const constraints = ref<Object>({
    audio: false,
    video: {
        facingMode: { ideal: 'environment' }, // 'environment' means back camera
    },
})

onMounted(async () => {
    if (video.value && canvas.value) {
        ctx.value = canvas.value.getContext('2d')
        await initCamera()
    }
})

const initCamera = async () => {
    if (!video.value || !canvas.value) return
    try {
        const stream = await navigator.mediaDevices.getUserMedia(
            constraints.value,
        )
        video.value.srcObject = stream
        video.value.play()
        requestAnimationFrame(draw)
    } catch (err) {
        console.error('Camera error:', err)
    }
}

const draw = () => {
    ctx.value.drawImage(
        video.value,
        0,
        0,
        canvas.value.width,
        canvas.value.height,
    )
    requestAnimationFrame(draw)
}

const handleCapture = () => {
    console.log('test')
    const data = canvas.value.toDataURL('image/png')
    hasCaptured.value = true
    img.value.src = data
}
</script>

<template>
    <section class="flex flex-col gap-y-3 text-center">
        <BaseTitle tag="h5" msg="Scan your bill" />
        <BaseParagraph msg="it will split to everyone" />
        <video
            ref="video"
            autoplay
            playsinline
            webkit-playsinline
            muted
            hidden
        ></video>
        <canvas
            v-show="!hasCaptured"
            ref="canvas"
            :width="width"
            :height="height"
            :style="{ padding: padding + 'px', border: 'none' }"
        ></canvas>
        <div v-show="hasCaptured" :style="{ padding: padding + 'px' }">
            <img src="#" alt="image-preview" ref="img" />
        </div>
        <div>
            <BaseButton
                v-show="!hasCaptured"
                msg="Capture"
                type="button"
                @handleClick="handleCapture"
            />
            <BaseButton
                v-show="hasCaptured"
                msg="Capture Again"
                type="button"
                @click="hasCaptured = false"
            />
        </div>
        <BaseParagraph msg="or" />
        <div>
            <BaseButton type="button">
                <label for="files" class="btn">Upload from gallery</label>
                <input
                    id="files"
                    :style="{ visibility: 'hidden', display: 'none' }"
                    type="file"
                />
            </BaseButton>
        </div>
    </section>
</template>

<style>
canvas {
    border: 1px solid black;
}
</style>
