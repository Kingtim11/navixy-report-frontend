// GeneratedReportsList.tsx
import React, { useEffect, useState } from 'react';
import { fetchReports } from '../api';
import { Report } from '../types';

interface GeneratedReportsListProps {
  onCreateReport: () => void;
  customerId: string;
  onOpenReport: (reportId: number, title: string) => void;
}

const GeneratedReportsList: React.FC<GeneratedReportsListProps> = ({ onCreateReport, customerId, onOpenReport }) => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await fetchReports(customerId);
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        setReports([]);
      }
    };

    fetchReportsData();
  }, [customerId]);

  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>Generated reports</span>
      </div>
      <button className="item-like-button" onClick={onCreateReport}>+ CREATE REPORT</button>
      <ul className="reports-list">
        {reports.map((report) => (
          <li key={report.id} className="report-item" onClick={() => onOpenReport(report.id, report.report_title)}>
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