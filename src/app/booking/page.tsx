'use client';

import React, { Suspense } from 'react';
import BookingFlow from '@/components/booking/BookingFlow';

export default function PublicBookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Booking...</div>}>
      <BookingFlow />
    </Suspense>
  );
}
