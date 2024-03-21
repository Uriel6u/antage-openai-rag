"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInput, setUserInput] = useState(""); // State to store user input
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

  const handleSend = () => {
    // Action when user hits Send button
    console.log("User input:", userInput);
    // add code here which sends the user input to the chatbot
  };
  return (
    <div className="main-container w-[1751px] h-[1638px] relative mx-auto my-0">
      <div className="w-[102px] h-[84px]  bg-cover bg-no-repeat relative z-10 mt-[16px] mr-0 mb-0 ml-[13px]" />
      <div className="w-[303px] h-[292px]  bg-cover bg-no-repeat rounded-[39px] relative z-[9] mt-[18px] mr-0 mb-0 ml-[713px]" />
      <span className="block h-[53px] font-['B612_Mono'] text-[36px] font-normal leading-[43.74px] text-[#fff] relative text-left whitespace-nowrap z-[6] mt-[13px] mr-0 mb-0 ml-[683px]">
        {formattedDate} {/** Display the formatted date here */}
      </span>
      <div className="w-[1344.003px] h-[5.116px] bg-[length:100%_100%] bg-no-repeat relative z-[3] mt-[12px] mr-0 mb-0 ml-[208px]" />
      <span className="flex w-[1284px] h-[244px] justify-start items-start font-['B612_Mono'] text-[30px] font-bold leading-[36.45px] text-[#fff] z-[1] relative text-left mt-[43.884px] mr-0 mb-0 ml-[211px]">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat."
      </span>
      <span className="block h-[42px] font-['B612_Mono'] text-[30px] font-bold leading-[36.45px] text-[#fff] relative text-left whitespace-nowrap z-[1] mt-[17px] mr-0 mb-0 ml-[204px]">
        ChatGPT:
      </span>
      <span className="flex w-[1344px] h-[195px] justify-start items-start font-['B612_Mono'] text-[30px] font-bold leading-[36.45px] text-[#fff] relative text-left z-[1] mt-0 mr-0 mb-0 ml-[204px]">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat."
      </span>

      {/* Remove upload button
      <div className='flex w-[127px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] justify-center items-center flex-nowrap relative z-[11] mt-[496px] mr-0 mb-0 ml-[204px]'>
        {/* File input 
        <input type="file" accept=".png, .jpg, .jpeg, .CSV" onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
        
        {/* Upload button 
        <label htmlFor="fileInput" className='flex w-[138px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#cdd4df] rounded-[20px] border-none relative z-[12] pointer'>
          <span className="h-[36px] shrink-0 basis-auto font-['B612_Mono'] text-[30px] font-bold leading-[36px] text-[#1a1717] relative text-left whitespace-nowrap z-[13]">
            Upload
          </span>
        </label>

        {/* Display selected file name 
        {selectedFile && <p>{selectedFile.name}</p>}
        </div> */}

      <div className="w-full h-full bg-[#1e293c] border-solid border border-[#000] absolute top-0 left-0" />

      <div className="w-[70%] bg-[#403c3c] rounded-[15px] border-solid border border-[#D0D3D4] fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[1]">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full h-[80%] p-4 resize-none outline-none bg-transparent text-white border-0" // Changed background to transparent and removed border
          placeholder="Message Chatbot..."
        />

        <div
          onClick={handleSend}
          className="absolute top-11 right-2 w-[6%] h-[40%] bg-[#ccd3df] rounded-[30px] flex justify-center items-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
          style={{ cursor: "pointer" }}
        ></div>
      </div>
    </div>
  );
}
