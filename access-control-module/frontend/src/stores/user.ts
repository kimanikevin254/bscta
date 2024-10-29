import { defineStore } from 'pinia'
import type { UserInfo } from '@/types'
import { fetchUserInfo } from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
  }),
  actions: {
    setUserInfo(userInfo: UserInfo){
      this.userInfo = userInfo
    },
    removeUserInfo() {
      this.userInfo = null
    },
    async loadUser() {
      try {
          const data = await fetchUserInfo();
          this.userInfo = data;
      } catch (error) {
          throw error
      }
  }
  },
})
