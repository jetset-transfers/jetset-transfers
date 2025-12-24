'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after component mounts
    router.replace('/en');
  }, [router]);

  // Show nothing while redirecting
  return null;
}
