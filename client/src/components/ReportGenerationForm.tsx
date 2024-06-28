// RepoerGenerationForm.tsx
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
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [fileFormat, setFileFormat] = useState<string>('pdf');
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
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      try {
        const response = await getCheckins(
          'ec19873072b16f75723a4fbda74929f7',
          selectedTrackers,
          formattedStartDate,
          formattedEndDate,
          fileFormat,
          customerId,
          reportType || ''
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
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fileFormat={fileFormat}
        setFileFormat={setFileFormat}
        handleGenerateReport={handleGenerateReport}
        fileURL={fileURL}
        onBack={onBack}
      />
    </>
  );
};

export default ReportGenerationForm;