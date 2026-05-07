import { useState, useEffect, useRef } from 'react';
import {
  BACKENDS,
  type BackendType,  
  getActiveBackend,
  setActiveBackend,
} from '../config/apiConfig';

interface BackendSwitcherProps {
  onChange?: (backend: BackendType) => void;
}

export default function BackendSwitcher({ onChange }: BackendSwitcherProps) {
  const [active, setActive] = useState<BackendType>(getActiveBackend());
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ping the backend health endpoint when selection changes
  useEffect(() => {
    setStatus('checking');
    const url = BACKENDS[active].url;
    fetch(`${url}/health`, { signal: AbortSignal.timeout(4000) })
      .then((r) => setStatus(r.ok ? 'ok' : 'error'))
      .catch(() => setStatus('error'));
  }, [active]);

  function handleSelect(backend: BackendType) {
    setActive(backend);
    setActiveBackend(backend);
    setOpen(false);
    onChange?.(backend);
    // Reload page so all existing API calls pick up the new URL
    window.location.reload();
  }

  const statusColors: Record<typeof status, string> = {
    idle: '#6b7280',
    checking: '#f59e0b',
    ok: '#10b981',
    error: '#ef4444',
  };

  const statusLabels: Record<typeof status, string> = {
    idle: '',
    checking: 'Checking…',
    ok: 'Connected',
    error: 'Unreachable',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#e5e7eb',
          fontSize: '13px',
          fontFamily: 'inherit',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)')
        }
      >
        {/* Status dot */}
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: statusColors[status],
            flexShrink: 0,
            transition: 'background 0.3s',
            boxShadow: status === 'ok' ? `0 0 6px ${statusColors.ok}` : 'none',
          }}
        />
        <span style={{ fontWeight: 500 }}>{BACKENDS[active].label}</span>
        <span style={{ color: '#9ca3af', fontSize: '11px' }}>
          {BACKENDS[active].description}
        </span>
        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            marginLeft: '2px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
            opacity: 0.5,
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Status text below button */}
      {status !== 'idle' && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: statusColors[status],
            whiteSpace: 'nowrap',
            marginTop: '2px',
            pointerEvents: 'none',
          }}
        >
          {statusLabels[status]}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            minWidth: '220px',
            background: '#1f2937',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 14px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              fontSize: '11px',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Backend
          </div>

          {/* Options */}
          {(Object.keys(BACKENDS) as BackendType[]).map((key) => {
            const b = BACKENDS[key];
            const isActive = key === active;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#e5e7eb',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                  borderLeft: isActive ? '2px solid #6366f1' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: isActive ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {key === 'ec2' ? '🖥' : key === 'ecs' ? '🐳' : '⚡'}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: isActive ? '#a5b4fc' : '#e5e7eb' }}>
                    {b.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                    {b.description}
                  </div>
                </div>

                {/* Checkmark */}
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7l3 3 6-6"
                      stroke="#6366f1"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}

          {/* Footer showing current URL */}
          <div
            style={{
              padding: '8px 14px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              fontSize: '10px',
              color: '#4b5563',
              fontFamily: 'monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {BACKENDS[active].url}
          </div>
        </div>
      )}
    </div>
  );
}
