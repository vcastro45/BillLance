<template>
  <v-card width="100%" color="white" class="fee-card">
    <v-btn v-if="!isAddMode"
           icon="mdi-close"
           color="error"
           class="delete-btn"
           @click="emit('click:delete')"
           size="x-small"
           density="comfortable"/>
    <v-toolbar color="secondary">
      <v-toolbar-title class="ma-0 px-3">
        <v-text-field v-model="fee.label" density="compact" hide-details/>
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-text-field v-model.number="fee.ammount"
                    type="number"
                    :append-inner-icon="IconUnitMap[fee.unit]"
                    @click:appendInner="rotateUnit()"
      />
    </v-card-text>

    <v-card-actions>
      <v-btn block variant="elevated" @click="saveFee()">
        <slot name="btn">Save</slot>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import Fee, { FeeUnit } from '@/entities/fee'
import { computed, ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: Fee): void
  (e: 'click:delete', value: Fee): void
}>()
const props = defineProps<{
  modelValue?: Fee
}>()

const fee = ref<Fee>(feeFactory())

const IconUnitMap: { [key in FeeUnit]: string } = {
  '%': 'mdi-percent',
  '€': 'mdi-currency-eur'
}

const isAddMode = computed(() => !props.modelValue)

function feeFactory (): Fee {
  return {
    ammount: 0,
    unit: '%',
    label: ''
  }
}

function saveFee () {
  emit('update:modelValue', fee.value)

  if (isAddMode.value) {
    fee.value = feeFactory()
  }
}

function rotateUnit () {
  const units = Object.keys(IconUnitMap) as FeeUnit[]
  const index = units.indexOf(fee.value.unit)

  if (index < units.length - 1) {
    fee.value.unit = units[index + 1]
  } else {
    fee.value.unit = units[0]
  }
}

watch(() => props.modelValue, () => {
  fee.value = props.modelValue || feeFactory()
}, { immediate: true })
</script>

<style scoped>
.fee-card {
  position: relative;
  overflow: visible;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 2;
  opacity: 0;
  transition: opacity ease-in-out .2s;
}

.fee-card:hover .delete-btn {
  opacity: 1;
}
</style>
