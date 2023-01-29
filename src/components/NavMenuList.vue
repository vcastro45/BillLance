<template>
  <v-list nav>
    <v-list-item prepend-icon="mdi-calendar-edit"
                 active-color="primary"
                 :to="{ name: 'CRA' }">
      Activity
    </v-list-item>
    <v-list-item prepend-icon="mdi-file-multiple"
                 active-color="primary"
                 :to="{ name: 'contracts' }">
      Contracts
    </v-list-item>
    <v-list-item prepend-icon="mdi-cog"
                 active-color="primary"
                 :to="{ name: 'settings' }">
      Settings
    </v-list-item>
  </v-list>
</template>
