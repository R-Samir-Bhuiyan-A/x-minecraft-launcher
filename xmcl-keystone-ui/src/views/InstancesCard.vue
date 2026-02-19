<template>
  <v-card
    class="instance-card"
    :class="{ 'instance-card--selected': isSelected }"
    v-context-menu.force="getContextMenuItems"
    @click="emit('click', $event)"
  >
    <!-- Card Header: Icon + Info -->
    <div class="instance-card__header">
      <v-avatar size="48" class="instance-card__avatar" tile>
        <v-img :src="image" />
      </v-avatar>

      <div class="instance-card__info">
        <div class="instance-card__name">{{ name }}</div>
        <div v-if="description" class="instance-card__desc">
          <TextComponent
            :source="typeof instance.description === 'object' ? instance.description : { text: instance.description }"
          />
        </div>
      </div>

      <!-- Quick Actions (visible on hover) -->
      <div class="instance-card__actions">
        <v-btn icon x-small @click.stop="onSettingClick">
          <v-icon size="18">more_vert</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Badges Row -->
    <div class="instance-card__badges">
      <template v-for="version of versions">
        <div :key="version.text" class="instance-badge">
          <v-img
            width="16"
            height="16"
            class="rounded instance-badge__icon"
            :src="version.icon"
          />
          <span class="instance-badge__text">{{ version.text }}</span>
        </div>
      </template>
    </div>

    <!-- Footer: Date + Play -->
    <div class="instance-card__footer">
      <span class="instance-card__date">
        <v-icon size="14" class="mr-1" style="opacity: 0.5;">schedule</v-icon>
        {{ getDateString(instance.lastAccessDate, { dateStyle: 'medium' }) }}
      </span>
      <v-btn
        small
        depressed
        color="primary"
        class="instance-card__play"
        @click.stop="onPlay"
      >
        <v-icon left small>play_arrow</v-icon>
        Play
      </v-btn>
    </div>
  </v-card>
</template>

<script lang=ts setup>
import TextComponent from '@/components/TextComponent'
import { useContextMenu } from '@/composables/contextMenu'
import { useDateString } from '@/composables/date'
import { kInstance } from '@/composables/instance'
import { useInstanceContextMenuItems } from '@/composables/instanceContextMenu'
import { useVersionsWithIcon } from '@/composables/versionLocal'
import { BuiltinImages } from '@/constant'
import { getBanner } from '@/util/banner'
import { injection } from '@/util/inject'
import { Instance } from '@xmcl/instance'
import { useInstanceServerStatus } from '../composables/serverStatus'
import { vContextMenu } from '../directives/contextMenu'

const props = defineProps<{ instance: Instance }>()
const { path } = injection(kInstance)
const isSelected = computed(() => path.value === props.instance.path)
const { status } = useInstanceServerStatus(computed(() => props.instance))
const { getDateString } = useDateString()

const name = computed(() => props.instance.name || `Minecraft ${props.instance.runtime.minecraft}`)
const versions = useVersionsWithIcon(computed(() => props.instance.runtime))
const emit = defineEmits(['delete', 'click'])

const image = computed(() => {
  if (status.value.favicon && status.value.favicon !== BuiltinImages.unknownServer) {
    return status.value.favicon
  }
  if (props.instance.icon) {
    return props.instance.icon
  }
  const banner = getBanner(props.instance.runtime.minecraft)
  if (banner) {
    return banner
  }
  return BuiltinImages.unknownServer
})
const description = computed(() => props.instance.description)
const { open } = useContextMenu()
const getContextMenuItems = useInstanceContextMenuItems(computed(() => props.instance))

const onSettingClick = (event: MouseEvent) => {
  const button = event.target as any
  const rect = button.getBoundingClientRect()
  const items = getContextMenuItems()
  if (items) {
    open(rect.left, rect.bottom, items)
  }
}

const onPlay = () => {
  // Select instance then trigger launch via emit
  emit('click', new MouseEvent('click'))
}

</script>

<style scoped>
.instance-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 12px !important;
  padding: 16px;
  transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instance-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.10) !important;
}

.instance-card--selected {
  border-color: rgba(0, 229, 255, 0.3) !important;
  background: rgba(0, 229, 255, 0.04) !important;
  box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Header */
.instance-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.instance-card__avatar {
  border-radius: 10px !important;
  flex-shrink: 0;
  overflow: hidden;
}

.instance-card__info {
  flex: 1;
  min-width: 0;
}

.instance-card__name {
  font-weight: 600;
  font-size: 15px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.instance-card__desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.instance-card__actions {
  opacity: 0;
  transition: opacity 150ms ease;
  flex-shrink: 0;
}

.instance-card:hover .instance-card__actions {
  opacity: 1;
}

/* Badges */
.instance-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.instance-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px 3px 5px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.instance-badge__icon {
  flex-shrink: 0;
}

.instance-badge__text {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
}

/* Footer */
.instance-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.instance-card__date {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}

.instance-card__play {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
  font-size: 12px !important;
  min-width: 0 !important;
  padding: 0 14px !important;
  height: 32px !important;
}

.instance-card__play .v-icon {
  font-size: 16px !important;
}
</style>
