// ReportSettings.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
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
  daysWithoutSignal: number; // Add daysWithoutSignal prop
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setDaysWithoutSignal: (days: number) => void; // Add setDaysWithoutSignal prop
  handleGenerateReport: () => void;
  handleCancel: () => void;
  fileURL: string | null;
}

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps): JSX.Element => {
  return (
    <div className="custom-header">
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        {"<"}
      </button>
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(parseInt(value))}
      >
        {Array.from({ length: 10 }, (_, i) => date.getFullYear() - 5 + i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>

      <select
        value={date.getMonth()}
        onChange={({ target: { value } }) => changeMonth(parseInt(value))}
      >
        {[
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ].map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>

      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {">"}
      </button>
    </div>
  );
};

const ReportSettings: React.FC<ReportSettingsProps> = ({
  reportType,
  reportTitle,
  setReportTitle,
  startDate,
  endDate,
  startTime,
  endTime,
  daysWithoutSignal, // Add daysWithoutSignal prop
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
  setDaysWithoutSignal, // Add setDaysWithoutSignal prop
  handleGenerateReport,
  handleCancel,
  fileURL,
}) => {
  const initialStartDate = useMemo(() => (startDate ? new Date(startDate) : new Date()), [startDate]);
  const initialEndDate = useMemo(() => (endDate ? new Date(endDate) : new Date()), [endDate]);
  const today = new Date();
  const placeholderText = `${reportType} report` || 'Enter report title';

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([initialStartDate, initialEndDate]);
  const [startTimeMinutes, setStartTimeMinutes] = useState(0);
  const [endTimeMinutes, setEndTimeMinutes] = useState(1439);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
    // Round to nearest 15-minute increment
    let roundedValue = Math.round(value / 15) * 15;
    // Stops the slider going past 23:59
    if (roundedValue > 1439) {
      roundedValue = 1439
    }

    if (isStart) {
      setStartTimeMinutes(roundedValue);
      setStartTime(formatMinutesToTime(roundedValue));
    } else {
      setEndTimeMinutes(roundedValue);
      setEndTime(formatMinutesToTime(roundedValue));
    }
  };

  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>{reportType}</span>
      </div>
      <div className="report-generation-content-settings">
        <div className="input-group">
          <label htmlFor="report-title">Report Title:</label>
          <input
            id="report-title"
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </div>
        <div className="input-group">
          <label>Date Range:</label>
          <DatePicker
            calendarClassName='date-picker'
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateRangeChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date range"
            shouldCloseOnSelect={false}
            open={isCalendarOpen}
            onInputClick={() => setIsCalendarOpen(true)}
            onClickOutside={() => setIsCalendarOpen(false)}
            renderCustomHeader={CustomHeader}
            maxDate={today}
          >
            <div className="datepicker-ok-button-container">
              <button 
                className="datepicker-ok-button"
                onClick={() => setIsCalendarOpen(false)}
              >
                Ok
              </button>
            </div>
          </DatePicker>
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
        {reportType === 'staleGPS' && (
          <div className="input-group">
            <label htmlFor="days-without-signal">Days Without Signal:</label>
            <input
              id="days-without-signal"
              type="number"
              min="1"
              max="30"
              value={daysWithoutSignal}
              onChange={(e) => setDaysWithoutSignal(parseInt(e.target.value))}
              required
            />
          </div>
        )}
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
