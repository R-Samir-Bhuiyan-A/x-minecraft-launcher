<template>
  <nav class="sidebar-modern">
    <!-- Brand -->
    <div class="sidebar-brand moveable">
      <div class="brand-mark">XS</div>
    </div>

    <!-- Primary Nav -->
    <div class="sidebar-nav">
      <router-link
        v-shared-tooltip="() => ({ text: t('home'), direction: 'right' })"
        to="/"
        exact
        class="sidebar-btn non-moveable"
      >
        <v-icon size="22">dashboard</v-icon>
      </router-link>

      <router-link
        v-shared-tooltip="() => ({ text: t('store.name', 2), direction: 'right' })"
        to="/store"
        class="sidebar-btn non-moveable"
      >
        <v-icon size="22">storefront</v-icon>
      </router-link>

      <div class="sidebar-divider" />

      <!-- Instance shortcuts from sidebar -->
      <template v-for="inst of topInstances">
        <AppSideBarNotchItemInstance
          :key="inst"
          clickable
          :path="inst"
          direction="right"
        />
      </template>

      <div
        v-shared-tooltip="() => ({ text: t('instances.add'), direction: 'right' })"
        class="sidebar-btn non-moveable"
        @click="showAddInstance()"
      >
        <v-icon size="20">add</v-icon>
      </div>
    </div>

    <!-- Spacer -->
    <div class="sidebar-spacer" />

    <!-- Bottom Nav -->
    <div class="sidebar-nav sidebar-nav--bottom">
      <router-link
        v-shared-tooltip="() => ({ text: t('multiplayer.name'), direction: 'right' })"
        to="/multiplayer"
        class="sidebar-btn non-moveable"
      >
        <v-icon size="22">hub</v-icon>
      </router-link>

      <router-link
        v-shared-tooltip="() => ({ text: t('myStuff'), direction: 'right' })"
        to="/me"
        class="sidebar-btn non-moveable"
      >
        <v-icon size="22">person</v-icon>
      </router-link>

      <router-link
        v-shared-tooltip="() => ({ text: t('setting.name', 2), direction: 'right' })"
        to="/setting"
        class="sidebar-btn non-moveable"
      >
        <v-badge right overlap :value="hasUpdate">
          <template #badge><span>!</span></template>
          <v-icon size="22">settings</v-icon>
        </v-badge>
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useDialog } from '@/composables/dialog'
import { AddInstanceDialogKey } from '@/composables/instanceTemplates'
import { kInstances } from '@/composables/instances'
import { kSettingsState } from '@/composables/setting'
import { injection } from '@/util/inject'
import { vSharedTooltip } from '@/directives/sharedTooltip'
import AppSideBarNotchItemInstance from './AppSideBarNotchItemInstance.vue'

const { t } = useI18n()
const { instances } = injection(kInstances)
const { state } = injection(kSettingsState)
const { show: showAddInstance } = useDialog(AddInstanceDialogKey)

const hasUpdate = computed(() => state.value?.updateStatus !== 'none')

const topInstances = computed(() => {
  return [...instances.value]
    .sort((a, b) => (b.lastAccessDate ?? 0) - (a.lastAccessDate ?? 0))
    .slice(0, 5)
    .map(i => i.path)
})
</script>

<style scoped>
.sidebar-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
  min-width: 64px;
  height: 100%;
  background: #0a0c0f;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 0;
  gap: 4px;
  z-index: 20;
  -webkit-app-region: drag;
  user-select: none;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00E5FF 0%, #0091EA 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: -0.5px;
  color: #0D0F12;
}

/* Navigation groups */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 0 10px;
}

.sidebar-nav--bottom {
  margin-bottom: 4px;
}

/* Navigation button */
.sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 150ms ease, transform 120ms ease;
  text-decoration: none;
  color: inherit;
  position: relative;
  flex-shrink: 0;
}

.sidebar-btn .v-icon {
  color: rgba(255, 255, 255, 0.45);
  transition: color 150ms ease;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.sidebar-btn:hover .v-icon {
  color: rgba(255, 255, 255, 0.85);
}

.sidebar-btn:active {
  transform: scale(0.92);
}

/* Active state */
.sidebar-btn.router-link-active {
  background: rgba(0, 229, 255, 0.10);
}

.sidebar-btn.router-link-active .v-icon {
  color: #00E5FF;
  filter: drop-shadow(0 0 6px rgba(0, 229, 255, 0.4));
}

/* Divider */
.sidebar-divider {
  width: 24px;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 6px 0;
  flex-shrink: 0;
}

/* Spacer */
.sidebar-spacer {
  flex: 1;
  min-height: 8px;
}
</style>
