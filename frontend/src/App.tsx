import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Layouts & Banners
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DemoBanner } from './components/layout/DemoBanner';
import { PatientSidebar } from './components/layout/PatientSidebar';
import { PatientTopbar } from './components/layout/PatientTopbar';

// Entry Switcher
import { LandingRoleSelect } from './pages/LandingRoleSelect';

// Doctor Portal Pages (Existing - Preserved 100%)
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { PatientNew } from './pages/PatientNew';
import { PatientDetail } from './pages/PatientDetail';
import { CaseTaking } from './pages/CaseTaking';
import { CaseHistory } from './pages/CaseHistory';
import { Repertorization } from './pages/Repertorization';
import { AbdmIntegration } from './pages/AbdmIntegration';
import { Settings } from './pages/Settings';

// Patient Portal Pages (New Extension)
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientOnboarding } from './pages/patient/PatientOnboarding';
import { PatientDocuments } from './pages/patient/PatientDocuments';
import { PatientHealthSummary } from './pages/patient/PatientHealthSummary';
import { PatientShare } from './pages/patient/PatientShare';
import { PatientAccessHistory } from './pages/patient/PatientAccessHistory';

// Hospital Reception Kiosk Pages (New Extension)
import { KioskHome } from './pages/kiosk/KioskHome';
import { KioskIdentify } from './pages/kiosk/KioskIdentify';
import { KioskAssessment } from './pages/kiosk/KioskAssessment';
import { KioskReview } from './pages/kiosk/KioskReview';
import { KioskComplete } from './pages/kiosk/KioskComplete';

// Cross-Hospital Record Access View (New Extension)
import { HospitalSharedRecord } from './pages/hospital/HospitalSharedRecord';

import { getAuthToken } from './services/api';

// Doctor Protected Layout
const DoctorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getAuthToken();
  const location = useLocation();
  const navigate = useNavigate();

  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  const getPageMeta = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { title: 'Clinical Dashboard', subtitle: 'OPD Schedule & Case Overview' };
    if (path === '/patients/new') return { title: 'Register Patient', subtitle: 'New EHR Demographic Entry' };
    if (path.startsWith('/patients/')) return { title: 'Patient Profile', subtitle: 'Demographics & Case History' };
    if (path.startsWith('/patients')) return { title: 'Patient Directory', subtitle: 'Active Patient Database' };
    if (path.startsWith('/cases/new') || path.startsWith('/cases/')) return { title: 'Clinical Case-Taking', subtitle: 'Structured Multi-Step Workflow' };
    if (path.startsWith('/history')) return { title: 'Case History', subtitle: 'Consultation Records Archive' };
    if (path.startsWith('/repertorization')) return { title: 'Homeopathic Repertorization', subtitle: 'Educational Decision Support' };
    if (path.startsWith('/abdm')) return { title: 'ABDM / ABHA Gateway', subtitle: 'Simulated Interoperability' };
    if (path.startsWith('/settings')) return { title: 'System Settings', subtitle: 'Practitioner Profile & Terminology' };
    return { title: 'AyushCare Clinical Portal', subtitle: 'SIH PS 26047' };
  };

  const meta = getPageMeta();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100/70 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DemoBanner onQuickDemoClick={() => navigate('/cases/new?demo=case-shirahshoola')} />
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onDemoPresetTrigger={() => navigate('/cases/new?demo=case-shirahshoola')}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Patient Portal Layout
const PatientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const getPageMeta = () => {
    const path = location.pathname;
    if (path.startsWith('/patient/dashboard')) return { title: 'Patient Dashboard', subtitle: 'Personal Health Summary' };
    if (path.startsWith('/patient/onboarding')) return { title: 'First-Time Health Profile', subtitle: 'Baseline Questionnaire' };
    if (path.startsWith('/patient/documents')) return { title: 'Medical Documents & OCR', subtitle: 'Digitization & Review' };
    if (path.startsWith('/patient/health-summary')) return { title: 'Longitudinal Health Record', subtitle: 'Unified EHR History' };
    if (path.startsWith('/patient/share')) return { title: 'Share Records', subtitle: 'Secure Temporary QR & PIN' };
    if (path.startsWith('/patient/access-history')) return { title: 'Access Audit History', subtitle: 'Security & Transparency' };
    return { title: 'AyushCare Patient Portal', subtitle: 'Personal Health Record' };
  };

  const meta = getPageMeta();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100/70 font-sans">
      <PatientSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <PatientTopbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Entry Role Switcher */}
        <Route path="/" element={<LandingRoleSelect />} />

        {/* Doctor Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Doctor Routes (Preserved 100%) */}
        <Route path="/dashboard" element={<DoctorLayout><Dashboard /></DoctorLayout>} />
        <Route path="/patients" element={<DoctorLayout><Patients /></DoctorLayout>} />
        <Route path="/patients/new" element={<DoctorLayout><PatientNew /></DoctorLayout>} />
        <Route path="/patients/:id" element={<DoctorLayout><PatientDetail /></DoctorLayout>} />
        <Route path="/cases/new" element={<DoctorLayout><CaseTaking /></DoctorLayout>} />
        <Route path="/cases/new/:patientId" element={<DoctorLayout><CaseTaking /></DoctorLayout>} />
        <Route path="/cases/:caseId" element={<DoctorLayout><CaseTaking /></DoctorLayout>} />
        <Route path="/history" element={<DoctorLayout><CaseHistory /></DoctorLayout>} />
        <Route path="/repertorization" element={<DoctorLayout><Repertorization /></DoctorLayout>} />
        <Route path="/abdm" element={<DoctorLayout><AbdmIntegration /></DoctorLayout>} />
        <Route path="/settings" element={<DoctorLayout><Settings /></DoctorLayout>} />

        {/* Patient Portal Routes */}
        <Route path="/patient/dashboard" element={<PatientLayout><PatientDashboard /></PatientLayout>} />
        <Route path="/patient/onboarding" element={<PatientLayout><PatientOnboarding /></PatientLayout>} />
        <Route path="/patient/documents" element={<PatientLayout><PatientDocuments /></PatientLayout>} />
        <Route path="/patient/health-summary" element={<PatientLayout><PatientHealthSummary /></PatientLayout>} />
        <Route path="/patient/share" element={<PatientLayout><PatientShare /></PatientLayout>} />
        <Route path="/patient/access-history" element={<PatientLayout><PatientAccessHistory /></PatientLayout>} />

        {/* Hospital Kiosk Mode Routes (Fullscreen Dedicated UI) */}
        <Route path="/kiosk" element={<KioskHome />} />
        <Route path="/kiosk/identify" element={<KioskIdentify />} />
        <Route path="/kiosk/assessment" element={<KioskAssessment />} />
        <Route path="/kiosk/review" element={<KioskReview />} />
        <Route path="/kiosk/complete" element={<KioskComplete />} />

        {/* Cross-Hospital Shared Record View */}
        <Route path="/hospital/shared-record" element={<HospitalSharedRecord />} />
        <Route path="/shared-record/:token" element={<HospitalSharedRecord />} />

        {/* Root Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
