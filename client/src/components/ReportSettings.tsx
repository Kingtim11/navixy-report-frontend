// src/components/ReportSettings.tsx
import React from 'react';

interface ReportSettingsProps {
  reportType: string | null;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  fileFormat: string;
  setFileFormat: (format: string) => void;
  handleGenerateReport: () => void;
  fileURL: string | null;
  onBack: () => void;
}

const ReportSettings: React.FC<ReportSettingsProps> = ({
  reportType,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  fileFormat,
  setFileFormat,
  handleGenerateReport,
  fileURL,
}) => {
  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>Generate {reportType} Report</span>
      </div>
      <div className="report-generation-content">
        <div>
          <label>Date Range:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Format:</label>
          <select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        <button className="generate-button" onClick={handleGenerateReport}>Generate Report</button>
        {fileURL && (
          <iframe src={fileURL} width="100%" height="500px" title="Report Viewer"></iframe>
        )}
      </div>
    </div>
  );
};

export default ReportSettings;