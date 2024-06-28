// App.tsx
import React, { useState } from 'react';
import GeneratedReportsList from './components/GeneratedReportsList';
import ReportTypeSelection from './components/ReportTypeSelection';
import ReportGenerationForm from './components/ReportGenerationForm';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box } from '@mui/material';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [selectedTrackers, setSelectedTrackers] = useState<number[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
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

  return (
    <Box className="app-container">
      {step === 0 && (
        <>
          <GeneratedReportsList
            onCreateReport={handleCreateReport}
            customerId={customerId}
            onOpenReport={setPdfUrl}
          />
          {pdfUrl && (
            <div className="report-viewer-container">
              <div className="panel-header">
                <span>Report Viewer</span>
                <ChevronLeftIcon className="back-icon" onClick={() => setPdfUrl(null)} />
              </div>
              <iframe src={pdfUrl} width="100%" height="100%" title="Report Viewer"></iframe>
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