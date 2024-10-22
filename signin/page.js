"use client"; // Enable client-side rendering for this component

import { useState, useEffect } from "react"; // Import hooks from React
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth"; // Import Firebase authentication hooks
import { auth } from "../utils/firebase"; // Import Firebase configuration
import { useRouter } from "next/navigation"; // Import useRouter hook from Next.js
import Link from "next/link"; // Import Link component from Next.js for client-side navigation
import Image from "next/image"; // Import Image component from Next.js for optimized image handling

export default function SignIn() {
  // State variables for email, password, verification status, and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hooks for Firebase authentication with email/password and Google sign-in
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  // State variables for handling email verification
  const [emailVerified, setEmailVerified] = useState(true);
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const router = useRouter(); // Initialize Next.js router

  // Effect to check and handle email verification status after sign-in
  useEffect(() => {
    const verifyUser = async () => {
      if (user) {
        const currentUser = auth.currentUser; // Get the current authenticated user
        if (currentUser) {
          await currentUser.reload(); // Reload user data to get updated info
          setEmailVerified(currentUser.emailVerified); // Update email verification status
          if (currentUser.emailVerified) {
            router.push("/chat"); // Redirect to the chat page if email is verified
          } else {
            setVerificationError(
              "Your email is not verified. Please verify your email to continue."
            );
          }
        }
      }
      if (googleUser) {
        const currentGoogleUser = auth.currentUser;
        if (currentGoogleUser) {
          await currentGoogleUser.reload();
          setEmailVerified(currentGoogleUser.emailVerified);
          if (currentGoogleUser.emailVerified) {
            router.push("/chat");
          } else {
            setVerificationError(
              "Your email is not verified. Please verify your email to continue."
            );
          }
        }
      }
    };
    verifyUser(); // Run the verification check whenever user or googleUser changes
  }, [user, googleUser, router]);

  // Handle email/password sign-in
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(email, password);
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  // Handle resend of verification email
  const handleResendVerification = async () => {
    setVerificationLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.sendEmailVerification(); // Send verification email
        setVerificationError(
          "A new verification email has been sent. Please check your email."
        );
      }
    } catch (err) {
      setVerificationError(
        "Failed to send verification email. Please try again."
      );
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 items-center gap-4 h-full">
        {/* Left side image section */}
        <div className="max-md:order-1 lg:col-span-2 md:h-screen w-full bg-[#000842] md:rounded-tr-xl md:rounded-br-xl lg:p-12 p-8">
          <Image
            src="https://www.bibalex.org/en/images/balogo-white.svg"
            className="lg:w-[70%] w-full h-full object-contain block mx-auto"
            alt="login-image"
            layout="responsive"
            width={700}
            height={475}
          />
        </div>

        {/* Right side form section */}
        <div className="w-full p-6">
          <form onSubmit={handleEmailSignIn}>
            <div className="mb-8">
              <h3 className="text-gray-800 text-3xl font-extrabold">Sign In</h3>
              <p className="text-sm mt-4 text-gray-800">
                Don&apos;t have an account?
                <Link
                  href={"/signup"}
                  className="text-blue-600 font-semibold hover:underline ml-1 whitespace-no-wrap"
                >
                  Register
                </Link>
              </p>
            </div>

            {/* Email input */}
            <div>
              <label className="text-gray-800 text-[15px] mb-2 block">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mt-4">
              <label className="text-gray-800 text-[15px] mb-2 block">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember me checkbox and Reset Password link */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm">
                  Remember me
                </label>
              </div>
              <div>
                <Link
                  href={"/forgot-password"}
                  className="text-blue-600 font-semibold hover:underline ml-1 whitespace-no-wrap"
                >
                  Reset Password
                </Link>
              </div>
            </div>

            {/* Sign In button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-6 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                disabled={loading}
              >
                Sign in
              </button>
            </div>

            {/* Divider with "or" text */}
            <div className="my-4 flex items-center gap-4">
              <hr className="w-full border-gray-300" />
              <p className="text-sm text-gray-800 text-center">or</p>
              <hr className="w-full border-gray-300" />
            </div>

            {/* Google Sign In button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-4 py-3 px-6 text-sm tracking-wide text-gray-800 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
              disabled={googleLoading}
            >
              {/* Google logo SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                className="inline"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#fbbb00"
                  d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                ></path>
                <path
                  fill="#518ef8"
                  d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                ></path>
                <path
                  fill="#28b446"
                  d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                ></path>
                <path
                  fill="#f14336"
                  d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                ></path>
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Display error or verification message if present */}
          {(error || googleError || verificationError) && (
            <p className="mt-4 text-red-600">
              {error?.message || googleError?.message || verificationError}
            </p>
          )}

          {/* Resend verification email button */}
          {!emailVerified && (
            <button
              type="button"
              onClick={handleResendVerification}
              className="w-full mt-4 py-3 px-6 text-sm tracking-wide rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
              disabled={verificationLoading}
            >
              Resend Verification Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
