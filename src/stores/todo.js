import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || [])
  const filter = ref('all')
  
  const auth = useAuthStore()
  
  const filteredTasks = computed(() => {
    const userTasks = tasks.value.filter(t => t.userId === auth.user?.id)
    
    switch (filter.value) {
      case 'completed': return userTasks.filter(t => t.completed)
      case 'active': return userTasks.filter(t => !t.completed)
      default: return userTasks
    }
  })
  
  function addTask(text) {
    const task = {
      id: Date.now(),
      text,
      completed: false,
      userId: auth.user.id,
      createdAt: new Date().toISOString()
    }
    tasks.value.push(task)
    saveToLocalStorage()
  }
  
  function deleteTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveToLocalStorage()
  }
  
  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      saveToLocalStorage()
    }
  }
  
  function editTask(id, newText) {
    const task = tasks.value.find(t => t.id === id)
    if (task && newText.trim()) {
      task.text = newText.trim()
      task.updatedAt = new Date().toISOString()
      saveToLocalStorage()
    }
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }
  
  return { 
    tasks, 
    filter, 
    filteredTasks, 
    addTask, 
    deleteTask, 
    toggleTask,
    editTask
  }
}, {
  persist: true
})