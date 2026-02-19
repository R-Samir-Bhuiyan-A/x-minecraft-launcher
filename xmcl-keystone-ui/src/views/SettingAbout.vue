<template>
  <section class="about">
    <SettingCard>
      <div>
        <v-card-title class="w-full flex mr-2 title">
          <v-img :src="xs" alt="XS Launcher Logo" max-width="64" class="mr-4"></v-img>
          <div>
            <div class="text-h5" v-shared-tooltip="_ => 'XS Launcher'">XS Launcher</div>
            <div class="text-subtitle-2 pt-1">
              Developed by eksses
            </div>
          </div>
          <v-spacer />
          <div>
            <div class="flex items-center justify-center flex-grow-0 gap-2">
              <v-icon color="primary">verified</v-icon>
              <div class="text-caption">{{ t('setting.aboutLicense') }}</div>
            </div>
          </div>
        </v-card-title>

        <v-textarea filled readonly class="px-4" :value="debugInfo" />
      </div>

      <div class="select-none text-lg my-6 text-center flex justify-center">
        XS Launcher
      </div>
      <div class="flex flex-col items-center gap-3 py-4">
         <div class="text-caption">Built with love by eksses</div>
      </div>
    </SettingCard>
  </section>
</template>

<script lang="ts" setup>
import SettingCard from '@/components/SettingCard.vue'
import { kEnvironment } from '@/composables/environment'
import { kFlights } from '@/composables/flights'
import { vSharedTooltip } from '@/directives/sharedTooltip'
import { injection } from '@/util/inject'
import xs from '../assets/xs.png'

const env = injection(kEnvironment)
const flights = injection(kFlights)

const debugInfo = computed(() => {
  return JSON.stringify({ ...env.value, flights }, null, 2)
})

const { t } = useI18n()
const version = computed(() => env.value?.version ?? '')

</script>
<style scoped>

</style>
