// ReportGenerationForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { getTrackers, getCheckins, getTrackerGroups, getEngineHours, getStaleGPS } from '../api';
import { Tracker, TrackerGroup } from '../types';
import ReportObjectSelection from './ReportObjectSelection';
import ReportSettings from './ReportSettings';

interface ReportGenerationFormProps {
  onBack: () => void;
  reportType: string | null;
  userId: string;
  sessionKey: string;
  selectedTrackers: number[];
  setSelectedTrackers: React.Dispatch<React.SetStateAction<number[]>>;
  userTimeZone: string;
  onReportGenerated: () => void;
}

const ReportGenerationForm: React.FC<ReportGenerationFormProps> = ({
  onBack,
  reportType,
  userId,
  sessionKey,
  selectedTrackers,
  setSelectedTrackers,
  userTimeZone,
  onReportGenerated
}) => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [trackerGroups, setTrackerGroups] = useState<TrackerGroup[]>([]);
  const [reportTitle, setReportTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endTime, setEndTime] = useState<string>('23:59');
  const [daysWithoutSignal, setDaysWithoutSignal] = useState<number>(7);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTrackers = async () => {
      try {
        const trackersResponse = await getTrackers(sessionKey);
        if (trackersResponse.success && Array.isArray(trackersResponse.list)) {
          setTrackers(trackersResponse.list);
          console.log('Fetched trackers:', trackersResponse.list);
        }
      } catch (error) {
        console.error('Failed to fetch trackers:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const groupsResponse = await getTrackerGroups(sessionKey);
        if (groupsResponse.success && Array.isArray(groupsResponse.list)) {
          const fetchedGroups = groupsResponse.list;
          const mainGroup = { id: 0, title: 'Main group', color: '1E96DC' };
          
          // Add the main group if it doesn't exist
          if (!fetchedGroups.some(group => group.id === 0)) {
            fetchedGroups.unshift(mainGroup);
          }

          setTrackerGroups(fetchedGroups);
          console.log('Fetched tracker groups:', fetchedGroups);
        }
      } catch (error) {
        console.error('Failed to fetch tracker groups:', error);
      }
    };

    fetchTrackers();
    fetchGroups();
  }, [sessionKey]);

  const formatDateTimeForAPI = (date: string, time: string, timeZone: string): string => {
    // Create a date string in ISO format
    const dateTimeString = `${date}T${time}:00`;
    // Create a date object in the specified time zone
    const userDateTime = new Date(new Date(dateTimeString).toLocaleString('en-US', {timeZone}));
    // Convert to UTC
    return userDateTime.toISOString().slice(0, 19);
  };

  const handleGenerateReport = async () => {
    const finalReportTitle = reportTitle.trim() || `${reportType} report`;

    if (userId && selectedTrackers.length > 0 && startDate && endDate) {
      const formattedStartDate = formatDateTimeForAPI(startDate, startTime, userTimeZone);
      const formattedEndDate = formatDateTimeForAPI(endDate, endTime, userTimeZone);
      console.log(formattedStartDate, formattedEndDate);

      try {
        let response;
        if (reportType === 'checkins') {
          response = await getCheckins(
            sessionKey,
            selectedTrackers,
            formattedStartDate,
            formattedEndDate,
            userId,
            reportType,
            finalReportTitle
          );
        } else if (reportType === 'engineHours') {
          response = await getEngineHours(
            sessionKey,
            selectedTrackers,
            formattedStartDate,
            formattedEndDate,
            userId,
            reportType,
            finalReportTitle
          );
        } else if (reportType === 'staleGPS') {
          response = await getStaleGPS(
            sessionKey,
            selectedTrackers,
            daysWithoutSignal,
            userId,
            reportType,
            finalReportTitle
          );
        } else {
          throw new Error('Unsupported report type');
        }
        const blob = new Blob([response.data as unknown as BlobPart], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        setFileURL(url);
        onReportGenerated();
        // Trigger animation
        if (reportRef.current) {
          reportRef.current.classList.add('flash-blue');
          setTimeout(() => {
            if (reportRef.current) {
              reportRef.current.classList.remove('flash-blue');
            }
          }, 1000); // Duration of the animation
        }
      } catch (error) {
        console.error('Failed to fetch check-ins:', error);
        alert('Failed to generate the report. Please try again.');
      }
    } else {
      console.error('Missing required parameters to generate report');
    }
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <>
      <ReportObjectSelection
        trackers={trackers}
        trackerGroups={trackerGroups}
        selectedTrackers={selectedTrackers}
        setSelectedTrackers={setSelectedTrackers}
        onBack={onBack}
        reportType={reportType}
        sessionKey={sessionKey}
      />
      <ReportSettings
        reportType={reportType}
        reportTitle={reportTitle}
        setReportTitle={setReportTitle}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        daysWithoutSignal={daysWithoutSignal} // Pass the daysWithoutSignal state
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        setDaysWithoutSignal={setDaysWithoutSignal} // Pass the setter function
        handleGenerateReport={handleGenerateReport}
        handleCancel={handleCancel}
        fileURL={fileURL}
      />
    </>
  );
};

export default ReportGenerationForm;