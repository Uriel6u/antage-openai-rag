import React, { useState } from 'react';
import './index.css';


export default function Main() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInput, setUserInput] = useState(''); // State to store user input

  // Event handler for file input change
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
  };


  const handleSend = () => {
    // Action when user hits Send button
    console.log('User input:', userInput);
    // add code here which sends the user input to the chatbot

    
  };
  return (
    <div className='main-container w-[1751px] h-[1638px] relative mx-auto my-0'>
      <div className='w-[102px] h-[84px] bg-[url(../assets/images/Antagelogo.png)] bg-cover bg-no-repeat relative z-10 mt-[16px] mr-0 mb-0 ml-[13px]' />
      <div className='w-[303px] h-[292px] bg-[url(../assets/images/OpenAI.png)] bg-cover bg-no-repeat rounded-[39px] relative z-[9] mt-[18px] mr-0 mb-0 ml-[713px]' />
      <span className="block h-[53px] font-['B612_Mono'] text-[36px] font-normal leading-[43.74px] text-[#fff] relative text-left whitespace-nowrap z-[6] mt-[13px] mr-0 mb-0 ml-[683px]">
        Tuesday,Feb 27
      </span>
      <div className='w-[1344.003px] h-[5.116px] bg-[url(../assets/images/69edfdd2-adeb-4fb3-90eb-60a625e364fb.png)] bg-[length:100%_100%] bg-no-repeat relative z-[3] mt-[12px] mr-0 mb-0 ml-[208px]' />
      <span className="flex w-[1284px] h-[244px] justify-start items-start font-['B612_Mono'] text-[30px] font-bold leading-[36.45px] text-[#fff] relative text-left z-[14] mt-[43.884px] mr-0 mb-0 ml-[211px]">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat."
      </span>
      <span className="block h-[42px] font-['B612_Mono'] text-[30px] font-bold leading-[36.45px] text-[#fff] relative text-left whitespace-nowrap z-[4] mt-[17px] mr-0 mb-0 ml-[204px]">
        ChatGPT:
      </span>
      <span className="flex w-[1344px] h-[195px] justify-start items-start font-['B612_Mono'] text-[30px] font-bold leading-[36.45px] text-[#fff] relative text-left z-[5] mt-0 mr-0 mb-0 ml-[204px]">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat."
      </span>
      <div className='flex w-[127px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] justify-center items-center flex-nowrap relative z-[11] mt-[496px] mr-0 mb-0 ml-[204px]'>
        {/* File input */}
        <input type="file" accept=".png, .jpg, .jpeg, .CSV" onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
        
        {/* Upload button */}
        <label htmlFor="fileInput" className='flex w-[138px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#cdd4df] rounded-[20px] border-none relative z-[12] pointer'>
          <span className="h-[36px] shrink-0 basis-auto font-['B612_Mono'] text-[30px] font-bold leading-[36px] text-[#1a1717] relative text-left whitespace-nowrap z-[13]">
            Upload
          </span>
        </label>

        {/* Display selected file name */}
        {selectedFile && <p>{selectedFile.name}</p>}
      </div>

     
      <div className='w-full h-full bg-[#1e293c] border-solid border border-[#000] absolute top-0 left-0' />
      <div className='w-[76.76%] h-[24.54%] bg-[#3e3b3b] rounded-[15px] border-solid border-2 border-[#fdf3f3] absolute top-[68.93%] left-[11.65%] box-content z-[1]' />
     {/* <div className='w-[7.25%] h-[2.93%] bg-[#ccd3df] rounded-[30px] absolute top-[88.58%] left-[79.78%] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] z-[7]' />
      <div className='w-[2.34%] h-[2.01%] bg-[url(../assets/images/e71b4f01-4635-4661-9d36-57a9c5945a85.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[89.01%] left-[82.24%] z-[8]' />
    */}
      <div className='w-[76.76%] h-[24.54%] bg-gray-300 rounded-[15px] border-solid border border-gray-400 absolute top-[68.93%] left-[11.65%] box-content z-[1]' >
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full h-full p-4 bg-transparent resize-none outline-none"
          placeholder="Message Ai Chatbot..."
        />

<div
  onClick={handleSend}
  className='w-[8%] h-[10%] bg-[#ccd3df] rounded-[30px] flex justify-center items-center absolute top-[88.58%] left-[90%] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] z-[7]'
  style={{ cursor: 'pointer' }}
>
  <img
    src="../assets/images/e71b4f01-4635-4661-9d36-57a9c5945a85.png"
    alt="Send Image"
    className='w-[60%] h-[100%] rounded-[30px]'
  />
</div>
      </div>
    
    </div>
  );
}
