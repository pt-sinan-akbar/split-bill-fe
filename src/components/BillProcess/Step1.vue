<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import CropperContainer from '../Croppper/Index.vue'
import BaseModal from '../elements/Modal/BaseModal.vue'

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const img = ref<HTMLImageElement | null>(null)
const hasCaptured = ref<boolean>(false)
const isShowModal = ref<boolean>(false)
const imgToCrop = ref<string | null>(null)
const cropperRef = ref<InstanceType<typeof CropperContainer> | null>(null)
const imgClass = ref<string>('w-full h-full object-cover border-0 ')

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
    ctx.value = canvas.value.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    })
    await initCamera()
  }
})

const initCamera = async () => {
  if (!video.value || !canvas.value) return
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints.value)
    video.value.srcObject = stream

    video.value.onloadedmetadata = () => {
      if (canvas.value && video.value) {
        canvas.value.width = video.value.videoWidth
        canvas.value.height = video.value.videoHeight
        video.value.play()
      }
      requestAnimationFrame(draw)
    }
  } catch (err) {
    console.error('Camera error:', err)
  }
}

const draw = () => {
  if (!ctx.value || !video.value || !canvas.value) return
  ctx.value.imageSmoothingEnabled = true
  ctx.value.imageSmoothingQuality = 'high'
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
  if (!canvas.value || !img.value) return
  const data = canvas.value.toDataURL('image/png')
  hasCaptured.value = true
  img.value.src = data
}

const handleImgChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  isShowModal.value = true
  if (files && files.length > 0) {
    const file = files[0]
    imgToCrop.value = URL.createObjectURL(file)
  }
}

const handleCrop = async (): Promise<void> => {
  try {
    if (cropperRef.value && img.value) {
      const imgBlob: Blob = await cropperRef.value.crop()
      img.value.src = URL.createObjectURL(imgBlob)
      isShowModal.value = false
      hasCaptured.value = true
    }
  } catch (error) {
    console.log('Error cropping image:', error)
  }
}
</script>

<template>
  <section
    class="flex flex-col justify-between gap-y-3 text-center w-full h-full"
  >
    <div class="flex flex-col gap-y-2">
      <BaseTitle tag="h5" msg="Scan your bill" />
      <BaseParagraph msg="it will split to everyone" />
    </div>
    <video
      ref="video"
      autoplay
      playsinline
      webkit-playsinline
      muted
      hidden
    ></video>
    <div class="my-5">
      <div class="relative w-full pb-[150%]">
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
    <div class="flex flex-col gap-y-3 text-center">
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
    </div>
  </section>
  <BaseModal v-model:isShowModal="isShowModal" v-if="video">
    <template #body>
      <CropperContainer
        ref="cropperRef"
        :img="imgToCrop"
        :imgWidth="video.videoWidth"
        :imgHeight="video.videoHeight"
      />
    </template>
    <template #footer>
      <BaseButton msg="Crop" @handleClick="handleCrop" />
    </template>
  </BaseModal>
</template>
