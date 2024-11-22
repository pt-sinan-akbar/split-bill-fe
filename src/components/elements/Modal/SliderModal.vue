<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    showModal: boolean
  }>(),
  {
    showModal: false,
  },
)

const panel = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const header = ref<HTMLElement | null>(null)
const body = ref<HTMLElement | null>(null)
const footer = ref<HTMLElement | null>(null)
const modalContainer = ref<HTMLElement | null>(null)

let isDragging = false
let startY
let startHeight

const MIN_HEIGHT = 20
const MAX_HEIGHT = 95

onMounted(() => {
  const headerHeight = header.value.offsetHeight
  const bodyHeight = body.value.offsetHeight
  const footerHeight = footer.value.offsetHeight
  const wrapperHeight = headerHeight + bodyHeight + footerHeight
  panel.value.style.height = `${wrapperHeight * 2 + 60}px`
})

watch(
  () => props.showModal,
  newVal => {
    console.log('showModal', newVal)
    if (newVal) {
      panel.value?.classList.add('open')
      modalContainer.value.classList.add('open')
    } else {
      panel.value?.classList.remove('open')
      modalContainer.value?.classList.remove('open')
    }
  },
  { immediate: true },
)

const startDragging = e => {
  isDragging = true
  startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY
  startHeight = parseInt(getComputedStyle(panel.value).height)

  if (e.type === 'mousedown') {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDragging)
  } else {
    document.addEventListener('touchmove', onDrag)
    document.addEventListener('touchend', stopDragging)
  }
}

const onDrag = e => {
  if (!isDragging) return

  e.preventDefault()
  const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
  const deltaY = currentY - startY

  const newHeight = Math.max(
    Math.min(((startHeight - deltaY) / window.innerHeight) * 100, MAX_HEIGHT),
    MIN_HEIGHT,
  )

  panel.value.style.height = `${newHeight}vh`
  panel.value.style.transition = 'none'
}

const stopDragging = () => {
  isDragging = false
  panel.value.style.transition = ''

  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDragging)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDragging)
}
</script>

<style scoped>
.modal-container {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  z-index: 5;
  bottom: -100%;
}

.panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -100vh;
  max-height: 80vh !important;
  background: white;
  border-radius: 16px 16px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.panel.open {
  bottom: 0;
  transform: translateY(0);
}

.modal-container.open {
  bottom: 0;
  transform: translateY(0);
}

.panel-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  cursor: ns-resize;
  padding: 10px;
  touch-action: none;
  user-select: none;
}

.modal-wrapper {
  height: auto;
  padding: 30px;
}

.panel-handle {
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 0 auto;
}

.modal-header,
.panel-content,
.panel-footer {
  width: inherit;
  height: auto;
  overflow-y: hidden;
}
</style>

<template>
  <div class="modal-container" ref="modalContainer"></div>
  <div ref="panel" class="panel">
    <div
      ref="header"
      class="panel-header"
      @mousedown="startDragging"
      @touchstart="startDragging"
    >
      <div class="panel-handle"></div>
    </div>
    <div
      ref="wrapper"
      class="flex flex-col justify-center items-center gap-y-5 modal-wrapper container"
    >
      <div class="modal-header" ref="header">
        <slot name="header"></slot>
      </div>
      <div class="panel-content" ref="body">
        <slot name="body"></slot>
      </div>
      <div class="panel-footer" ref="footer">
        <slot name="fotoer"></slot>
      </div>
    </div>
  </div>
</template>
