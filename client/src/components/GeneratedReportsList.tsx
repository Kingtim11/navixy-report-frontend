// GeneratedReportsList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { fetchReports } from '../api';
import { Report } from '../types';

interface GeneratedReportsListProps {
  onCreateReport: () => void;
  sessionKey: string;
  userId: string;
  onOpenReport: (reportId: number, title: string) => void;
  newReportTimestamp: number | null;
  setNewReportTimestamp: React.Dispatch<React.SetStateAction<number | null>>;
}

const GeneratedReportsList: React.FC<GeneratedReportsListProps> = ({ onCreateReport, sessionKey,  userId, onOpenReport, newReportTimestamp, setNewReportTimestamp }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [highlightedReportId, setHighlightedReportId] = useState<number | null>(null);

  const fetchReportsData = useCallback(async () => {
    try {
      const response = await fetchReports(userId, sessionKey);
      setReports(response.data);
      
      // If there's a new report, highlight the first one in the list
      if (newReportTimestamp !== null && response.data.length > 0) {
        setHighlightedReportId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setReports([]);
    }
  }, [userId, sessionKey, newReportTimestamp]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  useEffect(() => {
    if (newReportTimestamp !== null) {
      // Clear the newReportTimestamp and highlighted report after 2 second
      const timer = setTimeout(() => {
        setNewReportTimestamp(null);
        setHighlightedReportId(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [newReportTimestamp, setNewReportTimestamp]);
  

  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>Generated reports</span>
      </div>
      <button className="item-like-button" onClick={onCreateReport}>+ CREATE REPORT</button>
      <ul className="reports-list">
        {reports.map((report) => (
          <li
          key={report.id}
          className={`report-item ${report.id === highlightedReportId ? 'pulse-border' : ''}`}
          onClick={() => onOpenReport(report.id, report.report_title)}
        >
            <div className="report-content">
              <h3>{report.report_title}</h3>
              <p>Generated: {new Date(report.generated_at).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GeneratedReportsList;