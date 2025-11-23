<template>
  <div class="todo-container">
    <div class="todo-card">
      <h1>Мои задачи:</h1>
      
      <div class="controls">
        <input 
          v-model="newTask" 
          @keyup.enter="addTask" 
          placeholder="Введите задачу и нажмите enter"
          class="task-input"
        >
        
        <div class="controls-right">
          <SearchBar @search="handleSearch" />
          <select v-model="todoStore.filter" class="filter-select">
            <option value="all">Все⚪</option>
            <option value="active">Активные❌</option>
            <option value="completed">Завершенные✔️</option>
          </select>
        </div>
      </div>
      
      <TodoList 
        :tasks="filteredAndSearchedTasks"
        :filter="todoStore.filter"
        :empty-message="emptyMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import TodoList from '../components/TodoList.vue'
import SearchBar from '../components/SearchBar.vue'

const newTask = ref('')
const searchQuery = ref('')
const todoStore = useTodoStore()

const filteredAndSearchedTasks = computed(() => {
  let tasks = todoStore.filteredTasks
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.text.toLowerCase().includes(query)
    )
  }
  
  return tasks
})

const emptyMessage = computed(() => {
  if (searchQuery.value.trim() && filteredAndSearchedTasks.value.length === 0) {
    return 'Задач по запросу нет.'
  }
  
  switch (todoStore.filter) {
    case 'completed': return 'Завершенных задач нет.'
    case 'active': return 'Активных задач нет.'
    default: return 'Заметок нет... Нужно добавить.'
  }
})

const addTask = () => {
  if (newTask.value.trim()) {
    todoStore.addTask(newTask.value.trim())
    newTask.value = ''
  }
}

const handleSearch = (query) => {
  searchQuery.value = query
}
</script>

<style scoped lang="scss">
.todo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.todo-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

:deep(.dark-theme) .todo-card {
  background: #2c3e50;
  color: #f0f0f0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2d3748;
  font-weight: 700;
  transition: color 0.3s ease;
}

:deep(.dark-theme) h1 {
  color: #f0f0f0;
}

.controls {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
}

.task-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6C63FF;
  }
}

:deep(.dark-theme) .task-input {
  background: #34495e;
  border-color: #4a6572;
  color: #f0f0f0;

  &::placeholder {
    color: #bdc3c7;
  }
}

.controls-right {
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
}

.filter-select {
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  color: #2d3748;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 160px;
  
  &:focus {
    outline: none;
    border-color: #6C63FF;
  }
}

:deep(.dark-theme) .filter-select {
  background: #34495e;
  border-color: #4a6572;
  color: #f0f0f0;
}
</style>