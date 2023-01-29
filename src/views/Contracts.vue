<template>
  <v-container class="contracts">
    <v-row>
      <v-col>
        <v-data-table
          items-per-page="10"
          :headers="headers"
          :items="contracts"
          return-object
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Contracts</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer/>
              <v-btn @click="createDialog = true">New Contract</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              size="small"
              class="me-2"
              color="primary"
              @click="toEdit = item.raw; editDialog = true;"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              color="primary"
              @click="toDelete = item.raw; deleteDialog = true"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="createDialog"
              @update:modelValue="toCreate = $event ? {} : null"
              max-width="500px"
    >
      <contract-form :model-value="toCreate"
                     @update:model-value="createContract($event)"
                     @cancel="createDialog = false; toCreate = {}"/>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="500px">
      <contract-form v-model="toEdit"
                     :title="`Edit contract: ${toEdit?.label}`"
                     @update:model-value="editContract($event)"
                     @cancel="editDialog = false"/>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-toolbar
          color="error"
          :title="`Delete contract: ${toDelete?.label}`"
        ></v-toolbar>
        <v-card-text>
          Are you sure ?
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteContract(toDelete)">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { SupabaseClient } from '@supabase/supabase-js'
import Contract from '@/entities/contract'
import { SelectResponse } from '@/entities'
import ContractForm from '@/components/ContractForm.vue'

const supabase = inject('supabase') as SupabaseClient

const loading = ref<boolean>(false)
const contracts = ref<Contract[]>([])
const headers = ref([
  { title: 'Title', key: 'label' },
  { title: 'TJM', key: 'TJM' },
  { title: 'Actions', key: 'actions', sortable: false }
])
const createDialog = ref<boolean>(false)
const editDialog = ref<boolean>(false)
const deleteDialog = ref<boolean>(false)
const toCreate = ref<Partial<Contract>>({})
const toEdit = ref<Contract | null>(null)
const toDelete = ref<Contract | null>(null)

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

async function createContract (contract: Contract) {
  const { error } = await supabase
    .from('contracts')
    .insert([contract])

  toCreate.value = {}
  createDialog.value = false

  if (!error) {
    await refreshContracts()
  }
}

async function editContract (contract: Contract) {
  await supabase
    .from('contracts')
    .update(contract)
    .eq('id', contract.id)

  toEdit.value = null
  editDialog.value = false
}

async function deleteContract (contract: Contract) {
  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', contract.id)

  if (!error) {
    const index = contracts.value.indexOf(contract)
    if (index !== -1) {
      contracts.value.splice(index, 1)
    }
  }

  toDelete.value = null
  deleteDialog.value = false
}

onMounted(async () => {
  await refreshContracts()
})
</script>
