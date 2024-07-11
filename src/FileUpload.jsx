import React, { useState } from 'react';
import { BarLoader } from 'react-spinners';
import {BiWrench} from 'react-icons/bi'


const override = {
    display: "block",
    margin: "15px 0",
    borderColor: "red",
  
  };

const FileUpload = ({submitFile, loading, open}) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    simulateUploadProgress();
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleSubmit = ()=>{
    submitFile(file)
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-lightBlack text-white rounded-xl shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">Upload File</label> 
        <div style={{marginTop:"10px"}}  className="mt-1">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-gray-600 file:text-gray-200
            hover:file:bg-gray-500"
          />
        </div>
      </div>
      {file && (
        <div className="space-y-2">
          {/* <div className="text-sm text-gray-400">File: {file.name}</div> */}
          <button onClick={handleSubmit} style={{width:'5vw',backgroundColor:'black', color:'white', borderColor:'white', border:'1px solid', marginTop:'5px', padding:'3px'}} className='' >Upload</button>
          <button onClick={open} style={{width:'5vw',backgroundColor:'black', color:'white', borderColor:'white', border:'1px solid', marginTop:'5px', padding:'3px', marginLeft:'5px'}} className='' > Settings</button>
         
          <div className="w-full bg-gray-600 rounded-full">
            {/* <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div> */}
                <BarLoader
                color='white'
            loading={loading}
            size={50}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
