'use client';

import React, { Suspense } from 'react';
import IntakeFlow from '@/components/intake/IntakeFlow';

export default function PublicIntakePage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Intake Form...</div>}>
      <IntakeFlow />
    </Suspense>
  );
}
