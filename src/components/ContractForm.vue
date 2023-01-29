<template>
  <v-card class="contract-form">
    <v-toolbar
      color="primary"
      :title="title"
    ></v-toolbar>
    <v-card-text>
      <v-form ref="form" v-if="contract">
        <v-text-field v-model="contract.label"
                      :rules="[rules.required()]"
                      label="Title"/>

        <v-text-field v-model.number="contract.TJM"
                      type="number"
                      label="TJM"/>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn color="error" @click="cancel()">Cancel</v-btn>
      <v-btn variant="elevated" @click="submit()">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import Contract from '@/entities/contract'
import { ref, watch } from 'vue'
import rules from 'rulingjs'
import { VForm } from 'vuetify/components/VForm'

interface Props {
  title?: string
  modelValue: Partial<Contract>
}

const emit = defineEmits<{
  (e: 'cancel'): void,
  (e: 'update:modelValue', value: Partial<Contract>): void
}>()
const props = withDefaults(defineProps<Props>(), {
  title: 'Create new contract',
  modelValue: () => { return {} }
})

const contract = ref<Partial<Contract>>({})
const form = ref<VForm>()

function cancel () {
  emit('cancel')
}

async function submit () {
  if (form.value) {
    if ((await form.value.validate()).valid) {
      emit('update:modelValue', contract.value)
    }
  }
}

watch(() => props.modelValue, () => {
  contract.value = props.modelValue
}, { immediate: true })
</script>
