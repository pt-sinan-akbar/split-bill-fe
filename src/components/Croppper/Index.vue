<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import BaseButton from '../elements/BaseButton.vue'
import { ref, useTemplateRef } from 'vue'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps<{
    img: any
    imgWidth: number
    imgHeight: number
}>()

const cropperInstance = ref<HTMLElement>(null)
const imgRatio = ref<object>({
    aspectRatio: 9 / 16,
})
const imgSize = ref<object>({
    width: props.imgWidth,
    height: props.imgHeight,
})

const change = ({ coordinates, canvas }) => {
    console.log(coordinates, canvas)
}

const crop = async (): Promise<Blob> => {
    return new Promise<void>((resolve, reject) => {
        try {
            const { canvas } = cropperInstance.value.getResult()
            canvas.toBlob(blob => {
                if (blob) resolve(blob)
                else reject(new Error('Blob is null'))
            }, props.img.type)
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
    <cropper
        ref="cropperInstance"
        :src="img"
        @change="change"
        :stencil-props="imgRatio"
        :canvas="imgSize"
    />
</template>
