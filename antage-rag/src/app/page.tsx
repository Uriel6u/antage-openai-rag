"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInput, setUserInput] = useState(""); // State to store user input
  const [responseData, setResponseData] = useState(null);

  const [isTyping, setIsTyping] = useState(false); //Boolean value to determine whether user is typing
 
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    setIsTyping(true); // Set typing state to true when user starts typing

    if(e.target.value === ""){ //If user has empty message, change back to original button color
      setIsTyping(false);
    }
  };

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
    setUserInput(""); //Clears the text box after a message is sent
    setIsTyping(false);

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
    <div className='main-container min-h-screen flex flex-col items-center bg-[rgba(30,41,60,1)]'>
      {/*Antage logo*/}
      <div className='w-24 h-20 bg-[url(../../assets/images/Antagelogo.png)] bg-cover bg-no-repeat absolute top-3 left-2 ' />
      {/*openai image*/}
      <div className='w-64 h-64 bg-[url(../../assets/images/OpenAI.png)] bg-cover bg-no-repeat rounded-lg mt-8' />
      {/*date*/}
      <span className="block mt-4 text-xl text-white">
        {formattedDate} {/* Display the formatted date here */}
      </span>


      <div className="w-full max-w-screen-lg mt-4 flex flex-col items-center">
        {/* chat history of user */}
        <div className="w-full max-w-sreen-lg mt-4">
          <span className="block mt-4 text-lg font-bold text-white">User:</span>
          <div className="bg-[#0c4a6e] rounded-lg border border-gray-300 p-4 text-white w-full">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eleifend non leo cursus mollis. Nulla sit amet eros tincidunt libero venenatis vulputate tempor quis velit. Nam mi metus,
           tempus eget neque in, blandit ornare augue. Morbi lobortis, augue id faucibus volutpat, felis magna eleifend eros, mattis egestas velit lorem id ante. Nulla a pretium leo, a finibus nibh.
            Quisque consectetur rutrum mi, quis cursus nulla vehicula varius. Nullam libero odio, rutrum nec mollis vehicula, eleifend id mi. Suspendisse lacus nibh, sagittis sit amet lorem id, venenatis"
           
          </div>
        </div>

        {/* Chat history of ai response */}
        <div className="w-full max-w-sreen-lg mt-4">
          <span className="block mt-4 text-lg font-bold text-white">ai Assistant:</span>
          <div className="bg-[#0c4a6e] rounded-lg border border-gray-300 p-4 text-white w-full">
          {responseData &&
            Object.entries(responseData).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* chatbox */}
      <div className="w-full max-w-screen-lg bg-[#403c3c] rounded-lg border border-gray-300 fixed bottom-12">

        <textarea
          value={userInput}
          onChange={(e) => {setUserInput(e.target.value);
            handleInputChange(e);}} //Changes color of send button when user starts typing
          className="w-full h-[80%] p-4 resize-none outline-none bg-transparent text-white border-0"
          placeholder="Message Chatbot..."
        />

        <div
          onClick={handleSend}
          className="flex justify-center items-center w-16 h-9 bg-[#4e5259] rounded-full absolute bottom-4 right-4 cursor-pointer"
          style={{ cursor: "pointer", backgroundColor: isTyping ? '#f2f3f5' : '#4e5259'}} //If user is typing, change color of send button

        >
          <img
            src="../../assets/images/send.png"
            alt="Send Image"
            className='w-[60%] h-[70%] '
          />
        </div>
      </div>
    </div>
  );
}
