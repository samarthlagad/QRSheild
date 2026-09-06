import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { QrCode, ShieldAlert, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onScanClick: () => void;
}

export function Navbar({ onScanClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E5E5DC] paper-shadow'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          className="focus:outline-none"
          id="nav-logo-link"
        >
          <Logo size={isScrolled ? 34 : 38} />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('home')}
            className="text-sm font-medium text-[#61615B] hover:text-[#1A1A1A] transition-colors"
            id="nav-home"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-[#61615B] hover:text-[#1A1A1A] transition-colors"
            id="nav-how-it-works"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('why-necessary')}
            className="text-sm font-medium text-[#61615B] hover:text-[#1A1A1A] transition-colors"
            id="nav-why-necessary"
          >
            Why It's Necessary
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-sm font-medium text-[#61615B] hover:text-[#1A1A1A] transition-colors"
            id="nav-contact"
          >
            Contact
          </button>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => {
              onScanClick();
              scrollToSection('scanner-section');
            }}
            id="nav-scan-cta"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-[#4338CA] text-white hover:bg-[#3730A3] active:scale-[0.98] transition-all paper-shadow cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan a QR Code</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#1A1A1A] hover:bg-black/5"
          aria-label="Toggle menu"
          id="nav-mobile-toggle"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5DC] bg-[#FAFAF8] px-4 py-4 space-y-3 paper-shadow">
          <button
            onClick={() => scrollToSection('home')}
            className="block w-full text-left py-2 text-sm font-medium text-[#1A1A1A]"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm font-medium text-[#1A1A1A]"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('why-necessary')}
            className="block w-full text-left py-2 text-sm font-medium text-[#1A1A1A]"
          >
            Why It's Necessary
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-2 text-sm font-medium text-[#1A1A1A]"
          >
            Contact
          </button>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onScanClick();
                scrollToSection('scanner-section');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#4338CA] text-white hover:bg-[#3730A3]"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan a QR Code</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
