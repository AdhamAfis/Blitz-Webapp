# Blitz Chatbot Webapp

This project demonstrates how to integrate a custom OpenAI-based chatbot into a Next.js application. It includes a backend API that interacts with the OpenAI model and a frontend interface for users to submit prompts and receive streaming responses. Additionally, it includes Firebase authentication features for user login, signup, Google sign-in, reset password, and email confirmation.

## Features

- **Custom Dify Integration**: Uses a locally hosted Dify API.
- **Streaming Responses**: The frontend receives and displays responses in real-time.
- **Interactive UI**: Simple form interface for users to input prompts and view responses.
- **Firebase Authentication**: User login, signup, Google sign-in, reset password, and email confirmation.

## Technologies

- **Next.js**: A React framework for building server-side rendered applications.
- **ReactMarkdown**: For rendering markdown in React.
- **SyntaxHighlighter**: For code syntax highlighting.
- **Firebase**: For authentication and real-time database.
- **Tailwind CSS**: For styling.
- **react-firebase-hooks**: For Firebase authentication hooks.

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- NPM (v6.x or later) or Yarn (v1.x or later)
- Local Dify API server
- Firebase project setup

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Hady-Hassan/Blitz-ChatBot.git
   cd Blitz-ChatBot
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up your environment variables:**

   Create a `.env` file in the root directory and add your OpenAI API key, base URL, and Firebase configuration.

   ```plaintext
   API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
   ```

### Running the Application

1. **Start the Next.js development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser and navigate to** [http://localhost:3000](http://localhost:3000).

## Usage

1. **Authentication:**
   - Sign up or log in using email/password or Google sign-in.
   - Confirm your email if required.
   - Reset your password if forgotten.

2. **Chat Interface:**
   - Enter your prompt in the input field.
   - Click the "Submit" button.
   - View the streaming response below the form.

## Firebase Authentication Integration

The project includes the following Firebase authentication features:

- **Login**: Allows users to log in with email and password.
- **Signup**: New users can create an account.
- **Google Sign-In**: Users can sign in with their Google account.
- **Reset Password**: Users can reset their password if they forget it.
- **Email Confirmation**: Users must confirm their email after signing up.
