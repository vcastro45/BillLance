<template>
  <v-container class="CRA">
    <v-row align="center">
      <v-col cols="auto">
        <month-picker v-model="period"/>
      </v-col>
      <v-spacer/>
      <v-col cols="auto">
        <v-autocomplete
          v-model="selectedContracts"
          hide-details
          :items="contracts"
          item-title="label"
          return-object
          multiple
          chips
          style="width: 300px;"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="short-cell"></th>
              <th class="short-cell">Day Off</th>
              <th v-for="contract of selectedContracts">
                {{ contract.label }}
              </th>
              <th v-if="!selectedContracts.length"></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="date of nbDaysInMonth"
                :class="{ 'bg-grey-lighten-3': weekends.includes(date) }">
              <td>{{ date }}</td>
              <td class="bg-grey-lighten-3">
                <input type="number"
                       min="0"
                       step="0.5"
                       :value="contractDayCRAMap.off && contractDayCRAMap.off[date] ? contractDayCRAMap.off[date].duration : undefined"
                       @input="upsertContract($event, date, 'off')"
                />
              </td>
              <td v-for="contract of selectedContracts">
                <input type="number"
                       min="0"
                       step="0.5"
                       :value="contractDayCRAMap[contract.id] && contractDayCRAMap[contract.id][date] ? contractDayCRAMap[contract.id][date].duration : undefined"
                       @input="upsertContract($event, date, contract)"
                />
              </td>
              <td v-if="!selectedContracts.length"></td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <th>Total</th>
              <td v-for="contract of selectedContracts">
              </td>
              <td v-if="!selectedContracts.length"></td>
            </tr>
          </tfoot>
        </v-table>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer/>
      <v-col cols="auto">
        <v-chip>{{ nbWorkedDays }} / {{ nbWeekdays }}</v-chip>
      </v-col>
    </v-row>

    <v-row justify="end">
      <v-col cols="auto">
        <v-btn @click="saveCurrentCRA()" :loading="loading">Save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import { SelectResponse } from '@/entities'
import Contract from '@/entities/contract'
import { SupabaseClient } from '@supabase/supabase-js'
import CRARow from '@/entities/CRARow'
import MonthPicker from '@/components/MonthPicker.vue'

const supabase = inject('supabase') as SupabaseClient

const now = new Date()
const period = ref({
  month: now.getMonth() + 1,
  year: now.getFullYear()
})
const loading = ref<boolean>(false)
const contracts = ref<Contract[]>([])
const selectedContracts = ref<Contract[]>([])
const currentCRA = ref<CRARow[]>([])

const nbDaysInMonth = computed<number>(() => {
  return new Date(period.value.year, period.value.month, 0).getDate()
})

const weekends = computed<number[]>(() => {
  const we: number[] = []

  const date = new Date()
  date.setFullYear(period.value.year)
  date.setMonth(period.value.month - 1)
  for (let day = 1; day <= nbDaysInMonth.value; day++) {
    date.setDate(day)
    if ([0, 6].includes(date.getDay())) {
      we.push(day)
    }
  }
  return we
})

const nbWeekdays = computed<number>(() => nbDaysInMonth.value - weekends.value.length)

type DayCRAMap = { [day: number]: CRARow }
type ContractDayCRAMapType = { [contractId: number]: DayCRAMap, off?: DayCRAMap }
const contractDayCRAMap = computed<ContractDayCRAMapType>(() => {
  const map: ContractDayCRAMapType = currentCRA.value.reduce((acc: ContractDayCRAMapType, row: CRARow) => {
    if (row.contractId) {
      if (!acc[row.contractId]) {
        acc[row.contractId] = {}
      }
      acc[row.contractId][row.day] = row
    } else if (row.offDay) {
      if (!acc.off) {
        acc.off = {}
      }
      acc.off[row.day] = row
    }
    return acc
  }, {})
  return map
})

const nbWorkedDays = computed(() => {
  return currentCRA.value.reduce((acc, row) => {
    return acc + row.duration
  }, 0)
})

async function refreshContracts () {
  loading.value = true
  const { data, error }: SelectResponse<Contract> = await supabase
    .from('contracts')
    .select('*')
    .order('id', { ascending: false })

  if (data && !error) {
    contracts.value = data
  }
  loading.value = false
}

function upsertContract (event: Event, day: number, contract: Contract | 'off') {
  const duration = parseFloat((event.target as any)?.value || 0)

  const existingRow = currentCRA.value.find(row => {
    if (row.day === day) {
      if (contract === 'off' && row.offDay) {
        return true
      } else if (contract !== 'off' && contract.id === row.contractId) {
        return true
      }
    }
    return false
  })

  if (!existingRow) {
    const newRow: CRARow = {
      year: period.value.year,
      month: period.value.month,
      day,
      duration,
      offDay: contract === 'off',
      contractId: contract !== 'off' ? contract.id : undefined
    }
    currentCRA.value.push(newRow)
  } else {
    existingRow.duration = duration
  }
}

async function saveCurrentCRA () {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('cra')
      .upsert(currentCRA.value.filter(row => !!row.id))

    const { data: data2, error: error2 } = await supabase
      .from('cra')
      .insert(currentCRA.value.filter(row => !row.id))
  } finally {
    loading.value = false
  }
}

watch(() => [period.value.year, period.value.month, contracts.value], async () => {
  if (period.value.year >= 2000 && period.value.year <= 2100
  && period.value.month >= 1 && period.value.month <= 12) {
    const { data: cra, error }: SelectResponse<CRARow> = await supabase
      .from('cra')
      .select('*')
      .eq('year', period.value.year)
      .eq('month', period.value.month)

    if (cra && !error) {
      currentCRA.value = cra
      selectedContracts.value = [...new Set(currentCRA.value.map(row => {
        return contracts.value.find(contract => contract.id === row.contractId)
      }))].filter(contract => !!contract) as Contract[]
    }
  }
}, { immediate: true })

onMounted(async () => {
  await refreshContracts()
})
</script>

<style scoped>
.short-cell {
  width: 100px;
}

table input[type="number"] {
  outline: none;
}
</style>
