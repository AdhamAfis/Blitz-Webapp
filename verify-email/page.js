import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

"use client";

export default function VerifyEmail() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Start a timer that runs every second
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/signin'); // Redirect to the sign-in page when countdown reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-gray-700 mb-4">
          We have sent a verification link to your email address. Please check your inbox (and spam folder) and verify your email to complete the registration process.
        </p>
        <p className="text-gray-500">
          Redirecting to sign-in page in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
