import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { WhyNecessary } from './components/WhyNecessary';
import { ScannerDashboard } from './components/Scanner/ScannerDashboard';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AiChatWidget } from './components/Chat/AiChatWidget';
import { ScanReport } from './types';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<ScanReport | null>(null);

  const scrollToScanner = () => {
    const el = document.getElementById('scanner-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskAi = (report: ScanReport) => {
    setActiveReport(report);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A] selection:bg-[#4338CA]/15 selection:text-[#4338CA]">
      {/* Sticky Condensed Header */}
      <Navbar onScanClick={scrollToScanner} />

      <main className="flex-1">
        {/* Section 1: Hero */}
        <Hero onTryNow={scrollToScanner} onLearnMore={scrollToHowItWorks} />

        {/* Section 2: How It Works */}
        <HowItWorks />

        {/* Section 3: Why It's Necessary */}
        <WhyNecessary />

        {/* Section 4: Interactive Quishing Scanner Studio (Live Camera, Upload, URL, Scenarios, History) */}
        <ScannerDashboard
          onAskAi={handleAskAi}
          onReportChange={setActiveReport}
        />

        {/* Section 5: Contact & Enterprise Request */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* ShieldAI Quishing Intelligence Chatbot Widget */}
      <AiChatWidget
        isOpen={isChatOpen}
        onToggle={setIsChatOpen}
        activeReport={activeReport}
      />
    </div>
  );
}
