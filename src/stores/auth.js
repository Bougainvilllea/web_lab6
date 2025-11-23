import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const users = ref(JSON.parse(localStorage.getItem('users')) || [])
  
  const isLoggedIn = computed(() => !!user.value)
  
  function register(email, password) {
    if (users.value.find(u => u.email === email)) {
      throw new Error('Пользователь уже существует')
    }
    
    const newUser = { 
      id: Date.now(), 
      email, 
      password,
      createdAt: new Date().toISOString()
    }
    users.value.push(newUser)
    user.value = newUser
    localStorage.setItem('users', JSON.stringify(users.value))
    localStorage.setItem('user', JSON.stringify(newUser))
  }
  
  function login(email, password) {
    const foundUser = users.value.find(u => u.email === email && u.password === password)
    if (!foundUser) throw new Error('Неверный email или пароль')
    
    user.value = foundUser
    localStorage.setItem('user', JSON.stringify(foundUser))
  }
  
  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }
  
  return { user, isLoggedIn, register, login, logout }
}, {
  persist: true
})