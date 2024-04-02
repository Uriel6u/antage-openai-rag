"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInput, setUserInput] = useState(""); // State to store user input
  const [responseData, setResponseData] = useState<{ message?: string } | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([]); // state for chat history
  const bottomRef = useRef<HTMLDivElement>(null); // Reference to the bottom of the chat history
  // Get the current date and format it
  const currentDate = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", dateOptions);

  /* removed file upload functionality
  Event handler for file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Event handler for upload button click
  const handleUpload = () => {
    // Perform upload logic with the selectedFile
    if (selectedFile) {
      // You can use this selectedFile for further processing, e.g., uploading to a server.
      console.log('Selected File:', selectedFile);
      // Add your upload logic here
    } else {
      console.log('No file selected');
    }
  };*/

  
  // useffect to re render when response data changes
  useEffect(() => {
    console.log("Response data:", responseData);
    if (responseData  && responseData.message) {
      const aiMessage = { sender: 'ai', text: responseData.message || "Default AI response" }; 
      setChatHistory(currentHistory => [...currentHistory, aiMessage]);
    }
  }, [responseData]);

  
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  },[chatHistory, responseData]);

  const handleSend = () => {
    // Action when user hits Send button
    //console.log("User input:", userInput);
    const newUserMessage = { sender: 'user', text: userInput };
    setChatHistory((currentHistory) => [...currentHistory, newUserMessage]);


    fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResponseData(data); // Store the response data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      setUserInput("");
  };
  return (
    <div className='main-container min-h-screen flex flex-col items-center bg-[rgba(30,41,60,1)]'>
      {/*Antage logo*/}
      <div className='w-24 h-20 bg-[url(../../assets/images/Antagelogo.png)] bg-cover bg-no-repeat absolute top-3 left-2 ' />
      {/*openai image*/}
      <div className='w-64 h-64 bg-[url(../../assets/images/OpenAI.png)] bg-cover bg-no-repeat rounded-lg mt-2' />
      {/*date*/}
      <span className="block mt-4 text-xl text-white">
        {formattedDate} {/* Display the formatted date here */}
      </span>

      {/* Chat history window */}
      <div className="w-full max-w-screen-lg mt-0 overflow-y-auto rounded-lg flex-grow pb-24">
        {/* chat history of user and AI */}
        {chatHistory.map((message, index) => (
        <div key={index} className={"w-full mt-4 p-4 bg-[#0c4a6e] rounded-lg border border-gray-300 text-white "}>
          <span className="font-bold">{message.sender === 'user' ? 'User:' : 'AI Assistant:'}</span> {message.text}
        </div>
        ))}
        {/* 
        {responseData &&
          Object.entries(responseData).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          ))} */}
        <div ref={bottomRef} />
      
      </div>
      {/* chatbox */}
      <div className="w-full max-w-screen-lg bg-[#403c3c] rounded-lg border border-gray-300 fixed bottom-1 ">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full h-[80%] p-4 resize-none outline-none bg-transparent text-white border-0"
          placeholder="Message Chatbot..."
        />

        <div
          onClick={handleSend}
          className="flex justify-center items-center w-16 h-9 bg-[#ccd3df] rounded-full absolute bottom-4 right-4 cursor-pointer"
          style={{ cursor: "pointer" }}
        >
          <img
            src="../../assets/images/sendButton.png"
            alt="Send Image"
            className='w-[60%] h-[70%] '
          />
        </div>
      </div>
    </div>
  );
}
