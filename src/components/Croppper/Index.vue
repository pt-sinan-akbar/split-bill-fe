<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import { ref } from 'vue'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps<{
  img: any
  imgWidth: number
  imgHeight: number
}>()

const cropperInstance = ref<InstanceType<typeof Cropper> | null>(null)
const imgRatio = ref<object>({
  aspectRatio: 9 / 16,
})
const imgSize = ref<object>({
  width: props.imgWidth,
  height: props.imgHeight,
  imageSmoothingEnabled: true,
  imageSmoothingQuality: 'high'
})

const crop = async (): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    try {
      if (cropperInstance.value) {
        const { canvas } = cropperInstance.value.getResult()
        if (canvas) {
          canvas.toBlob((blob: Blob | null) => {
            if (blob) resolve(blob)
            else reject(new Error('Blob is null'))
          }, props.img.type)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

defineExpose({
  crop,
})
</script>

<template>
  <cropper ref="cropperInstance" :src="img" :stencil-props="imgRatio" :canvas="imgSize"  />
</template>
