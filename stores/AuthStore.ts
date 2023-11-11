import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth-store', {
  state: () => ({
    isUsersLoaded: false,
    users: [] as {
      id: string;
      email: string;
    }[],
  }),
  actions: {
    async getAllUsers() {
      if (!this.isUsersLoaded) {
        const client = useSupabaseClient();
        const { data, error }= await client.auth.admin.listUsers();
        this.users = data.users.map(u => {
          return {
            id: u.id,
            email: u.email ?? ""
          }
        })
      }; 
      this.isUsersLoaded = true;
      return this.users;
    },
    async getUserById(id: string) {
      return (await this.getAllUsers()).find(u => u.id === id);
    },
  },
})