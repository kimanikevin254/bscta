import { fetchProjects } from '@/services/projectService'
import type { Project } from '@/types'
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    currentProject: null as Project | null,
    projects: [] as Project[] | [],
    isLoadingProjects: false as boolean,
  }),
  actions: {
    setCurrentProject(project: Project){
      this.currentProject = project
    },
    async loadProjects() {
        try {
            this.isLoadingProjects = true;
            const data = await fetchProjects();
            this.projects = data;
        } catch (error) {
            throw error
        } finally {
            this.isLoadingProjects = false;
        }
    }
  },
})