import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';


// Move the interface to the top and export it
export interface Issue {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

class IssueStore {
  issues: Issue[] = [];
  loading: boolean = false;
  error: string | null = null;
  baseUrl: string;
  currentIssue: Issue | null = null;

  constructor() {
    makeAutoObservable(this);
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      this.baseUrl = 'http://localhost:8080';
    }
    console.log('Store initialized with baseUrl:', this.baseUrl);
  }

  // Fetch all issues
  async fetchIssues() {
    this.loading = true;
    this.error = null;
    try {
      console.log('Fetching issues from:', `${this.baseUrl}/api/issues`);
      const response = await axios.get(`${this.baseUrl}/api/issues`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Response:', response);
      runInAction(() => {
        this.issues = response.data;
        this.loading = false;
      });
    } catch (error: any) {
      console.error('Full error:', error);
      runInAction(() => {
        this.error = error.message || 'Failed to fetch issues';
        this.loading = false;
      });
    }
  }

  // Create a new issue
  async createIssue(issue: Omit<Issue, '_id' | 'createdAt' | 'updatedAt'>) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.post(`${this.baseUrl}/api/issues`, issue);
      runInAction(() => {
        this.issues.push(response.data);
        this.loading = false;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create issue';
        this.loading = false;
        console.error('Create error:', error);
      });
      throw error;
    }
  }

  // Delete an issue
  async deleteIssue(id: string) {
    this.loading = true;
    this.error = null;
    try {
      await axios.delete(`${this.baseUrl}/api/issues/${id}`);
      runInAction(() => {
        this.issues = this.issues.filter(issue => issue._id !== id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete issue';
        this.loading = false;
        console.error('Delete error:', error);
      });
    }
  }

  // Update an issue
  async updateIssue(id: string, updates: Partial<Issue>) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.put(`${this.baseUrl}/api/issues/${id}`, updates);
      runInAction(() => {
        const index = this.issues.findIndex(issue => issue._id === id);
        if (index !== -1) {
          this.issues[index] = response.data;
        }
        this.loading = false;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update issue';
        this.loading = false;
        console.error('Update error:', error);
      });
      throw error;
    }
  }

  async fetchIssue(id: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get(`${this.baseUrl}/api/issues/${id}`);
      runInAction(() => {
        this.currentIssue = response.data;
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch issue';
        this.loading = false;
      });
      throw error;
    }
  }
}

export const issueStore = new IssueStore(); 