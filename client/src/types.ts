// src/types.ts

export interface FilePreview {
  download_url: string;
}

export interface FileStorageData {
  relative_path: string;
  download_url_key: string;
  region_key: string;
}

export interface FileMetadata {
  orientation: number;
}

export interface File {
  subuser_id: number | null;
  id: number;
  storage_id: number;
  user_id: number;
  type: string;
  created: string;
  uploaded: string;
  name: string;
  size: number;
  mime_type: string;
  storage_data: FileStorageData;
  metadata: FileMetadata;
  state: string;
  previews: FilePreview[];
  download_url: string;
  view_url: string;
}

export interface TagBinding {
  // Define the structure of a tag binding here
}

// Tracker type
export interface Tracker {
  id: number;
  label: string;
  group_id: number;
  hasEngineHours: boolean;
  source: {
    id: number;
    device_id: string;
    model: string;
    blocked: boolean;
    tariff_id: number;
    phone: string;
    status_listing_id: number | null;
    creation_date: string;
    tariff_end_date: string;
  };
  tag_bindings: TagBinding[];
  clone: boolean;
}

export interface TrackerGroup {
  id: number;
  title: string;
  color: string;
}

export interface Checkin {
  id: number;
  user_id: number;
  tracker_id: number;
  employee_id?: number;
  comment: string;
  marker_time: string;
  location: {
    lat: number;
    lng: number;
    precision: number;
    address: string;
  };
  files: File[];
}

// New types for API responses
export interface CheckinData {
  employee_id: string;
  date: string;
  time: string;
}

export interface GetTrackersResponse {
  success: boolean;
  list: Tracker[];
}

export interface GetTrackerGroupsResponse {
  success: boolean;
  list: TrackerGroup[];
}

export interface GetCheckinsResponse {
  list: CheckinData[];
}

export interface Report {
  id: number;
  report_type: string;
  report_title: string;
  file_format: string;
  generated_at: string;
}

export interface GetReportsResponse {
  data: Report[];
}

export interface EngineHoursData {
  trackerId: number;
  hours: number;
}

export interface GetEngineHoursResponse {
  success: boolean;
  list: EngineHoursData[];
}

// StaleGPSData type for the Stale GPS report
export interface StaleGPSData {
  fleetNumber: string;
  deviceImeiNumber: string;
  latitude: number;
  longitude: number;
  lastGpsUpdate: string;
  mapLink: string;
}
