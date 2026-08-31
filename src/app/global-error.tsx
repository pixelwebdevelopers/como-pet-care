'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#f7f4ed',
          color: '#1c2524',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            backgroundColor: '#ffffff',
            padding: '36px',
            borderRadius: '16px',
            border: '1px solid #efe7d8',
            boxShadow: '0 8px 30px rgba(18, 63, 60, 0.08)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#123f3c', marginTop: 0, fontSize: '22px' }}>
            Something went wrong
          </h2>
          <p
            style={{
              color: 'rgba(28, 37, 36, 0.7)',
              fontSize: '14px',
              lineHeight: 1.6,
              margin: '12px 0 24px 0',
            }}
          >
            An unexpected error occurred. Please try reloading the application.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              backgroundColor: '#123f3c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
