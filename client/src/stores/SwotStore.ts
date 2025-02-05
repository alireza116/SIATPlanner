import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { actionStore } from '../stores/ActionStore';

export interface SwotEntry {
  _id: string;
  issueId: string;
  type: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

class SwotStore {
  entries: SwotEntry[] = [];
  loading: boolean = false;
  error: string | null = null;
  baseUrl: string;

  constructor() {
    makeAutoObservable(this);
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      this.baseUrl = 'http://localhost:8080';
    }
  }

  async fetchSwotEntries(issueId: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get(`${this.baseUrl}/api/swot-entries/issue/${issueId}`);
      runInAction(() => {
        this.entries = response.data;
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch SWOT entries';
        this.loading = false;
      });
    }
  }

  async createSwotEntry(entry: Omit<SwotEntry, '_id' | 'createdAt' | 'updatedAt'>) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.post(`${this.baseUrl}/api/swot-entries`, entry);
      runInAction(() => {
        this.entries.unshift(response.data);
        this.loading = false;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create SWOT entry';
        this.loading = false;
      });
      throw error;
    }
  }

  async updateSwotEntry(id: string, updates: Partial<SwotEntry>) {
    this.loading = true;
    this.error = null;
    try {
      console.log('Updating SWOT entry:', {
        id,
        updates,
        requestBody: { description: updates.description }
      });
      
      const response = await axios.put(`${this.baseUrl}/api/swot-entries/${id}`, {
        description: updates.description
      });
      
      console.log('Update response:', response.data);
      
      runInAction(() => {
        const index = this.entries.findIndex(entry => entry._id === id);
        if (index !== -1) {
          this.entries[index] = response.data;
        }
        this.loading = false;
      });
      actionStore.updateSwotEntryInActions(id, response.data);
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update SWOT entry';
        this.loading = false;
      });
      throw error;
    }
  }

  async deleteSwotEntry(id: string) {
    this.loading = true;
    this.error = null;
    try {
      await axios.delete(`${this.baseUrl}/api/swot-entries/${id}`);
      runInAction(() => {
        this.entries = this.entries.filter(entry => entry._id !== id);
      });
      // Notify ActionStore to remove this entry from all actions
      actionStore.removeDeletedSwotEntry(id);
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete SWOT entry';
        this.loading = false;
      });
      throw error;
    }
  }
}

export const swotStore = new SwotStore(); 