"use client"; 
import { createContext, useState } from "react"; 

export const Context = createContext(); 

const ContextProvider = (props) => {
    const [input, setInput] = useState(""); 
    const [recentPrompt, setRecentPrompt] = useState(""); 
    const [prevPrompts, setPrevPrompts] = useState([]); 
    const [showResults, setShowResults] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [resultData, setResultData] = useState(""); 

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData((prev) => prev + nextWord); 
        }, 10 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResults(false);
        setInput(""); // Reset input for a new chat
        setResultData(""); // Clear previous result data
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true); 
        setShowResults(true); 

        let response;

        if (prompt !== undefined) {
            response = await fetchChatResponse(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await fetchChatResponse(input);
        }

        try {
            // Format response for display
            let responseArray = response.split("**"); 
            let formattedResponse = "";

            responseArray.forEach((part, index) => {
                if (index % 2 === 1) {
                    formattedResponse += `<b>${part}</b>`; // Bold formatting for odd indices
                } else {
                    formattedResponse += part;
                }
            });

            formattedResponse = formattedResponse.split("*").join("<br/>"); // Line breaks
            let responseChars = formattedResponse.split("");

            responseChars.forEach((char, index) => {
                delayPara(index, char);
            });
        } catch (error) {
            console.error("Error while processing response:", error);
        } finally {
            setLoading(false); 
            setInput(""); 
        }
    };

    const fetchChatResponse = async (input) => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [{ role: 'user', content: input }] }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
            }

            const reader = response.body.getReader(); 
            const decoder = new TextDecoder('utf-8'); 
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break; 
                result += decoder.decode(value, { stream: true }); 
            }

            return result; 
        } catch (error) {
            console.error('Error in fetchChatResponse function:', error);
            throw error; 
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        input,
        setInput,
        showResults,
        loading,
        resultData,
        newChat,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider; 