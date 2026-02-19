<template>
  <nav class="sidebar-modern" role="navigation" aria-label="Main navigation">
    <!-- Brand -->
    <div class="sidebar-brand moveable">
      <div class="brand-mark" aria-hidden="true">XS</div>
    </div>

    <!-- Primary Nav -->
    <div class="sidebar-nav">
      <router-link
        v-shared-tooltip="() => ({ text: t('home') + ' (Ctrl+1)', direction: 'right' })"
        to="/"
        exact
        class="sidebar-btn non-moveable"
        aria-label="Home"
      >
        <v-icon size="20">dashboard</v-icon>
        <span class="sidebar-label">{{ t('home') }}</span>
      </router-link>

      <router-link
        v-shared-tooltip="() => ({ text: t('store.name', 2) + ' (Ctrl+2)', direction: 'right' })"
        to="/store"
        class="sidebar-btn non-moveable"
        aria-label="Store"
      >
        <v-icon size="20">storefront</v-icon>
        <span class="sidebar-label">{{ t('store.name', 2) }}</span>
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
        role="button"
        tabindex="0"
        :aria-label="t('instances.add')"
        @click="showAddInstance()"
        @keydown.enter="showAddInstance()"
        @keydown.space.prevent="showAddInstance()"
      >
        <v-icon size="18">add</v-icon>
        <span class="sidebar-label">{{ t('instances.add') }}</span>
      </div>
    </div>

    <!-- Spacer -->
    <div class="sidebar-spacer" />

    <!-- Bottom Nav -->
    <div class="sidebar-nav sidebar-nav--bottom">
      <router-link
        v-shared-tooltip="() => ({ text: t('multiplayer.name') + ' (Ctrl+3)', direction: 'right' })"
        to="/multiplayer"
        class="sidebar-btn non-moveable"
        aria-label="Multiplayer"
      >
        <v-icon size="20">hub</v-icon>
        <span class="sidebar-label">{{ t('multiplayer.name') }}</span>
      </router-link>

      <router-link
        v-shared-tooltip="() => ({ text: t('myStuff') + ' (Ctrl+4)', direction: 'right' })"
        to="/me"
        class="sidebar-btn non-moveable"
        aria-label="Account"
      >
        <v-icon size="20">person</v-icon>
        <span class="sidebar-label">{{ t('myStuff') }}</span>
      </router-link>

      <router-link
        v-shared-tooltip="() => ({ text: t('setting.name', 2) + ' (Ctrl+5)', direction: 'right' })"
        to="/setting"
        class="sidebar-btn non-moveable"
        aria-label="Settings"
      >
        <v-badge right overlap :value="hasUpdate">
          <template #badge><span>!</span></template>
          <v-icon size="20">settings</v-icon>
        </v-badge>
        <span class="sidebar-label">{{ t('setting.name', 2) }}</span>
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
  width: 72px;
  min-width: 72px;
  height: 100%;
  background: #0a0c0f;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 0;
  gap: 2px;
  z-index: 20;
  -webkit-app-region: drag;
  user-select: none;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
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
  gap: 2px;
  width: 100%;
  padding: 0 8px;
}

.sidebar-nav--bottom {
  margin-bottom: 4px;
}

/* Navigation button */
.sidebar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  min-height: 48px;
  padding: 6px 0 4px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 150ms ease, transform 120ms ease;
  text-decoration: none;
  color: inherit;
  position: relative;
  flex-shrink: 0;
  gap: 2px;
}

.sidebar-btn .v-icon {
  color: rgba(255, 255, 255, 0.40);
  transition: color 150ms ease;
}

/* Tiny label under icon */
.sidebar-label {
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  color: rgba(255, 255, 255, 0.30);
  transition: color 150ms ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 52px;
  text-align: center;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.sidebar-btn:hover .v-icon {
  color: rgba(255, 255, 255, 0.85);
}

.sidebar-btn:hover .sidebar-label {
  color: rgba(255, 255, 255, 0.60);
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

.sidebar-btn.router-link-active .sidebar-label {
  color: rgba(0, 229, 255, 0.75);
}

/* Focus ring for keyboard navigation */
.sidebar-btn:focus-visible {
  outline: 2px solid #00E5FF !important;
  outline-offset: -2px;
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
