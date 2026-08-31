'use client';

import React, { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root application route error:', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '32px 20px',
        textAlign: 'center',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          padding: '36px',
          borderRadius: '16px',
          border: '1px solid #efe7d8',
          boxShadow: '0 8px 30px rgba(18, 63, 60, 0.08)',
        }}
      >
        <h2 style={{ color: '#123f3c', marginTop: 0, fontSize: '22px' }}>
          Unable to load page
        </h2>
        <p
          style={{
            color: 'rgba(28, 37, 36, 0.7)',
            fontSize: '14px',
            lineHeight: 1.6,
            margin: '12px 0 24px 0',
          }}
        >
          We encountered an error while loading this page. Please try again.
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
    </div>
  );
}
