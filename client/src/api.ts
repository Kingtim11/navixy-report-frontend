// src/api.ts

import axios, { AxiosResponse } from 'axios';
import { 
  GetTrackerGroupsResponse, 
  GetCheckinsResponse, 
  Report, 
  StaleGPSData, 
  GetTrackersResponse, 
  GetEngineHoursResponse 
} from './types';  // Import necessary types

// Create an instance of axios with the base URL set to your local server
const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your actual backend URL if different
});

export const getTrackers = async (sessionKey: string): Promise<GetTrackersResponse> => {
  const response: AxiosResponse<GetTrackersResponse> = await api.get('/api/trackers', {
    params: { sessionKey }
  });
  return response.data;
};

// Existing functions remain unchanged
export const getTrackerGroups = async (sessionKey: string): Promise<GetTrackerGroupsResponse> => {
  const response: AxiosResponse<GetTrackerGroupsResponse> = await api.get('/api/tracker-groups', {
    params: { sessionKey }
  });
  return response.data;
};

export const getCheckins = async (
  sessionKey: string,
  trackerIds: number[],
  startDate: string,
  endDate: string,
  userId: string,
  reportType: string,
  reportTitle: string
): Promise<AxiosResponse<GetCheckinsResponse>> => {
  return api.post<GetCheckinsResponse>('/api/checkins', {
    sessionKey,
    trackerIds,
    startDate,
    endDate,
    userId,
    reportType,
    reportTitle,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const fetchReports = async (userId: string, sessionKey: string): Promise<AxiosResponse<Report[]>> => {
  return api.get<Report[]>('/api/reports', { params: { userId, sessionKey } });
};

export const downloadReport = async (reportId: number, format: 'pdf' | 'xlsx'): Promise<ArrayBuffer> => {
  const response = await api.get(`/api/reports/${reportId}/download/${format}`, {
    responseType: 'arraybuffer',
  });
  return response.data;
};

export const getEngineHours = async (
  sessionKey: string,
  trackerIds: number[],
  startDate: string,
  endDate: string,
  userId: string,
  reportType: string,
  reportTitle: string
): Promise<AxiosResponse<GetEngineHoursResponse>> => {
  return api.post<GetEngineHoursResponse>('/api/engine-hours', {
    sessionKey,
    trackerIds,
    startDate,
    endDate,
    userId,
    reportType,
    reportTitle,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// New API call for Stale GPS Report
export const getStaleGPS = async (
  sessionKey: string,
  trackerIds: number[],
  daysWithoutSignal: number,
  userId: string,
  reportType: string,
  reportTitle: string
): Promise<AxiosResponse<StaleGPSData[]>> => {
  return api.post<StaleGPSData[]>('/api/stale-gps', {
    sessionKey,
    trackerIds,
    daysWithoutSignal,
    userId,
    reportType,
    reportTitle,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
