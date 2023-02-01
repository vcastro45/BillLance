<template>
  <v-row>
    <v-col cols="auto">
      <v-select v-model="period.month"
                hide-details
                :items="months"
                label="Month"/>
    </v-col>
    <v-col cols="auto">
      <v-text-field v-model.number="period.year"
                    hide-details
                    type="number"
                    label="Year"/>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface Period {
  month: MonthNumber
  year: number
}

interface Props {
  modelValue: Period
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: Period): void
}>()
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => {
    const now = new Date()
    return {
      month: (now.getMonth() + 1) as MonthNumber,
      year: now.getFullYear()
    }
  }
})

const period = ref<Period>(props.modelValue)

const months = [
  { value: 1, title: 'January' },
  { value: 2, title: 'February' },
  { value: 3, title: 'March' },
  { value: 4, title: 'April' },
  { value: 5, title: 'May' },
  { value: 6, title: 'June' },
  { value: 7, title: 'July' },
  { value: 8, title: 'August' },
  { value: 9, title: 'September' },
  { value: 10, title: 'October' },
  { value: 11, title: 'November' },
  { value: 12, title: 'December' }
]

watch(() => props.modelValue, () => {
  period.value = props.modelValue
}, { immediate: true })

watch(() => [period.value.year, period.value.month], async () => {
  if (period.value.year >= 2000 && period.value.year <= 2100
    && period.value.month >= 1 && period.value.month <= 12) {
    emit('update:modelValue', period.value)
  }
}, { immediate: true })

</script>
