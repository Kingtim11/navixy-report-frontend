// src/components/ReportSettings.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ReportSettingsProps {
  reportType: string | null;
  reportTitle: string;
  setReportTitle: (title: string) => void;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  handleGenerateReport: () => void;
  handleCancel: () => void; // Add this prop
  fileURL: string | null;
}

const ReportSettings: React.FC<ReportSettingsProps> = ({
  reportType,
  reportTitle,
  setReportTitle,
  startDate,
  endDate,
  startTime,
  endTime,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
  handleGenerateReport,
  handleCancel, // Destructure this prop
  fileURL,
}) => {
  const initialStartDate = useMemo(() => (startDate ? new Date(startDate) : new Date()), [startDate]);
  const initialEndDate = useMemo(() => (endDate ? new Date(endDate) : new Date()), [endDate]);

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([initialStartDate, initialEndDate]);
  const [startTimeMinutes, setStartTimeMinutes] = useState(0);
  const [endTimeMinutes, setEndTimeMinutes] = useState(1439); // 23:59 in minutes

  useEffect(() => {
    setStartDate(initialStartDate.toISOString().split('T')[0]);
    setEndDate(initialEndDate.toISOString().split('T')[0]);
  }, [initialStartDate, initialEndDate, setStartDate, setEndDate]);

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange([start ?? undefined, end ?? undefined]);
    if (start) setStartDate(start.toISOString().split('T')[0]);
    if (end) setEndDate(end.toISOString().split('T')[0]);
  };

  const formatMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>, isStart: boolean) => {
    const value = parseInt(e.target.value);
    if (isStart) {
      setStartTimeMinutes(value);
      setStartTime(formatMinutesToTime(value));
    } else {
      setEndTimeMinutes(value);
      setEndTime(formatMinutesToTime(value));
    }
  };

  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>{reportType}</span>
      </div>
      <div className="report-generation-content">
        <div className="input-group">
          <label htmlFor="report-title">Report Title:</label>
          <input
            id="report-title"
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="Enter report title"
          />
        </div>
        <div className="input-group">
          <label>Date Range:</label>
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateRangeChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date range"
            shouldCloseOnSelect={false}
            onCalendarClose={() => {
              if (dateRange[0] && dateRange[1]) {
                // Close calendar if both dates are selected
                setDateRange(dateRange);
              }
            }}
          />
        </div>
        <div className="input-group">
          <label>Time Range: <span>{startTime} - {endTime}</span></label>
          <div className="time-range-slider">
            <div className="slider-track" style={{
              left: `${(startTimeMinutes / 1439) * 100}%`,
              width: `${((endTimeMinutes - startTimeMinutes) / 1439) * 100}%`
            }}></div>
            <input
              type="range"
              min="0"
              max="1439"
              value={startTimeMinutes}
              onChange={(e) => handleTimeRangeChange(e, true)}
            />
            <input
              type="range"
              min="0"
              max="1439"
              value={endTimeMinutes}
              onChange={(e) => handleTimeRangeChange(e, false)}
            />
          </div>
        </div>
        <div className="button-group">
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
          <button className="generate-button" onClick={handleGenerateReport}>Build Report</button>
        </div>
        {fileURL && (
          <iframe src={fileURL} width="100%" height="500px" title="Report Viewer"></iframe>
        )}
      </div>
    </div>
  );
};

export default ReportSettings;