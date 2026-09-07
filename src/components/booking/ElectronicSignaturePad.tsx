'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './ElectronicSignaturePad.module.css';
import {
  PenTool,
  Type,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ElectronicSignaturePadProps {
  initialName?: string;
  onSignatureChange: (data: {
    legalName: string;
    signatureDataUrl: string | null;
    isComplete: boolean;
  }) => void;
}

export default function ElectronicSignaturePad({
  initialName = '',
  onSignatureChange,
}: ElectronicSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastDrawnImageRef = useRef<string | null>(null);

  const [legalName, setLegalName] = useState<string>(() => initialName || '');
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  });
  const [selectedFont, setSelectedFont] = useState<'cursive' | 'script' | 'serif'>('cursive');

  // Canvas Setup with HiDPI support and stroke recovery
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.4;

      // Restore previously drawn signature if exists
      if (lastDrawnImageRef.current) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
        };
        img.src = lastDrawnImageRef.current;
      }
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    const handleResize = () => {
      setupCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas, mode]);

  // Generate stylized signature image when in 'type' mode
  const generateTypedSignatureImage = useCallback(
    (name: string, font: 'cursive' | 'script' | 'serif'): string | null => {
      if (!name.trim()) return null;
      const offscreen = document.createElement('canvas');
      offscreen.width = 500;
      offscreen.height = 140;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 500, 140);

      ctx.fillStyle = '#0f172a';
      let fontSpec = "34px 'Brush Script MT', 'Dancing Script', cursive, sans-serif";
      if (font === 'serif') fontSpec = "italic bold 30px 'Georgia', serif";
      if (font === 'script') fontSpec = "32px 'Segoe Script', 'Great Vibes', cursive";

      ctx.font = fontSpec;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name.trim(), 250, 70);

      return offscreen.toDataURL('image/png');
    },
    []
  );

  const onSignatureChangeRef = useRef(onSignatureChange);
  useEffect(() => {
    onSignatureChangeRef.current = onSignatureChange;
  });

  const lastEmittedRef = useRef<{
    legalName: string;
    signatureDataUrl: string | null;
    isComplete: boolean;
  }>({
    legalName: '',
    signatureDataUrl: null,
    isComplete: false,
  });

  // Notify parent on state change
  useEffect(() => {
    let finalSignature: string | null = null;
    let isComplete = false;

    if (mode === 'draw') {
      if (hasDrawn && signatureData && legalName.trim().length >= 2) {
        finalSignature = signatureData;
        isComplete = true;
      }
    } else {
      if (legalName.trim().length >= 2) {
        finalSignature = generateTypedSignatureImage(legalName, selectedFont);
        isComplete = Boolean(finalSignature);
      }
    }

    const payload = {
      legalName: legalName.trim(),
      signatureDataUrl: finalSignature,
      isComplete,
    };

    if (
      lastEmittedRef.current.legalName !== payload.legalName ||
      lastEmittedRef.current.signatureDataUrl !== payload.signatureDataUrl ||
      lastEmittedRef.current.isComplete !== payload.isComplete
    ) {
      lastEmittedRef.current = payload;
      onSignatureChangeRef.current(payload);
    }
  }, [legalName, mode, hasDrawn, signatureData, selectedFont, generateTypedSignatureImage]);

  // Drawing Handlers
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if ('touches' in e) {
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      lastDrawnImageRef.current = dataUrl;
      setSignatureData(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);
    lastDrawnImageRef.current = null;
    setHasDrawn(false);
    setSignatureData(null);
  };

  return (
    <div className={styles.signatureContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleArea}>
          <PenTool size={16} color="#059669" />
          <h4 className={styles.title}>Electronic Signature</h4>
          <span className={styles.badgeRequired}>Required</span>
        </div>
        {timestamp && (
          <div className={styles.timestampNotice}>
            <Clock size={13} />
            <span>Signing Date: {timestamp}</span>
          </div>
        )}
      </div>

      {/* Legal Name Input */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel} htmlFor="legalNameInput">
          Full Legal Name (as typed electronic signature)
        </label>
        <input
          id="legalNameInput"
          type="text"
          className={styles.textInput}
          placeholder="e.g. Johnathan Doe"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          required
        />
      </div>

      {/* Mode Selector */}
      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'draw' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('draw')}
        >
          <PenTool size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Draw Signature
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'type' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('type')}
        >
          <Type size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Type Stylized Signature
        </button>
      </div>

      {mode === 'draw' ? (
        <>
          {/* HTML5 Canvas Drawing Area */}
          <div
            className={`${styles.canvasWrapper} ${
              hasDrawn ? styles.canvasWrapperActive : ''
            }`}
          >
            <canvas
              ref={canvasRef}
              className={styles.canvasElement}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />

            {!hasDrawn && (
              <div className={styles.placeholderOverlay}>
                <PenTool size={20} />
                <span>Draw your electronic signature using your mouse, trackpad, or touch screen</span>
              </div>
            )}

            <div className={styles.signLine}>
              <span className={styles.signLineX}>✕</span>
            </div>
          </div>

          <div className={styles.canvasActions}>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearCanvas}
            >
              <RotateCcw size={13} /> Clear / Redraw
            </button>
            <div className={styles.statusIndicator}>
              {hasDrawn && legalName.trim().length >= 2 ? (
                <span className={styles.statusIndicatorSigned}>
                  <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '3px' }} />
                  Signature Captured
                </span>
              ) : (
                <span className={styles.statusIndicatorEmpty}>
                  Please sign above &amp; enter your legal name
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Stylized Typed Signature Mode */
        <div>
          <div className={styles.stylizedSignatureBox}>
            {legalName.trim() || 'Your Signature'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className={styles.fontSelector}>
              <button
                type="button"
                className={`${styles.fontBtn} ${selectedFont === 'cursive' ? styles.fontBtnActive : ''}`}
                onClick={() => setSelectedFont('cursive')}
              >
                Style 1 (Handwritten)
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${selectedFont === 'script' ? styles.fontBtnActive : ''}`}
                onClick={() => setSelectedFont('script')}
              >
                Style 2 (Script)
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${selectedFont === 'serif' ? styles.fontBtnActive : ''}`}
                onClick={() => setSelectedFont('serif')}
              >
                Style 3 (Italic Serif)
              </button>
            </div>
            <div className={styles.statusIndicator}>
              {legalName.trim().length >= 2 ? (
                <span className={styles.statusIndicatorSigned}>
                  <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '3px' }} />
                  Signature Valid
                </span>
              ) : (
                <span className={styles.statusIndicatorEmpty}>Enter your legal name above</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
