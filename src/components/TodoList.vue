<template>
  <div class="tasks-list">
    <div 
      v-for="task in sortedTasks" 
      :key="task.id"
    >
      <TodoItem 
        :task="task"
      />
    </div>
    
    <p v-if="sortedTasks.length === 0" class="empty-message">
      {{ emptyMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  filter: {
    type: String,
    default: 'all'
  },
  emptyMessage: {
    type: String,
    default: 'Заметок нет... Нужно добавить.'
  }
})

const sortedTasks = computed(() => {
  return [...props.tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    return 0
  })
})
</script>

<style scoped lang="scss">
.tasks-list {
  margin-top: 2rem;
}

.empty-message {
  text-align: center;
  color: #718096;
  padding: 3rem;
  font-style: italic;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

:deep(.dark-theme) .empty-message {
  color: #bdc3c7;
}
</style>