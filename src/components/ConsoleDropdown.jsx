import React, { useEffect, useRef, useState } from 'react';

/** A button that opens a small menu of console links (Lab/Clinic/Hospital) — used for both
 *  "Console Login" and "Register Branch", which each just need a different set of link targets.
 *  Closes on an outside click or on Escape. */
export default function ConsoleDropdown({ label, links, buttonClassName = 'btn btn-secondary', fullWidth = false }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="console-dropdown" ref={containerRef} style={fullWidth ? { width: '100%' } : undefined}>
      <button
        type="button"
        className={buttonClassName}
        style={fullWidth ? { width: '100%' } : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{ marginLeft: '6px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="console-dropdown-menu" role="menu">
          {links.map((item) => (
            <a key={item.name} href={item.url} className="console-dropdown-item" role="menuitem" onClick={() => setOpen(false)}>
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
