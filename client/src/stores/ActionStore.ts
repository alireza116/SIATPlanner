import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { SwotEntry } from './SwotStore';


export interface Action {
  _id: string;
  issueId: string;
  title: string;
  description: string;
  detail?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  swotEntries: SwotEntry[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

class ActionStore {
  actions: Action[] = [];
  loading: boolean = false;
  error: string | null = null;
  baseUrl: string;

  constructor() {
    makeAutoObservable(this);
    console.log("public api base url", process.env.NEXT_PUBLIC_API_BASE_URL);
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      this.baseUrl = 'http://localhost:8080';
    }
  }


  async fetchActions(issueId: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get(`${this.baseUrl}/api/actions/issue/${issueId}`);
      runInAction(() => {
        this.actions = response.data.map((action: Action) => ({
          ...action,
          swotEntries: Array.isArray(action.swotEntries) ? action.swotEntries : []
        }));
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch actions';
        this.loading = false;
        console.error('Error fetching actions:', error);
      });
    }
  }


  async createAction(action: Omit<Action, '_id' | 'createdAt' | 'updatedAt'>) {
    this.loading = true;
    try {
      const response = await axios.post(`${this.baseUrl}/api/actions`, action);
      runInAction(() => {
        this.actions.unshift(response.data);
        this.loading = false;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create action';
        this.loading = false;
      });
      throw error;
    }
  }

  async updateAction(id: string, updates: { title: string; description: string }) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.put(`${this.baseUrl}/api/actions/${id}`, updates);
      runInAction(() => {
        const index = this.actions.findIndex(action => action._id === id);
        if (index !== -1) {
          this.actions[index] = {
            ...this.actions[index],
            title: response.data.title,
            description: response.data.description
          };
        }
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to update action';
        this.loading = false;
      });
      throw error;
    }
  }

  async deleteAction(id: string) {
    this.loading = true;
    try {
      await axios.delete(`${this.baseUrl}/api/actions/${id}`);
      runInAction(() => {
        this.actions = this.actions.filter(action => action._id !== id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete action';
        this.loading = false;
      });
      throw error;
    }
  }

  async addSwotEntryToAction(actionId: string, swotEntryId: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/actions/${actionId}/swot-entries`, {
        swotEntryId
      });
      runInAction(() => {
        const index = this.actions.findIndex(action => action._id === actionId);
        if (index !== -1) {
          this.actions[index] = {
            ...this.actions[index],
            swotEntries: response.data.swotEntries
          };
        }
      });
    } catch (error: any) {
      console.error('Failed to add SWOT entry:', error);
      throw error;
    }
  }

  async removeSwotEntryFromAction(actionId: string, swotEntryId: string) {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/api/actions/${actionId}/swot-entries/${swotEntryId}`
      );
      runInAction(() => {
        const index = this.actions.findIndex(action => action._id === actionId);
        if (index !== -1) {
          this.actions[index] = {
            ...this.actions[index],
            swotEntries: response.data.swotEntries
          };
        }
      });
    } catch (error: any) {
      console.error('Failed to remove SWOT entry:', error);
      throw error;
    }
  }

  removeDeletedSwotEntry(swotEntryId: string) {
    runInAction(() => {
      this.actions = this.actions.map(action => ({
        ...action,
        swotEntries: action.swotEntries?.filter(entry => entry._id !== swotEntryId) || []
      }));
    });
  }

  updateSwotEntryInActions(entryId: string, updatedEntry: SwotEntry) {
    runInAction(() => {
      this.actions = this.actions.map(action => ({
        ...action,
        swotEntries: action.swotEntries?.map(entry => 
          entry._id === entryId ? updatedEntry : entry
        ) || []
      }));
    });
  }

  async updateActionDetail(id: string, detail: string) {
    this.loading = true;
    this.error = null;
    try {
      await axios.put(`${this.baseUrl}/api/actions/${id}/detail`, { detail });
      runInAction(() => {
        const index = this.actions.findIndex(action => action._id === id);
        if (index !== -1) {
          this.actions[index] = {
            ...this.actions[index],
            detail
          };
        }
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to update action detail';
        this.loading = false;
      });
      throw error;
    }
  }

  async deleteActionDetail(id: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.delete(`${this.baseUrl}/api/actions/${id}/detail`);
      runInAction(() => {
        const index = this.actions.findIndex(action => action._id === id);
        if (index !== -1) {
          this.actions[index] = {
            ...this.actions[index],
            detail: ''
          };
        }
        this.loading = false;
      });
      return response.data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to delete action detail';
        this.loading = false;
      });
      throw error;
    }
  }

  async fetchActionDetail(id: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get(`${this.baseUrl}/api/actions/${id}/detail`);
      runInAction(() => {
        const index = this.actions.findIndex(action => action._id === id);
        if (index !== -1) {
          this.actions[index] = {
            ...this.actions[index],
            detail: response.data.detail
          };
        }
        this.loading = false;
      });
      return response.data.detail;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch action detail';
        this.loading = false;
      });
      throw error;
    }
  }
}

export const actionStore = new ActionStore(); 