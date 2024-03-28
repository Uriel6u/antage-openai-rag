"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInput, setUserInput] = useState(""); // State to store user input
  const [responseData, setResponseData] = useState(null);
  // Get the current date and format it
  const currentDate = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
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
  }, [responseData]);

  const handleSend = () => {
    // Action when user hits Send button
    console.log("User input:", userInput);

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
  };
  return (
    <div className='main-container max-w-screen mx-auto flex flex-col items-center bg-[rgba(30,41,60,1)] '>
      {/*Antage logo*/}
      <div className='w-24 h-20 bg-[url(../../assets/images/Antagelogo.png)] bg-cover bg-no-repeat absolute top-2 left-2 ' />
      {/*openai image*/}
      <div className='w-64 h-64 bg-[url(../../assets/images/OpenAI.png)] bg-cover bg-no-repeat rounded-lg mt-8' />
      {/*date*/}
      <span className="block mt-4 text-xl text-white">
        {formattedDate} {/* Display the formatted date here */}
      </span>
      
      {/* chat history of user */}
      <div className="w-full max-w-sreen-lg mt-4">
        <span className="block mt-4 text-lg font-bold text-white">User:</span>
        <div className="bg-#486391 rounded-lg border border-gray-300 p-4 text-white">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat."
        </div>
      </div>

       {/* Chat response */}
       <div className="w-full max-w-sreen-lg mt-4">
        <span className="block mt-4 text-lg font-bold text-white">ai Assistant:</span>
        <div className="bg-#486391 rounded-lg border border-gray-300 p-4 text-white">
        {responseData &&
          Object.entries(responseData).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      </div>
     
      {/* chatbox */}
      <div className="w-full max-w-screen-lg bg-[#403c3c] rounded-lg border mt-7 relative">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full h-[80%] p-4 resize-none outline-none bg-transparent text-white border-0"
          placeholder="Message Chatbot..."
        />

        <div
          onClick={handleSend}
          className="flex justify-center items-center w-16 h-16 bg-[#ccd3df] rounded-full absolute bottom-4 right-4 cursor-pointer"
          style={{ cursor: "pointer" }}
        >
          <img
            src="../../assets/images/sendButton.png"
            alt="Send Image"
            className='w-[60%] h-[70%] rounded-[30px]'
          />
        </div>
      </div>
    </div>
  );
}
