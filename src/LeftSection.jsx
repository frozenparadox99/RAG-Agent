import React, {useState, useEffect} from "react";
import FileUpload from "./FileUpload";
import MultiFileUpload from "./MultiFileUpload";


const LeftSection = ({ show = false,files=["File1.txt", "File2.jpg", "File3.pdf"], 
  selectedFile, handleFileSelect, submitFile, loading, open, submitMultipleFile, 
  dirNames=['dir1', "dir2"],  fileDict, selectedDir, selectedFileMultiple, handleSelectedFileMultiple,
  handleDirSelect, selectedOption='files', handleSelectionChange}) => {
  
//   const [files, setFiles] = useState([])
//   const [selectedFile, setSelectedFile] = useState(files[0]);

//   const fetchFiles = async() =>{
//     const query = await fetch('http://3.22.236.223:5000/get-files')
//     const d = await query.json()
//     setFiles(d.files)
//   }
  useEffect(()=>{
    console.log("------------------------")
    console.log(selectedDir)
    console.log(fileDict[selectedDir])
    console.log("------------------------")
  },[selectedDir])

//   const handleFileSelect = (event) => {
//     setSelectedFile(event.target.value);
//   };
  return (
    <div
      className={`${show && " flex flex-col"} ${
        !show && "hidden"
      } bg-black md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col`}
    >
      <div className="flex h-full min-h-0 flex-col ">
        <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
          <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
            
            <br/>
            <FileUpload submitFile={submitFile} loading={loading} open={open} />
            <br/>
            <MultiFileUpload submitMultipleFile={submitMultipleFile} loading={loading} open={open} />
            <br/>
                {/* Dropdown for file selection */}

                <form className="relative">
                  <label>
                    <input
                      type="radio"
                      value="files"
                      checked={selectedOption === 'files'}
                      onChange={handleSelectionChange}
                    />
                    Files
                  </label>
                  <label style={{marginLeft:'5px'}}>
                    <input
                      type="radio"
                      value="directories"
                      checked={selectedOption === 'directories'}
                      onChange={handleSelectionChange}
                    />
                    Directories
                  </label>
                </form>

                <br />

                {selectedOption === 'files' && <>
                <div className="relative">
                  <select
                  style={{backgroundColor:"black", width:"10vw"}}
                    className="block w-full bg-lightBlack border border-gray-700 text-white rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={selectedFile}
                    onChange={handleFileSelect}
                  >
                    {files.map((file, index) => (
                      <option style={{color:"white"}} key={index} value={file}>
                        {file}
                      </option>
                    ))}
                  </select>
                </div>
                <br />
                </>}
                
             
                {/* Dropdown for file selection */}
                {selectedOption === 'directories' && <>
                <div className="relative">
                  <select
                  style={{backgroundColor:"black", width:"10vw"}}
                    className="block w-full bg-lightBlack border border-gray-700 text-white rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={selectedDir}
                    onChange={handleDirSelect}
                  >
                    {dirNames.map((dir, index) => (
                      <option style={{color:"white"}} key={index} value={dir}>
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
                <br/>
                <div className="relative">
                  <select
                  style={{backgroundColor:"black", width:"10vw"}}
                    className="block w-full bg-lightBlack border border-gray-700 text-white rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={selectedFileMultiple}
                    onChange={handleSelectedFileMultiple}
                  >
                    {fileDict && fileDict[selectedDir] && fileDict[selectedDir].map((file, index) => (
                      <option style={{color:"white"}} key={index} value={file}>
                        {file}
                      </option>
                    ))}
                  </select>
                </div>
                <br/>
                </>}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
