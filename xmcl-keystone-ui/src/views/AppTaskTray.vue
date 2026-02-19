<template>
  <transition name="slide-y-reverse-transition">
    <div v-if="activeTasks.length > 0" class="task-tray" @click="showTaskDialog">
      <!-- Progress bar (slim, full width at top of tray) -->
      <div class="task-tray__progress-track">
        <div
          class="task-tray__progress-fill"
          :style="{ width: progressPercent + '%' }"
        />
      </div>

      <!-- Content -->
      <div class="task-tray__content">
        <v-icon size="16" class="task-tray__icon">downloading</v-icon>

        <div class="task-tray__info">
          <span class="task-tray__title">{{ currentTitle }}</span>
          <span v-if="currentSubtitle" class="task-tray__subtitle">{{ currentSubtitle }}</span>
        </div>

        <div class="task-tray__meta">
          <span class="task-tray__count">
            {{ activeTasks.length }} {{ activeTasks.length === 1 ? 'task' : 'tasks' }}
          </span>
          <span v-if="progressPercent >= 0" class="task-tray__percent">
            {{ Math.round(progressPercent) }}%
          </span>
        </div>

        <v-btn icon x-small class="task-tray__expand" @click.stop="showTaskDialog">
          <v-icon size="16">expand_less</v-icon>
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { kTaskManager } from '@/composables/taskManager'
import { useLocalizedTaskFunc } from '@/composables/task'
import { useDialog } from '@/composables/dialog'
import { injection } from '@/util/inject'
import { TaskState } from '@xmcl/runtime-api'

const { tasks } = injection(kTaskManager)
const localizeTask = useLocalizedTaskFunc()
const { show: showTaskDialog } = useDialog('task')

const activeTasks = computed(() =>
  tasks.value.filter(t => t.state === TaskState.Running)
)

const currentTask = computed(() => activeTasks.value[0])

const currentTitle = computed(() => {
  if (!currentTask.value) return ''
  return localizeTask(currentTask.value).title
})

const currentSubtitle = computed(() => {
  if (!currentTask.value) return ''
  return localizeTask(currentTask.value).subtitle
})

const progressPercent = computed(() => {
  if (!currentTask.value?.progress) return -1
  const { progress, total } = currentTask.value.progress
  if (total <= 0) return -1
  return Math.min(100, (progress / total) * 100)
})
</script>

<style scoped>
.task-tray {
  position: relative;
  width: 100%;
  background: #0a0c0f;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: background 150ms ease;
  z-index: 30;
  flex-shrink: 0;
}

.task-tray:hover {
  background: rgba(255, 255, 255, 0.03);
}

/* Slim progress bar at top */
.task-tray__progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.04);
}

.task-tray__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00E5FF, #00B8D4);
  transition: width 300ms ease;
  border-radius: 0 1px 1px 0;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
}

/* Content row */
.task-tray__content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  min-height: 32px;
}

.task-tray__icon {
  color: #00E5FF;
  flex-shrink: 0;
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.task-tray__info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.task-tray__title {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-tray__subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-tray__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.task-tray__count {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
}

.task-tray__percent {
  font-size: 11px;
  font-weight: 600;
  color: #00E5FF;
  font-variant-numeric: tabular-nums;
  min-width: 32px;
  text-align: right;
}

.task-tray__expand {
  flex-shrink: 0;
}

.task-tray__expand .v-icon {
  color: rgba(255, 255, 255, 0.35);
}
</style>
