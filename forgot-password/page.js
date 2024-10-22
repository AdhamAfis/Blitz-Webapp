"use client"; // This directive ensures the component is rendered on the client side.

import { useState } from "react"; // Importing useState hook from React for state management.
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth"; // Importing the hook to send password reset email.
import { auth } from "../utils/firebase"; // Importing the Firebase authentication instance.
import Link from "next/link"; // Importing Link component for navigation between pages.
import Image from "next/image"; // Importing Image component for optimized image rendering.

export default function ForgotPassword() {
  // Component for handling password reset functionality.

  const [email, setEmail] = useState(""); // State to store the user's email input.
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth); 
  // Destructuring the sendPasswordResetEmail function, sending status, and error message from the hook.

  const handleResetPassword = async (e) => {
    // Function to handle form submission for password reset.
    e.preventDefault(); // Prevent default form submission behavior.
    await sendPasswordResetEmail(email); // Send the password reset email to the provided email.
  };

  return (
    <div className="font-[sans-serif]">
      {/* Main container with a custom sans-serif font */}

      <div className="grid lg:grid-cols-3 md:grid-cols-2 items-center gap-4 h-full">
        {/* Grid layout to position the form and image side by side on larger screens */}

        <div className="max-md:order-1 lg:col-span-2 md:h-screen w-full bg-[#000842] md:rounded-tr-xl md:rounded-br-xl lg:p-12 p-8">
          {/* Container for the image with background color and padding */}
          <Image
            src="https://www.bibalex.org/en/images/balogo-white.svg"
            className="lg:w-[70%] w-full h-full object-contain block mx-auto"
            alt="login-image"
            layout="responsive"
            width={700}
            height={475}
          />
          {/* Logo image, responsive and centered */}
        </div>

        <div className="w-full p-6">
          {/* Container for the form with padding */}
          <form onSubmit={handleResetPassword}>
            {/* Form submission is handled by the handleResetPassword function */}

            <div className="mb-8">
              {/* Section for the title and sign-in link */}
              <h3 className="text-gray-800 text-3xl font-extrabold">Forgot Password</h3>
              {/* Main heading for the form */}
              <p className="text-sm mt-4 text-gray-800">
                Remember your password?{" "}
                <Link
                  href={"/signin"}
                  className="text-blue-600 font-semibold hover:underline ml-1 whitespace-no-wrap"
                >
                  Sign In
                </Link>
                {/* Link to the sign-in page if the user remembers their password */}
              </p>
            </div>

            <div>
              {/* Section for the email input field */}
              <label className="text-gray-800 text-[15px] mb-2 block">Email</label>
              {/* Label for the email input */}
              <div className="relative flex items-center">
                {/* Container for the input field */}
                <input
                  name="email"
                  type="text"
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Input field for the email, with state update on change
                />
              </div>
            </div>

            <div className="mt-8">
              {/* Section for the submit button */}
              <button
                type="submit"
                className="w-full py-3 px-6 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                disabled={sending}
              >
                {sending ? "Sending Email..." : "Send Reset Email"}
                {/* Button to submit the form, showing "Sending Email..." while the email is being sent */}
              </button>
            </div>

            {error && <p className="text-red-500 mt-4">{error.message}</p>}
            {/* Display an error message if there is an error during email sending */}
          </form>
        </div>
      </div>
    </div>
  );
}
