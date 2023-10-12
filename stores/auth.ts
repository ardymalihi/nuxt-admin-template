import { defineStore } from 'pinia'

export const useAuthStore = defineStore('user', {
  state: () => ({
    user: {
        email: "Unknown",
    }
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
    },
  },
})