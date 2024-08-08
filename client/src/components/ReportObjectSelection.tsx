// src/components/ReportObjectSelection.tsx
import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Tracker, TrackerGroup } from '../types';
import { getTrackers } from '../api';

interface ReportObjectSelectionProps {
  trackers: Tracker[];
  trackerGroups: TrackerGroup[];
  selectedTrackers: number[];
  setSelectedTrackers: React.Dispatch<React.SetStateAction<number[]>>;
  onBack: () => void;
  reportType: string | null;
  sessionKey: string;
}

const ReportObjectSelection: React.FC<ReportObjectSelectionProps> = ({
  trackers: initialTrackers,
  trackerGroups,
  selectedTrackers,
  setSelectedTrackers,
  onBack,
  reportType,
  sessionKey
}) => {
  const mainGroup = { id: 0, title: 'Main group', color: '1E96DC' };
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({});
  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);

  const trackerGroupsWithMainGroup = [
    mainGroup,
    ...trackerGroups.filter(group => group.id !== 0)
  ];

  const filteredTrackers = reportType === 'engineHours'
    ? trackers.filter(tracker => tracker.hasEngineHours)
    : trackers;

  const groupedTrackers = trackerGroupsWithMainGroup.map(group => ({
    ...group,
    trackers: filteredTrackers.filter(tracker => tracker.group_id === group.id)
  })).filter(group => group.trackers.length > 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trackersResponse = await getTrackers(sessionKey);
        if (trackersResponse.success) {
          setTrackers(trackersResponse.list);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [sessionKey]);

  const handleSelectAll = (select: boolean) => {
    if (select) {
      const allTrackerIds = filteredTrackers.map(tracker => tracker.id);
      setSelectedTrackers(allTrackerIds);
    } else {
      setSelectedTrackers([]);
    }
  };

  const handleSelectGroup = (groupId: number, select: boolean) => {
    const groupTrackerIds = filteredTrackers.filter(tracker => tracker.group_id === groupId).map(tracker => tracker.id);
    if (select) {
      setSelectedTrackers(prev => [...new Set([...prev, ...groupTrackerIds])]);
    } else {
      setSelectedTrackers(prev => prev.filter(id => !groupTrackerIds.includes(id)));
    }
  };

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>Objects</span>
        <ChevronLeftIcon className="back-icon" onClick={onBack} />
      </div>
      <div className="report-generation-content-objects">
        <div className="select-all">
          <input
            id="select-all-checkbox"
            type="checkbox"
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={selectedTrackers.length === filteredTrackers.length && filteredTrackers.length > 0}
          />
          <label htmlFor="select-all-checkbox">Select All</label>
        </div>
        {groupedTrackers.map(group => (
          <div key={group.id} className="group-section">
            <div
              className={`group-header ${group.trackers.every(tracker => selectedTrackers.includes(tracker.id)) ? 'selected' : ''}`}
              style={{ borderLeftColor: `#${group.color}` }}
            >
              <input
                id={`group-checkbox-${group.id}`}
                type="checkbox"
                onChange={(e) => handleSelectGroup(group.id, e.target.checked)}
                checked={group.trackers.every(tracker => selectedTrackers.includes(tracker.id))}
              />
              <h3>{group.title}</h3>
              <div className="toggle-button" onClick={(e) => { e.stopPropagation(); toggleGroup(group.id); }}>
                {expandedGroups[group.id] ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
              </div>
            </div>
            {expandedGroups[group.id] && group.trackers.map(tracker => (
              <label
                key={tracker.id}
                className={`object ${selectedTrackers.includes(tracker.id) ? 'selected' : ''}`}
              >
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
                {reportType === 'engineHours' && !tracker.hasEngineHours && 
                " (Engine hours tracking not set up)"}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportObjectSelection;