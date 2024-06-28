// src/api.ts
import axios, { AxiosResponse } from 'axios';
import { GetTrackersResponse, GetCheckinsResponse, Report } from './types';

// Create an instance of axios with the base URL set to your local server
const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your actual backend URL if different
});

export const getTrackers = async (hash: string): Promise<GetTrackersResponse> => {
  const response: AxiosResponse<GetTrackersResponse> = await api.get('/api/trackers', {
    params: { hash }
  });
  return response.data;
};

export const getCheckins = async (
  hash: string,
  trackerIds: number[],
  startDate: string,
  endDate: string,
  format: string,
  customerId: string,
  reportType: string
): Promise<AxiosResponse<GetCheckinsResponse>> => {
  return api.post<GetCheckinsResponse>('/api/checkins', {
    hash,
    trackerIds,
    startDate,
    endDate,
    format,
    customerId,
    reportType,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const fetchReports = async (customerId: string): Promise<AxiosResponse<Report[]>> => {
  return api.get<Report[]>('/api/reports', { params: { customerId } });
};

export const downloadReport = async (reportId: number): Promise<AxiosResponse<Blob>> => {
  return api.get<Blob>(`/api/reports/${reportId}/download`, { responseType: 'blob' });
};