// src/components/ReportObjectSelection.tsx
import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Tracker } from '../types';

interface ReportObjectSelectionProps {
  trackers: Tracker[];
  selectedTrackers: number[];
  setSelectedTrackers: React.Dispatch<React.SetStateAction<number[]>>;
  onBack: () => void;
}

const ReportObjectSelection: React.FC<ReportObjectSelectionProps> = ({ trackers, selectedTrackers, setSelectedTrackers, onBack }) => {
  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>Objects</span>
        <ChevronLeftIcon className="back-icon" onClick={onBack} />
      </div>
      <div className="report-generation-content">
        {trackers.map(tracker => (
          <div key={tracker.id}>
            <input
              type="checkbox"
              checked={selectedTrackers.includes(tracker.id)}
              value={tracker.id}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedTrackers(prev => 
                  e.target.checked ? [...prev, id] : prev.filter(t => t !== id)
                );
              }}
            />
            {tracker.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportObjectSelection;