/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import supabase from '@/services/supabase'

const app = createApp(App)

registerPlugins(app)

app.provide('supabase', supabase)

app.mount('#app')
