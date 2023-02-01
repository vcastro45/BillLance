<template>
  <v-container class="reports">
    <v-row align="center">
      <v-col cols="auto">
        <month-picker v-model="period"/>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="elevated"
               :disabled="!isValidPeriod"
               @click="generateReport()">
          Generate
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { SupabaseClient } from '@supabase/supabase-js'
import Contract from '@/entities/contract'
import { SelectResponse } from '@/entities'
import ContractForm from '@/components/ContractForm.vue'
import MonthPicker from '@/components/MonthPicker.vue'

const supabase = inject('supabase') as SupabaseClient

const now = new Date()
const period = ref({
  month: now.getMonth() + 1,
  year: now.getFullYear()
})

const isValidPeriod = computed<boolean>(() => period.value.month >= 1 && period.value.month <= 12 && period.value.year >= 2000 && period.value.year <= 2100)

async function generateReport () {}
</script>
