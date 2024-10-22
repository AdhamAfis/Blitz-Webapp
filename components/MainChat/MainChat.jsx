"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faClock, faDonate, faDollarSign, faBook, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import './MainChat.css';
import { Context } from "../context/Context";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from "@/app/utils/firebase";

const MainChat = () => {
  // Initialize the router for navigation
  const router = useRouter();
  
  // Auth state for Firebase authentication
  const [user, loadingAuth] = useAuthState(auth);
  
  // Hook for handling sign out
  const [signOut, isSigningOut, signOutError] = useSignOut(auth);
  
  // State for blocking typing during message sending
  const [isTypingBlocked, setIsTypingBlocked] = useState(false);
  
  // State for handling errors during message sending
  const [sendError, setSendError] = useState(null);

  // Extract context values from Context provider
  const {
    onSent,        // Function to send chat prompts
    recentPrompt,  // Last sent prompt
    showResults,   // Whether to show chat results
    loading,       // Loading state during message processing
    resultData,    // Response data from the chat
    setInput,      // Function to set the input value
    input,         // Current input value
  } = useContext(Context);

  // Redirect to sign-in if the user is not authenticated
  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/signin');
    }
  }, [user, loadingAuth, router]);

  // Handles preset prompt card clicks
  const handleCardClick = (promptText) => {
    setInput(promptText);
    handleSend(promptText); // Directly send the prompt when clicked
  };

  // Handles pressing the Enter key to send a message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isTypingBlocked) {
      handleSend(input); // Send the current input
    }
  };

  // Function to send the current input as a chat prompt
  const handleSend = async (prompt) => {
    setIsTypingBlocked(true);
    setSendError(null);
    try {
      await onSent(prompt); // Send the prompt to the API
    } catch (error) {
      setSendError("Failed to send the request. Please try again.");
    } finally {
      setIsTypingBlocked(false);
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Unblock typing once loading is finished
  useEffect(() => {
    if (!loading) {
      setIsTypingBlocked(false);
    }
  }, [loading]);

  // Display a loading message while authentication is in progress
  if (loadingAuth || !user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="main">
      <div className="nav">
        <p>Blitz</p>
        <div className="user-info">
          <button onClick={handleLogout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>
      <div className="main-container">
        {!showResults ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, </span>
              </p>
              <p>How Can I Help You Today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={() => handleCardClick("Library Working Hours")}>
                <p>Library Working Hours</p>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="card" onClick={() => handleCardClick("How to Donate a Book")}>
                <p>How to Donate a Book</p>
                <FontAwesomeIcon icon={faDonate} />
              </div>
              <div className="card" onClick={() => handleCardClick("Library Entry Fees")}>
                <p>Library Entry Fees</p>
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div className="card" onClick={() => handleCardClick("Tell Me About the Library")}>
                <p>Tell Me About the Library</p>
                <FontAwesomeIcon icon={faBook} />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <FontAwesomeIcon icon={faUser} />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter the Prompt Here"
              onKeyDown={handleKeyDown}
              disabled={isTypingBlocked}
            />
            <div>
              <FontAwesomeIcon
                icon={faPaperPlane}
                onClick={() => {
                  if (!isTypingBlocked) handleSend(input);
                }}
              />
            </div>
          </div>
          {sendError && <p className="error">{sendError}</p>}
          <div className="bottom-info">
            <p>
              Blitz may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;