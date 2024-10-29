<script setup lang="ts">
import { ref, onMounted } from 'vue'

const video = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const img = ref<HTMLElement | null>(null)
const hasCaptured = ref<boolean>(false)

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
    const stream = await navigator.mediaDevices.getUserMedia(constraints.value)
    video.value.srcObject = stream
    video.value.play()
    requestAnimationFrame(draw)
  } catch (err) {
    console.error('Camera error:', err)
    if (!useDefaultCamera) {
      console.log('Falling back to default camera')
      await initCamera(true)
    }
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
</script>

<template>
  <h1>Scan your bill</h1>
  <p>it will split to everyone.</p>
  <div>
    <video
      ref="video"
      autoplay
      playsinline
      webkit-playsinline
      muted
      hidden
    ></video>
    <canvas ref="canvas" width="1280" height="720"></canvas>
    <div>
      <button type="button" @click="handleCapture">Capture</button>
    </div>
    <div v-show="hasCaptured">
      <img src="#" alt="image-preview" ref="img" />
    </div>
  </div>
  <p>or</p>
  <div>
    <label for="files" class="btn">Upload from gallery</label>
    <input id="files" style="visibility: hidden" type="file" />
  </div>
</template>

<style>
canvas {
  border: 1px solid black;
}
</style>
