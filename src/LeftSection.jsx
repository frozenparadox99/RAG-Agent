import React, {useState, UseEffect} from "react";
import FileUpload from "./FileUpload";

const LeftSection = ({ show = false,files=["File1.txt", "File2.jpg", "File3.pdf"], selectedFile, handleFileSelect, submitFile, loading, open }) => {
//   const [files, setFiles] = useState([])
//   const [selectedFile, setSelectedFile] = useState(files[0]);

//   const fetchFiles = async() =>{
//     const query = await fetch('http://3.22.236.223:5000/get-files')
//     const d = await query.json()
//     setFiles(d.files)
//   }
//   useEffect(()=>{
//     fetchFiles()
//   },[])

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
                {/* Dropdown for file selection */}
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
                <br/>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
