// App.tsx
import React, { useState } from 'react';
import GeneratedReportsList from './components/GeneratedReportsList';
import ReportTypeSelection from './components/ReportTypeSelection';
import ReportGenerationForm from './components/ReportGenerationForm';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { downloadReport } from './api';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [selectedTrackers, setSelectedTrackers] = useState<number[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentReportId, setCurrentReportId] = useState<number | null>(null);
  const [currentReportTitle, setCurrentReportTitle] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const customerId = 'customer_123'; // Replace with actual customer ID

  const handleCreateReport = () => setStep(1);
  const handleSelectReportType = (type: string) => {
    setSelectedReportType(type);
    setStep(2);
  };
  const handleBack = () => {
    if (step === 2 && selectedReportType) {
      setSelectedReportType(null);
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  const handleOpenReport = async (reportId: number, title: string) => {
    try {
      const response = await downloadReport(reportId, 'pdf');
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setCurrentReportId(reportId);
      setCurrentReportTitle(title);
    } catch (error) {
      console.error('Failed to open report:', error);
    }
  };

  const handleDownload = async (format: 'pdf' | 'xlsx') => {
    if (currentReportId) {
      try {
        const blob = await downloadReport(currentReportId, format);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentReportTitle}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(`Failed to download ${format} report:`, error);
      }
    }
    setAnchorEl(null);
  };

  const handleClickDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="app-container">
      {step === 0 && (
        <>
          <GeneratedReportsList
            onCreateReport={handleCreateReport}
            customerId={customerId}
            onOpenReport={handleOpenReport}
          />
          {pdfUrl && (
            <div className="report-viewer-container">
              <div className="panel-header">
                <IconButton onClick={handleClickDownload} size="small">
                  <FileDownloadIcon className="back-icon" />
                </IconButton>
                <span>Report Viewer: {currentReportTitle}</span>
                <IconButton onClick={() => setPdfUrl(null)} size="small">
                  <ChevronLeftIcon className="back-icon" />
                </IconButton>
              </div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={() => handleDownload('pdf')}>Download PDF</MenuItem>
                <MenuItem onClick={() => handleDownload('xlsx')}>Download XLSX</MenuItem>
              </Menu>
              <iframe 
                src={pdfUrl} 
                width="100%" 
                height="100%" 
                title="Report Viewer"
              ></iframe>
            </div>
          )}
        </>
      )}
      {step === 1 && <ReportTypeSelection onSelectReportType={handleSelectReportType} onBack={handleBack} />}
      {step === 2 && (
        <>
          <ReportTypeSelection onSelectReportType={handleSelectReportType} onBack={handleBack} />
          <ReportGenerationForm
            onBack={handleBack}
            reportType={selectedReportType}
            customerId={customerId}
            selectedTrackers={selectedTrackers}
            setSelectedTrackers={setSelectedTrackers}
          />
        </>
      )}
    </Box>
  );
};

export default App;