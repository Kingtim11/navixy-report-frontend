import React, { useEffect, useState } from 'react';
import { fetchReports, downloadReport } from '../api';
import { Report } from '../types';

interface GeneratedReportsListProps {
  onCreateReport: () => void;
  customerId: string;
  onOpenReport: (url: string) => void;
}

const GeneratedReportsList: React.FC<GeneratedReportsListProps> = ({ onCreateReport, customerId, onOpenReport }) => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await fetchReports(customerId);
        if (Array.isArray(response.data)) {
          setReports(response.data);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        setReports([]);
      }
    };

    fetchReportsData();
  }, [customerId]);

  const handleOpenReport = async (reportId: number) => {
    try {
      const response = await downloadReport(reportId);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      onOpenReport(url);
    } catch (error) {
      console.error('Failed to open report:', error);
    }
  };

  return (
    <div className="report-panel">
      <div className="panel-header">
        <span>Generated reports</span>
      </div>
      <button className="item-like-button" onClick={onCreateReport}>+ CREATE REPORT</button>
      <ul className="reports-list">
        {reports.map((report) => (
          <li key={report.id} className="report-item" onClick={() => handleOpenReport(report.id)}>
            <div className="report-content">
              <h3>{report.report_type}</h3>
              <p>Generated: {new Date(report.generated_at).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GeneratedReportsList;