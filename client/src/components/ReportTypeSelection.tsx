// src/components/ReportTypeSelection.tsx
import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface ReportTypeSelectionProps {
  onSelectReportType: (type: string) => void;
  onBack: () => void;
}

const ReportTypeSelection: React.FC<ReportTypeSelectionProps> = ({ onSelectReportType, onBack }) => {
  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>Available reports</span>
        <ChevronLeftIcon className="back-icon" onClick={onBack} />
      </div>
      <ul className="reports-list">
        <li className="report-item" onClick={() => onSelectReportType('checkins')}>
          <div className="report-content">
            <h3>Check-ins</h3>
            <p>Check-ins on the map submitted by mobile employees</p>
          </div>
        </li>
        <li className="report-item" onClick={() => onSelectReportType('engineHours')}>
          <div className="report-content">
            <h3>Engine Hours</h3>
            <p>Engine hours for selected vehicles over a specified time period</p>
          </div>
        </li>
        <li className="report-item" onClick={() => onSelectReportType('staleGPS')}>
          <div className="report-content">
            <h3>Stale GPS</h3>
            <p>Vehicles that haven't had a GPS update within a specified time frame</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ReportTypeSelection;