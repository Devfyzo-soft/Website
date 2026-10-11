import React, { useState, useEffect } from 'react';
import medTokenLogo from './assets/MedToken Logo.png';
import ConsoleDropdown from './components/ConsoleDropdown';
import { CONSOLE_LINKS, LOGIN_LINKS, SIGNUP_LINKS } from './config/consoleLinks';

export default function App() {
  // Theme State ('dark' | 'light')
  // On the server (pre-render) there is no document; in the browser index.html has already put the saved theme on <html>.
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* private mode: the theme just is not remembered */
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Mobile Nav Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enquiry Form State
  const [enquiryRole, setEnquiryRole] = useState('');
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryMobile, setEnquiryMobile] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryRequirement, setEnquiryRequirement] = useState('');
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  const ENQUIRY_RECIPIENT = 'medtoken.in@gmail.com';
  // To deliver submissions straight to the inbox above without opening the
  // visitor's mail app, get a free access key at https://web3forms.com
  // (enter medtoken.in@gmail.com, no signup needed, key arrives by email)
  // and paste it here. Until a real key is set, the form falls back to
  // opening a pre-filled email via mailto so it still works out of the box.
  const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

  const submitEnquiryByMailto = () => {
    const subject = encodeURIComponent(`New MedToken Enquiry from ${enquiryName || 'Website Visitor'}`);
    const body = encodeURIComponent(
      `Role: ${enquiryRole}\nName: ${enquiryName}\nMobile Number: ${enquiryMobile}\nEmail: ${enquiryEmail}\nRequirement: ${enquiryRequirement}`
    );
    window.location.href = `mailto:${ENQUIRY_RECIPIENT}?subject=${subject}&body=${body}`;
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryError('');
    setEnquirySubmitting(true);

    try {
      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        throw new Error('Email delivery is not configured yet');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New MedToken Enquiry from ${enquiryName}`,
          to: ENQUIRY_RECIPIENT,
          Role: enquiryRole,
          Name: enquiryName,
          'Mobile Number': enquiryMobile,
          Email: enquiryEmail,
          Requirement: enquiryRequirement,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Submission failed');

      setEnquirySubmitted(true);
    } catch (err) {
      // Fallback: open a pre-filled email so the enquiry still reaches the inbox
      submitEnquiryByMailto();
      setEnquirySubmitted(true);
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const resetEnquiryForm = () => {
    setEnquiryRole('');
    setEnquiryName('');
    setEnquiryMobile('');
    setEnquiryEmail('');
    setEnquiryRequirement('');
    setEnquirySubmitted(false);
    setEnquiryError('');
  };

  // Static Web Console Preview Queue Data
  const queue = [
    { token: 'T11', name: 'Priya Suresh', type: 'App', department: 'General OPD', status: 'Calling', time: '9:30 AM · Booked via app' },
    { token: 'T12', name: 'Rajan Mehta', type: 'Walk-in', department: 'Cardiology', status: 'Next', time: 'Walk-in · 10:02 AM' },
    { token: 'T13', name: 'Sunita Nair', type: 'App', department: 'Lab — CBC', status: 'Waiting', time: '10:15 AM · Booked via app', waitTime: '8 min' },
    { token: 'T14', name: 'Arjun Das', type: 'Walk-in', department: 'General OPD', status: 'Waiting', time: 'Walk-in · 10:22 AM', waitTime: '18 min' }
  ];

  const stats = {
    today: 14,
    appBookings: 9,
    walkIns: 5,
    waiting: 3
  };

  return (
    <>
      {/* Background Graphic elements */}
      <div className="bg-gradient-mesh"></div>

      {/* Header / Navbar */}
      <header className="header">
        <div className="nav-container">
          <a href="#" className="logo">
            <img src={medTokenLogo} alt="MedToken Logo" className="logo-img" />
            <span>MedToken</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#home" className="nav-link">Home</a>
            <a href="#solutions" className="nav-link">Solutions</a>
            <a href="#integration" className="nav-link">Integration</a>
            <a href="#security" className="nav-link">Security</a>
            <a href="#enquiry" className="nav-link">Enquiry</a>
          </nav>

          <div className="nav-right">
            <div className="nav-actions">
              <ConsoleDropdown label="Console Login" links={LOGIN_LINKS} buttonClassName="btn btn-secondary" />
              <ConsoleDropdown label="Register Branch" links={SIGNUP_LINKS} buttonClassName="btn btn-tertiary" />
            </div>

            {/* Theme Toggle Button */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              <svg className="icon-sun" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <svg className="icon-moon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </button>

            {/* Mobile Drawer Trigger */}
            <button className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <nav className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <a href="#" className="logo" style={{ fontSize: '1.25rem' }}>
            <img src={medTokenLogo} alt="MedToken Logo" className="logo-img" style={{ width: '64px', height: '64px', margin: '-16px -14px' }} />
            <span>MedToken</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              <svg className="icon-sun" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <svg className="icon-moon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </button>

            <button className="menu-toggle active" onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <ul className="mobile-links" aria-label="Mobile navigation">
          <li><a href="#home" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
          <li><a href="#solutions" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Solutions</a></li>
          <li><a href="#integration" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Integration</a></li>
          <li><a href="#security" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Security</a></li>
          <li><a href="#enquiry" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Enquiry</a></li>
        </ul>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', width: '100%' }}>
          <ConsoleDropdown label="Console Login" links={LOGIN_LINKS} buttonClassName="btn btn-secondary" fullWidth />
          <ConsoleDropdown label="Register Branch" links={SIGNUP_LINKS} buttonClassName="btn btn-tertiary" fullWidth />
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="tagline">
              <span className="tagline-pulse"></span>
              <span>Healthcare Management & Patient Booking</span>
            </div>
            <h1 className="hero-title">
              Complete Healthcare Software for Hospitals, Clinics,<br />
              <span className="text-gradient">
                Labs, Scan Centers & Pharmacies.
              </span>
            </h1>
            <p className="hero-description">
              MedToken brings together Hospital Management System (HMS), Clinic Management Software (CMS), Laboratory Information Management System (LIMS), Radiology Management System (RMS) and Pharmacy Management Software (PMS) in one connected healthcare ecosystem. Patients can use the MedToken app to discover healthcare providers and book appointments or tokens, while providers manage appointments, patient records, queues, billing and daily operations from one platform.
            </p>
            <div className="hero-actions">
              <a href="#console-preview" className="btn btn-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></svg>
                Look at the Dashboard
              </a>
              <ConsoleDropdown
                label={(
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                    Register Facility
                  </>
                )}
                links={SIGNUP_LINKS}
                buttonClassName="btn btn-secondary"
              />
            </div>
          </div>

          <div className="hero-widget">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>3-Way Integration</h3>
                <p className="section-subtitle" style={{ fontSize: '0.9rem' }}>Deploy MedToken according to your technology stack.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="cb-stat" style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', textAlign: 'left', padding: '1rem' }}>
                  <div className="cb-stat-n" style={{ fontSize: '1.4rem' }}>2 Options</div>
                  <div className="cb-stat-l" style={{ textAlign: 'left', fontSize: '0.75rem' }}>Web Console or API Integration</div>
                </div>

                <div className="cb-stat" style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', textAlign: 'left', padding: '1rem' }}>
                  <div className="cb-stat-n" style={{ fontSize: '1.4rem' }}>Zero Setup</div>
                  <div className="cb-stat-l" style={{ textAlign: 'left', fontSize: '0.75rem' }}>Console ready in minutes</div>
                </div>

                <div className="cb-stat" style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', textAlign: 'left', padding: '1rem' }}>
                  <div className="cb-stat-n" style={{ fontSize: '1.4rem' }}>Unified Queue</div>
                  <div className="cb-stat-l" style={{ textAlign: 'left', fontSize: '0.75rem' }}>App bookings + Walk-ins in one view</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="features-section solutions-section">
          <div className="section-header">
            <span className="tagline" style={{ margin: '0 auto 1rem', display: 'flex' }}>Our Solutions</span>
            <h2 className="section-title">Healthcare Software Solutions for Every Facility</h2>
            <p className="section-subtitle">
              A growing suite of healthcare management software for hospitals, clinics, laboratories and pharmacies.
            </p>
          </div>

          <div className="solutions-grid">
            <article className="solution-card">
              <div className="solution-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4h6v4"/><path d="M8 7h1M12 7h1M16 7h1M8 11h1M12 11h1M16 11h1"/></svg>
              </div>
              <div>
                <h3>Hospital Management System (HMS)</h3>
                <p>Manage hospital workflows, billing, appointments, patient records and care operations.</p>
              </div>
            </article>

            <article className="solution-card">
              <div className="solution-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M7 10h10"/><path d="M9 16l2 2 4-5"/></svg>
              </div>
              <div>
                <h3>Clinic Management Software (CMS)</h3>
                <p>Simplify appointments, patient records, token queues and day-to-day clinic operations.</p>
              </div>
            </article>

            <article className="solution-card">
              <div className="solution-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M9 3h6v4l4 4v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2l4-4V3h2v4l-4 4v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2l-4-4V3h2"/><path d="M8 12h8M12 10v4"/></svg>
              </div>
              <div>
                <h3>Laboratory Information Management System (LIMS)</h3>
                <p>Manage samples, testing workflows, laboratory records and reporting in one system.</p>
              </div>
            </article>

            <article className="solution-card">
              <div className="solution-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M10.5 5.5 5.4 10.6a3.5 3.5 0 0 0 5 5l8.1-8.1a3.5 3.5 0 1 0-5-5l-2 2"/><path d="m8 13 3 3"/></svg>
              </div>
              <div>
                <h3>Pharmacy Management Software (PMS)</h3>
                <p>Run a pharmacy end to end: GST-ready billing with barcode scanning, batch-wise stock with low-stock alerts, purchase orders and supplier payments, drug-safety and allergy checks, refill reminders and a controlled-drug register.</p>
              </div>
            </article>

            <article className="solution-card">
              <div className="solution-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/><path d="M12 6.5v2M12 15.5v2M6.5 12h2M15.5 12h2"/></svg>
              </div>
              <div>
                <h3>Radiology Management System (RMS)</h3>
                <p>Run scan and imaging centres: X-ray, CT, MRI and ultrasound worklists, scan images, radiology reports, critical alerts and report sharing with patients.</p>
              </div>
            </article>
          </div>
        </section>

        {/* Integration Section */}
        <section id="integration" className="features-section integration-section">
          <div className="section-header">
            <span className="tagline" style={{ margin: '0 auto 1rem', display: 'flex' }}>Flexible Deployment</span>
            <h2 className="section-title">Pick What Fits Your Facility</h2>
            <p className="section-subtitle">
              No existing system? Use our console. Already have one? Plug in via API. Both keep you fully in control.
            </p>
          </div>

          <div className="features-grid integration-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(29, 78, 216, 0.12)', border: '1px solid rgba(29, 78, 216, 0.25)', color: 'var(--primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></svg>
              </div>
              <div>
                <h3 className="feature-title">MedToken Web Console</h3>
                <p className="feature-description" style={{ marginBottom: '1.75rem' }}>
                  For clinics, labs, and diagnostic centers that need a complete booking and queue management system — without building one.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    "Online bookings from the patient app appear automatically",
                    "Register walk-in patients and assign tokens on the spot",
                    "Unified dashboard — app bookings and walk-ins together",
                    "Call next, hold, skip, or complete tokens in real time",
                    "Manage multiple doctors, departments, or counters",
                    "Built-in pharmacy billing for in-house medical stores",
                    "No technical setup or development"
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span className="checkmark-circle" style={{ marginTop: '3px', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <span className="gap-remedy-badge" style={{ marginTop: '2rem' }}>Web Console Mode</span>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(45, 212, 191, 0.12)', border: '1px solid rgba(45, 212, 191, 0.25)', color: 'var(--tertiary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <div>
                <h3 className="feature-title">API Integration</h3>
                <p className="feature-description" style={{ marginBottom: '1.75rem' }}>
                  For hospitals and large facilities already running their own HMS or custom console — add MedToken's app booking layer without replacing anything.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    "Patients book via MedToken app, data syncs to your system",
                    "Works with any existing Hospital Management System (HMS)",
                    "Real-time two-way sync with your console",
                    "Dedicated API documentation and onboarding support",
                    "Zero disruption to your existing workflows",
                    "Expand your reach to all MedToken app users"
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span className="checkmark-circle" style={{ background: 'var(--primary)', color: '#fff', marginTop: '3px', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <span className="gap-remedy-badge" style={{ color: 'var(--primary)', backgroundColor: 'rgba(29, 78, 216, 0.1)', borderColor: 'rgba(29, 78, 216, 0.2)', marginTop: '2rem' }}>API Sync Mode</span>
            </div>
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="features-section" style={{ borderBottom: '1px solid var(--border-glass)' }}>
          <div className="section-header">
            <span className="tagline" style={{ margin: '0 auto 1rem', display: 'flex' }}>Who is it For</span>
            <h2 className="section-title">Built for Every Kind of Provider</h2>
            <p className="section-subtitle">
              Custom options mapped directly to clinic configurations or enterprise system integrations.
            </p>
          </div>

          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {/* Hospitals */}
            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /><path d="M10 9h4" /><path d="M12 7v4" /></svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Hospitals</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Multi-specialty or single — use API integration to connect MedToken app bookings to your existing HMS. Patients book online; your console stays unchanged.
                </p>
              </div>
            </div>

            {/* Clinics */}
            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ color: 'var(--tertiary)', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5C3.12 15.12 2 13.06 2 11V3h6v8c0 2.06-1.12 4.12-2.5 5.5" /><path d="M12 2v10c0 3.31-2.69 6-6 6h12c-3.31 0-6-2.69-6-6V2" /></svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Clinics</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Single-doctor or poly clinic — use the MedToken web console with zero setup to manage walk-in tokens from day one. Patient app booking for clinics is on the roadmap.
                </p>
              </div>
            </div>

            {/* Diagnostic Labs */}
            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12" /><path d="M12 3v12" /><path d="M5 21h14a2 2 0 0 0 2-2v-4a7 7 0 0 0-5.83-6.88L14 3h-4L8.83 8.12A7 7 0 0 0 3 15v4a2 2 0 0 0 2 2z" /></svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Diagnostic labs</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Coordinate test bookings, walk-in sample collection, and multiple counters. Reduce crowding and manage daily patient volume with ease.
                </p>
              </div>
            </div>

            {/* Scan Centers */}
            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ color: 'var(--tertiary)', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="M2 12h20" /><circle cx="12" cy="12" r="4" /></svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Imaging & scan centers</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Schedule scan and X-ray appointments through the app. Walk-in token management keeps your workflow running without confusion.
                </p>
              </div>
            </div>

            {/* Pharmacies */}
            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 6.5 6 6.5 6 6.5s2 0 4-1c0 0-4 2-4-1.5s6-2.5 6-2.5 3 0 4-3c1-3-1-5-2-5.5z" /><path d="M9 8.5c2.5 0 4.5 1 6 3" /></svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Pharmacy billing</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Attached hospital or standalone pharmacy — generate GST-ready medicine bills, track stock, and link prescriptions straight from the patient record.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Platform Badge Strip */}
        <section id="security" className="security-section">
          <div className="security-container">
            <div className="security-badge-container">
              <span className="security-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                HIPAA COMPLIANT ARCHITECTURE
              </span>
              <span className="security-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                AES-256 ENCRYPTED SYNC
              </span>
            </div>
            <h2 className="security-title">Secured Patient Health Information</h2>
            <p className="security-subtitle">
              We understand that patient data is sensitive. MedToken coordinates using strict verification checks, SMS tokens, and Prisma database structures to isolate and encrypt clinical appointments, making hospital interactions both seamless and compliant.
            </p>
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="features-section" style={{ borderBottom: '1px solid var(--border-glass)' }}>
          <div className="section-header">
            <span className="tagline" style={{ margin: '0 auto 1rem', display: 'flex' }}>Getting Started</span>
            <h2 className="section-title">Up and Running in 4 Steps</h2>
            <p className="section-subtitle">
              Get your facility ready to handle online bookings and walk-in patients in minutes.
            </p>
          </div>

          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {[
              { num: '01', title: 'Register your facility', desc: 'Sign up with your clinic or lab details. Takes less than 5 minutes — no paperwork, no contract.' },
              { num: '02', title: 'Configure your setup', desc: 'Add your departments, doctors, and counters. Choose console mode or connect via API.' },
              { num: '03', title: 'Go live on the app', desc: "Your facility appears on the MedToken patient app instantly. Online bookings start coming in." },
              { num: '04', title: 'Manage your queue', desc: "Handle app bookings and walk-ins from one screen. Control who's called, held, or next." }
            ].map((step, i) => (
              <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.75rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--tertiary)', opacity: '0.8' }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--secondary)' }}>{step.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why MedToken Section */}
        <section id="why-medtoken" className="features-section">
          <div className="section-header">
            <span className="tagline" style={{ margin: '0 auto 1rem', display: 'flex' }}>Why MedToken</span>
            <h2 className="section-title">Built Around Your Workflow</h2>
            <p className="section-subtitle">
              Engineered to bring order, increase clinical efficiency, and keep patient lobbies stress-free.
            </p>
          </div>

          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* Unified View */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--tertiary)', marginBottom: '0.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></svg>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>One unified view</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                App bookings and walk-ins appear on the same screen — no switching between systems or spreadsheets.
              </p>
            </div>

            {/* No Disruption */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--tertiary)', marginBottom: '0.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22v-5M9 8V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5M6 8h12a2 2 0 0 1 2 2v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3a2 2 0 0 1 2-2z" /></svg>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>No disruption</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Already have a system? Our API slots in without changing how your staff works today. So patients can book appointments or tokens seamlessly.
              </p>
            </div>

            {/* Ready in Minutes */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Ready in minutes</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                The web console needs zero development. Sign up, configure, and you're live on the app immediately.
              </p>
            </div>

            {/* Reach More Patients */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--tertiary)', marginBottom: '0.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Reach more patients</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                If Hospitals, labs, and diagnostic centers have existing systems, MedToken integrates seamlessly to get found by every app user nearby searching for an appointment or token.
              </p>
            </div>

            {/* Queue Control */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Queue control</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Call next, hold, skip, or mark complete, full control over the patient queue at any moment.
              </p>
            </div>

            {/* Pharmacy */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="2" width="10" height="20" rx="4" /><path d="M7 12h10" /></svg>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Build In Pharmacy</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Bill medicines with GST-ready invoices, track stock as it moves, and pull up a patient's prescription straight from their token, no separate billing software.
              </p>
            </div>

            {/* Patient App */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--tertiary)', marginBottom: '0.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="10" y1="19" x2="14" y2="19" /></svg>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>App for Patients</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Patients book an appointment or a token at hospitals, labs, and diagnostic centers, so waiting time & standing in 
                queue can be skipped. More facility types and features are coming to the app in future updates.
              </p>
            </div>
          </div>
        </section>

               {/* Web Console Preview Section */}
        <section id="console-preview" className="features-section" style={{ background: 'var(--services-bg)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <span className="tagline" style={{ margin: '0 auto 1rem', display: 'flex' }}>Web Console Preview</span>
            <h2 className="section-title">Everything in One Dashboard</h2>
            <p className="section-subtitle">
              Your complete queue — online bookings from the app and walk-in patients — live, side by side.
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <img
              src="/console-preview.png"
              alt="MedToken Web Console Preview"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '16px'
              }}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-section" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.12) 0%, transparent 70%)', borderTop: 'none', borderBottom: 'none', padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Ready to streamline your patient flow?</h2>
            <p className="hero-description" style={{ color: 'var(--text-muted)' }}>
              Whether you need a plug-and-play console or a deep API integration — MedToken is ready. Get started in minutes, no commitment required.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <ConsoleDropdown label="Register Your Facility" links={SIGNUP_LINKS} buttonClassName="btn btn-primary" />
              <button onClick={() => alert('Support team notified! We will contact you at your email registered or via standard channels.')} className="btn btn-secondary">
                Talk to Our Team
              </button>
            </div>
          </div>
        </section>

        {/* Enquiry Section */}
        <section id="enquiry" className="features-section enquiry-section">
          <div className="section-header">
            <h2 className="section-title">Send Us an Enquiry</h2>
            <p className="hero-description" style={{ color: 'var(--text-muted)' }}>
              Tell us a bit about your facility and what you need — we'll get back to you at {ENQUIRY_RECIPIENT}.
            </p>
          </div>

          <div className="enquiry-form-wrapper">
            {!enquirySubmitted ? (
              <form onSubmit={handleEnquirySubmit} className="enquiry-form">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    value={enquiryRole}
                    onChange={(e) => setEnquiryRole(e.target.value)}
                    className="input-text-standard"
                    required
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="Admin">Admin</option>
                    <option value="Owner">Owner</option>
                    <option value="Receptionist">Receptionist</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    className="input-text-standard"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={enquiryMobile}
                    onChange={(e) => setEnquiryMobile(e.target.value)}
                    className="input-text-standard"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    placeholder="you@hospital.com"
                    value={enquiryEmail}
                    onChange={(e) => setEnquiryEmail(e.target.value)}
                    className="input-text-standard"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Requirement</label>
                  <select
                    value={enquiryRequirement}
                    onChange={(e) => setEnquiryRequirement(e.target.value)}
                    className="input-text-standard"
                    required
                  >
                    <option value="" disabled>Select what you need</option>
                    <option value="HMS">HMS</option>
                    <option value="CMS">CMS</option>
                    <option value="LIMS">LIMS</option>
                    <option value="RMS">RMS (Radiology)</option>
                    <option value="Already have a system?">Already have a system?</option>
                  </select>
                  {enquiryRequirement === 'Already have a system?' && (
                    <p className="form-hint">
                      Integrate your existing system with the MedToken patient app so patients can book appointments or tokens directly.
                    </p>
                  )}
                </div>

                {enquiryError && (
                  <p className="form-hint" style={{ color: '#ef4444' }}>{enquiryError}</p>
                )}

                <button type="submit" className="btn btn-primary" disabled={enquirySubmitting} style={{ width: '100%', marginTop: '0.5rem' }}>
                  {enquirySubmitting ? 'Sending...' : 'Submit Enquiry'}
                </button>
              </form>
            ) : (
              <div className="enquiry-success">
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Thank you!</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Your enquiry has been sent to {ENQUIRY_RECIPIENT}. Our team will get back to you shortly.
                </p>
                <button className="btn btn-secondary" onClick={resetEnquiryForm}>
                  Submit Another Enquiry
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={medTokenLogo} alt="MedToken Logo" className="footer-logo-img" />
            <span>MedToken</span>
          </div>

          <div className="footer-social">
            <a
              href="https://www.instagram.com/medtoken.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="MedToken on Instagram"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/medtoken.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="MedToken on Facebook"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.28C16.3 4.2 15.42 4.13 14.4 4.13c-2.2 0-3.7 1.34-3.7 3.8v2.57H8.2v3h2.5V21h2.8z" />
              </svg>
            </a>
          </div>

          <p className="footer-copyright">
           © {new Date().getFullYear()} <a href="https://devfyzosoft.com/" target="_blank" rel="noopener noreferrer">Devfyzo Soft.</a> All rights reserved.
            <a href={CONSOLE_LINKS.platform.login} className="footer-platform-link">Platform Login</a>
          </p>
        </div>
      </footer>
    </>
  );
}
