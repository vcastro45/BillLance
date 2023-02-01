<template>
  <v-container class="settings">
    <v-progress-linear indeterminate color="primary" v-if="loading"/>
    <v-row class="mt-2">
      <v-col cols="12">
        <h2 class="text-h4">Fees</h2>
      </v-col>
      <v-col cols="3" md="4" lg="3" v-for="(fee, i) of fees">
        <fee-card v-model="fees[i]"
                  @update:model-value="updateFee($event)"
                  @click:delete="askDelete(fee)"/>
      </v-col>

      <v-col cols="3" md="4" lg="3">
        <fee-card @update:model-value="addFee($event)">
          <template #btn>Add</template>
        </fee-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="350px">
      <v-card v-if="toDelete">
        <v-toolbar color="error">
          <v-toolbar-title>Delete fee "{{ toDelete.label }}" ?</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          Are you sure ?
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="deleteDialog = false">No</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteFee(toDelete)">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Fee from '@/entities/fee'
import { SupabaseClient } from '@supabase/supabase-js'
import FeeCard from '@/components/FeeCard.vue'

const supabase = inject('supabase') as SupabaseClient

const loading = ref<boolean>(false)
const fees = ref<Fee[]>([])
const toDelete = ref<Fee | null>(null)
const deleteDialog = ref<boolean>(false)

function askDelete (fee: Fee) {
  toDelete.value = fee
  deleteDialog.value = true
}

async function deleteFee (fee: Fee) {
  try {
    loading.value = true
    const { error } = await supabase
      .from('fees')
      .delete()
      .eq('id', fee.id)

    if (!error) {
      const index = fees.value.indexOf(fee)
      if (index !== -1) {
        fees.value.splice(index, 1)
      }
    }
  } finally {
    loading.value = false
    toDelete.value = null
    deleteDialog.value = false
  }
}

async function updateFee (fee: Fee) {
  try {
    loading.value = true
    await supabase
      .from('fees')
      .update(fee)
      .eq('id', fee.id)
  } finally {
    loading.value = false
  }
}

async function addFee (fee: Fee) {
  try {
    loading.value = true
    await supabase
      .from('fees')
      .insert(fee)
    await fetchFees()
  } finally {
    loading.value = false
  }
}

async function fetchFees () {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('fees')
      .select('*')

    if (!error) {
      fees.value = data
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchFees()
})
</script>
