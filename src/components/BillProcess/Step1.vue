<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import CropperContainer from '../Croppper/Index.vue'
import BaseModal from '../elements/Modal/BaseModal.vue'

const video = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const img = ref<HTMLElement | null>(null)
const hasCaptured = ref<boolean>(false)
const isShowModal = ref<boolean>(false)
const imgToCrop = ref<string>(null)
const cropperRef = ref<HTMLElement>(null)
const imgClass = ref<type>('w-full h-full object-cover border-0 ')

const props = defineProps<{
    width: number
    height: number
    padding: number
}>()

const emit = defineEmits<{
    (e: 'next-step'): void
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
    const data = canvas.value.toDataURL('image/png')
    hasCaptured.value = true
    img.value.src = data
}

const handleImgChange = e => {
    const files = event.target.files
    isShowModal.value = true
    if (files && files.length > 0) {
        const file = files[0]
        imgToCrop.value = URL.createObjectURL(file)
    }
}

const handleCrop = async (): Promise<void> => {
    try {
        const imgBlob: Blob = await cropperRef.value.crop()
        img.value.src = URL.createObjectURL(imgBlob)
        isShowModal.value = false
        hasCaptured.value = true
    } catch (error) {
        console.log('Error cropping image:', error)
    }
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
        <div class="my-5">
            <div class="relative w-full pb-[177.78%]">
                <div class="absolute inset-0 rounded-lg overflow-hidden">
                    <canvas
                        v-show="!hasCaptured"
                        ref="canvas"
                        :width="width"
                        :height="height"
                        :class="imgClass"
                    >
                    </canvas>
                    <img
                        v-show="hasCaptured"
                        src="#"
                        :width="width"
                        :height="height"
                        alt="image-preview"
                        ref="img"
                        :class="imgClass"
                    />
                </div>
            </div>
        </div>
        <div>
            <BaseButton
                v-show="!hasCaptured"
                msg="Capture"
                type="button"
                @handleClick="handleCapture"
            />
            <div class="flex flex-col gap-y-3" v-show="hasCaptured">
                <BaseButton
                    msg="Capture Again"
                    type="button"
                    @click="hasCaptured = false"
                />
                <BaseParagraph msg="or" />
                <BaseButton
                    msg="Continue"
                    type="button"
                    @handleClick="emit('next-step')"
                />
            </div>
        </div>
        <div class="flex flex-col gap-y-3" v-show="!hasCaptured">
            <BaseParagraph msg="or" />
            <BaseButton type="button">
                <label for="files" class="btn">Upload from gallery</label>
                <input
                    id="files"
                    :style="{ visibility: 'hidden', display: 'none' }"
                    @change="handleImgChange($event)"
                    type="file"
                />
            </BaseButton>
        </div>
    </section>
    <BaseModal v-model:isShowModal="isShowModal">
        <template #body>
            <CropperContainer
                ref="cropperRef"
                :img="imgToCrop"
                :imgWidth="width"
                :imgHeight="height"
            />
        </template>
        <template #footer>
            <BaseButton msg="Crop" @handleClick="handleCrop" />
        </template>
    </BaseModal>
</template>
