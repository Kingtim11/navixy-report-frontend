// ReportGenerationForm.tsx
import React, { useState, useEffect } from 'react';
import { getTrackers, getCheckins } from '../api';
import { Tracker } from '../types';
import ReportSettings from './ReportSettings';
import ReportObjectSelection from './ReportObjectSelection';

interface ReportGenerationFormProps {
  onBack: () => void;
  reportType: string | null;
  customerId: string;
  selectedTrackers: number[];
  setSelectedTrackers: React.Dispatch<React.SetStateAction<number[]>>;
}

const ReportGenerationForm: React.FC<ReportGenerationFormProps> = ({
  onBack,
  reportType,
  customerId,
  selectedTrackers,
  setSelectedTrackers,
}) => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [reportTitle, setReportTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endTime, setEndTime] = useState<string>('23:59');
  const [fileURL, setFileURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackers = async () => {
      const sessionHash = 'ec19873072b16f75723a4fbda74929f7';
      try {
        const data = await getTrackers(sessionHash);
        if (data.success && Array.isArray(data.list)) {
          setTrackers(data.list);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch trackers:", error);
      }
    };

    fetchTrackers();
  }, []);

  const handleGenerateReport = async () => {
    if (customerId && selectedTrackers.length > 0 && startDate && endDate) {
      const formattedStartDate = `${startDate}T${startTime}:00`;
      const formattedEndDate = `${endDate}T${endTime}:00`;

      try {
        const response = await getCheckins(
          'ec19873072b16f75723a4fbda74929f7',
          selectedTrackers,
          formattedStartDate,
          formattedEndDate,
          customerId,
          reportType || '',
          reportTitle
        );
        const blob = new Blob([response.data as unknown as BlobPart], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        setFileURL(url);
      } catch (error) {
        console.error("Failed to fetch check-ins:", error);
        alert("Failed to generate the report. Please try again.");
      }
    } else {
      console.error("Missing required parameters to generate report");
    }
  };

  const handleCancel = () => {
    // Handle the cancel action here
    onBack(); // Or any other logic to go back to the previous step
  };

  return (
    <>
      <ReportObjectSelection
        trackers={trackers}
        selectedTrackers={selectedTrackers}
        setSelectedTrackers={setSelectedTrackers}
        onBack={onBack}
      />
      <ReportSettings
        reportType={reportType}
        reportTitle={reportTitle}
        setReportTitle={setReportTitle}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        handleGenerateReport={handleGenerateReport}
        handleCancel={handleCancel}
        fileURL={fileURL}
      />
    </>
  );
};

export default ReportGenerationForm;