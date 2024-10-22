"use client";

// Import necessary libraries and hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth"; // Firebase authentication functions
import { auth } from "../utils/firebase"; // Importing configured Firebase instance
import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
  // State variables to manage form input and feedback
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false); // For email verification status
  const [emailError, setEmailError] = useState(""); // For displaying errors
  const [passwordError, setPasswordError] = useState(""); // For displaying password errors
  const [loading, setLoading] = useState(false); // For loading state during signup
  const router = useRouter(); // Next.js router for navigation

  // Function to validate the password
  const validatePassword = (password) => {
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowercase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    return null; // Password is valid
  };

  // Function to handle sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate the password before proceeding
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return; // Stop the form submission if the password is invalid
    }

    try {
      setLoading(true); // Start loading spinner
      setPasswordError(""); // Clear any previous password errors

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification to the new user
      await sendEmailVerification(user);
      setEmailSent(true); // Set state to true indicating email was sent

      // Redirect user to email verification page after a short delay
      setTimeout(() => {
        router.push("/verify-email");
      }, 3000);
    } catch (error) {
      console.error("Sign Up Error:", error); // Log any error that occurs
      setEmailSent(false);
      setEmailError(error.message || "An error occurred. Please try again."); // Display error message
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 items-center gap-4 h-full">
        {/* Left-side image section */}
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

        {/* Sign-up form section */}
        <div className="w-full p-6 bg-white rounded-lg">
          <form onSubmit={handleSignUp}>
            {/* Form header */}
            <div className="mb-8">
              <h3 className="text-gray-800 text-3xl font-extrabold">Sign Up</h3>
              <p className="text-sm mt-4 text-gray-600">
                Already have an account{" "}
                <Link
                  href={"/signin"}
                  className="text-blue-600 font-semibold hover:underline ml-1 whitespace-no-wrap"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Email input field */}
            <div>
              <label className="text-gray-800 text-[15px] mb-2 block">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-white px-4 py-3.5 rounded-md outline-blue-600 border border-gray-300"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                />
              </div>
            </div>

            {/* Password input field */}
            <div className="mt-4">
              <label className="text-gray-800 text-[15px] mb-2 block">
                Password
              </label>
              <div className="relative flex flex-col">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-white px-4 py-3.5 rounded-md outline-blue-600 border border-gray-300"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                />
              </div>
              {/* Display password error if any */}
              {passwordError && (
                <p className="mt-2 text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            {/* Password strength information */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Password must contain at least 6 characters, including one uppercase letter, one lowercase letter, one number, and one special character.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Signing Up..." : "Sign Up"} 
            </button>

            {/* Success message when email is sent */}
            {emailSent && (
              <p className="mt-4 text-green-500 text-sm">
                Verification email sent! Please check your inbox.
              </p>
            )}

            {/* Error message display */}
            {emailError && (
              <p className="mt-4 text-red-500 text-sm">{emailError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
