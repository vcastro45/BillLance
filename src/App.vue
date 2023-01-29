<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" color="white">
      <nav-menu-list/>
    </v-navigation-drawer>

    <v-app-bar color="primary">
        <v-app-bar-nav-icon icon="mdi-menu" @click="drawer = !drawer"/>

      <v-toolbar-title>BillLance</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavMenuList from '@/components/NavMenuList.vue'

const drawer = ref<boolean>(true)
</script>
