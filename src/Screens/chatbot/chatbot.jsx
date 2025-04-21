
// import React, { useState, useEffect, useRef } from "react";
// import "./Chatbot.css"; // Import CSS file for styling
// import axios from "axios";
// import { FiSend } from "react-icons/fi"; // Import send icon

// const AiAssistant = () => {
//   const [query, setQuery] = useState("");
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [history, loading]);

//   const handleQueryChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const handleQuerySubmit = async () => {
//     if (!query.trim()) return;

//     setLoading(true);
//     const userMessage = { user: query, bot: "Typing..." }; // Temporary typing state
//     setHistory((prevHistory) => [...prevHistory, userMessage]);

//     try {
//       const res = await axios.post("http://localhost:3000/ask", { question: query });
//       console.log("Raw API Response:", res.data['answer']['response']);

//       // Extract response correctly
//       const responseText = res.data.response?.answer || res.data.answer.response || "I'm sorry, I didn't understand that.";

//       // Ensure it's a string before rendering
//       setHistory((prevHistory) =>
//         prevHistory.map((msg, index) =>
//           index === prevHistory.length - 1
//             ? { ...msg, bot: typeof responseText === "string" ? responseText : JSON.stringify(responseText) }
//             : msg
//         )
//       );
//     } catch (error) {
//       console.error("Error calling backend:", error);
//       setHistory((prevHistory) =>
//         prevHistory.map((msg, index) =>
//           index === prevHistory.length - 1 ? { ...msg, bot: "An error occurred. Please try again." } : msg
//         )
//       );
//     }

//     setLoading(false);
//     setQuery("");
//   };



//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <h2>AI Assistant</h2>
//       </div>

//       <div className="chatbox">
//         <div className="messages">
//           {history.map((item, index) => (
//             <div key={index} className="message-pair">
//               <div className="user-message">{item.user}</div>
//               <div className="bot-message">{item.bot}</div>
//             </div>
//           ))}
//           {loading && <div className="bot-message">Typing...</div>}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="input-section">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             value={query}
//             onChange={handleQueryChange}
//             className="query-input"
//             disabled={loading}
//           />

//           <button onClick={handleQuerySubmit} disabled={loading || !query.trim()} className="submit-btn">
//             <FiSend size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AiAssistant;




import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { FaVolumeUp } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";


const AiAssistant = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to latest message whenever history or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // Function to start voice recognition
  const startVoiceToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript); // Display recognized text in the input field
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };


  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      console.error("❌ Query is empty.");
      return;
    }
  
    setLoading(true);
    console.log("📤 Sending query:", query);
  
    // Add user message with placeholder for bot
    setHistory((prevHistory) => [
      ...prevHistory,
      { user: query, bot: "Typing..." },
    ]);
  
    try {
      console.log("🌍 Calling backend API...");
      const res = await axios.post(
        "http://localhost:3000/ask",
        { question: query },
        { withCredentials: true }
      );
  
      console.log("✅ Backend API response:", res.data);
  
      // Extract the response text
      const responseText =
        res.data.response?.answer ||
        res.data.answer?.response ||
        "I'm sorry, I didn't understand that.";
  
      console.log("📥 Extracted response:", responseText);
  
      // Update the last message in history with the real bot response
      setHistory((prevHistory) =>
        prevHistory.map((msg, index) =>
          index === prevHistory.length - 1
            ? {
                ...msg,
                bot:
                  typeof responseText === "string"
                    ? responseText
                    : JSON.stringify(responseText),
              }
            : msg
        )
      );
    } catch (error) {
      console.error("❌ Error calling backend:", error);
  
      // If there was an error, update last message accordingly
      setHistory((prevHistory) =>
        prevHistory.map((msg, index) =>
          index === prevHistory.length - 1
            ? { ...msg, bot: "An error occurred. Please try again." }
            : msg
        )
      );
    }
  
    setLoading(false);
    setQuery("");
  };

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const toggleVoiceToText = () => {
    // Check if SpeechRecognition is available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    // If not currently recording, start recognition
    if (!isRecording) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setQuery(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } else {
      // If already recording, stop recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      recognitionRef.current = null;
    }
  };



  // Speak the last bot message when the button is clicked
  const speakLastBotMessage = () => {
    if (history.length === 0) return;
    const lastMessage = history[history.length - 1];
    if (!lastMessage?.bot) return;

    const utterance = new SpeechSynthesisUtterance(lastMessage.bot);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI Assistant</h2>
      </div>

      <div className="chatbox">
        <div className="messages">
          {history.map((item, index) => (
            <div key={index} className="message-pair">
              <div className="user-message">{item.user}</div>
              <div className="bot-message">{item.bot}</div>
            </div>
          ))}
          {loading && <div className="bot-message">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-section">
          <textarea
            type="text"
            placeholder="Type your message..."
            value={query}
            onChange={handleQueryChange}
            className="query-input"
            disabled={loading}
            style={{
              'height': '20px'
            }}
          />
          <button
            onClick={handleQuerySubmit}
            disabled={loading || !query.trim()}
            className="submit-btn"
          >
            <FiSend size={18} />
          </button>

          {/* Speak button */}
          <button
            style={{
              'cursor': 'pointer',
              // 'width': '10%',
              // 'padding': '10px',
            }}
            onClick={speakLastBotMessage}
            disabled={history.length === 0}
            className="tts-btn"
          >
            <FaVolumeUp size={18} />
          </button>

          {/* Other buttons (e.g., Send, TTS, etc.) can be here */}
          <button onClick={toggleVoiceToText} className="voice-to-text-btn" style={{
            'cursor': 'pointer',
            'width': '20%',
            'padding': '20px',
          }}>
            <FaMicrophone size={18} />
          </button>
          {/* Existing TTS button */}
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;