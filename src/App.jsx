import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { BiPlus, BiUser, BiSend, BiSolidUserCircle,BiBot } from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import FileUpload from "./FileUpload";
import LeftSection from "./LeftSection";

import ClipLoader from "react-spinners/ClipLoader";
import { BeatLoader, GridLoader, HashLoader } from "react-spinners";

const f = ["All", "File2.jpg", "File3.pdf"]
const override = {
  display: "block",
  margin: "15px auto",
  borderColor: "red",

};

const API_BASE_URL = '3.142.232.22'

function App() {
  const [chunkingStrategy, setChunkingStrategy] = useState("RecursiveCharacterTextSplitter");
  const [metadata1, setMetaData1] = useState("");
  const [metadata2, setMetaData2] = useState("");
  const [metadata3, setMetaData3] = useState("");
  
  const [files, setFiles] = useState(); 
  const [dirNames, setDirNames] = useState([])
  const [fileDict, setFileDict] = useState({})
  const [selectedFile, setSelectedFile] = useState(f[0]);
  const [selectedFileMultiple, setSelectedFileMultiple] = useState(f[0]);
  const [selectedDir, setSelectedDir] = useState('')
  let [color, setColor] = useState("#ffffff");
  let [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState(true)
  let [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('files')
  const handleSelectionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleStrategyChange = (event) => {
    setChunkingStrategy(event.target.value);
  };

  const handleMetadata1 = (event) => {
    setMetaData1(event.target.value);
  };
  const handleMetadata2 = (event) => {
    setMetaData2(event.target.value);
  };
  const handleMetadata3 = (event) => {
    setMetaData3(event.target.value);
  };

  const open = () => {
    console.log("Opening")
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const handleFileSelect = (event) => {
    console.log(event.target.value)
    setSelectedFile(event.target.value);
  };
  const handleSelectedFileMultiple = (event) => {
    console.log(event.target.value)
    setSelectedFileMultiple(event.target.value);
  };

  const handleDirSelect = (event) => {
    console.log(event.target.value)
    setSelectedDir(event.target.value);
  };

  const submitFile = async (file) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('file', file);  // Append the file to FormData

      let fetchStr = `http://${API_BASE_URL}:5000/upload-pdf?chunking_type=${chunkingStrategy}&metadata_1=${metadata1!=''?metadata1:'None'}&metadata_2=${metadata2!=''?metadata2:'None'}&metadata_3=${metadata3!=''?metadata3:'None'}`

      const response = await fetch(fetchStr, {
        method: 'POST',
        body: formData  // Send FormData as the body of the request
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data);
      getFiles()
      setLoading(false)
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false)
      // Handle error (e.g., show an error message)
    }
  }

  const submitMultipleFile = async (files, dirName) => {
    try {
      setLoading(true)
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]); // 'files' is the key, can be changed as per backend requirements
      }
      console.log("--------")
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      console.log(dirName)
      console.log("--------")
      let fetchStr = `http://${API_BASE_URL}:5000/upload-multiple-pdf?chunking_type=${chunkingStrategy}&dirname=${dirName}&metadata_1=${metadata1!=''?metadata1:'None'}&metadata_2=${metadata2!=''?metadata2:'None'}&metadata_3=${metadata3!=''?metadata3:'None'}`
      const response = await fetch(fetchStr, {
        method: 'POST',
        body: formData  // Send FormData as the body of the request
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data);
      getFiles()
      setLoading(false)
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false)
      // Handle error (e.g., show an error message)
    }
  }

  const [text, setText] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [localChats, setLocalChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const scrollToLastItem = useRef(null);

  const createNewChat = () => {
    setMessage(null);
    setText("");
    setCurrentTitle(null);
  };

  const backToHistoryPrompt = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setText("");
  };

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const submitHandler = async (e) => {
  e.preventDefault();
  if (!text) return;

  setIsResponseLoading(true);
  setErrorText("");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": import.meta.env.VITE_AUTH_TOKEN,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: text }],
      max_tokens: 150,
      temperature: 0.7,
    }),
  };

  try {
    // Mocking the fetch response
    const mockResponse = {
      status: 200,
      json: async () => ({
        id: "chatcmpl-mock123",
        object: "chat.completion",
        created: Date.now(),
        model: "gpt-4",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "This is a mock response based on your input.",
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 14,
          completion_tokens: 7,
          total_tokens: 21,
        },
      }),
    };

      const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query_text: text,
        selected_file:selectedOption==='directories'?selectedFileMultiple:selectedFile,
        selected_dir:selectedOption==='directories'?selectedDir:''
      }),
    };
    const query = await fetch(
      selectedOption==='directories'?`http://${API_BASE_URL}:5000/submit-query-multiple`:`http://${API_BASE_URL}:5000/submit-query`,
      options
    )
    const d = await query.json();
    console.log(d)

    const response = mockResponse; // Replace with actual fetch call when needed
    // const response = await fetch(
    //   `${import.meta.env.VITE_API_URL}/api/completions`,
    //   options
    // );

    if (response.status === 429) {
      return setErrorText("Too many requests, please try again later.");
    }

    const data = {
      id: "chatcmpl-mock123",
      object: "chat.completion",
      created: Date.now(),
      model: "gpt-4",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "This is a mock response based on your input.",
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 14,
        completion_tokens: 7,
        total_tokens: 21,
      },
    };

    if (data.error) {
      setErrorText(data.error.message);
      setText("");
    } else {
      setErrorText(false);
    }

    if (!data.error) {
      let ms = {
        role:"bot",
        content:d.response,
        sources: d.src,
        lines: d.lines
      }
      setErrorText("");
      setMessage(ms);
      setTimeout(() => {
        scrollToLastItem.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
        });
      }, 1);
      setTimeout(() => {
        setText("");
      }, 2);
    }
  } catch (e) {
    setErrorText(e.message);
    console.error(e);
  } finally {
    setIsResponseLoading(false);
  }
};

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   if (!text) return;

  //   setIsResponseLoading(true);
  //   setErrorText("");

  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": import.meta.env.VITE_AUTH_TOKEN,
  //     },
  //     body: JSON.stringify({
  //       message: text,
  //     }),
  //   };

  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/completions`,
  //       options
  //     );

  //     if (response.status === 429) {
  //       return setErrorText("Too many requests, please try again later.");
  //     }

  //     const data = await response.json();

  //     if (data.error) {
  //       setErrorText(data.error.message);
  //       setText("");
  //     } else {
  //       setErrorText(false);
  //     }

  //     if (!data.error) {
  //       setErrorText("");
  //       setMessage(data.choices[0].message);
  //       setTimeout(() => {
  //         scrollToLastItem.current?.lastElementChild?.scrollIntoView({
  //           behavior: "smooth",
  //         });
  //       }, 1);
  //       setTimeout(() => {
  //         setText("");
  //       }, 2);
  //     }
  //   } catch (e) {
  //     setErrorText(e.message);
  //     console.error(e);
  //   } finally {
  //     setIsResponseLoading(false);
  //   }
  // };

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsShowSidebar(window.innerWidth <= 640);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getGG = async () => {
    const prevChats = await fetch(`http://${API_BASE_URL}:5000/get-chats`)
    let d = await prevChats.json()
    let msgs = []
    for (const sessionId in d.sessions) {
      const session = d.sessions[sessionId];
      for (const message of session.messages) {
        msgs.push({
          title: sessionId,
          role: message[1],
          content: message[2]
        });
      }
    }
    console.log(msgs)
    // setPreviousChats((prevChats) => [...prevChats, ...msgs])
  }

  const getFiles = async () => {
    const serverFiles = await fetch(`http://${API_BASE_URL}:5000/get-files`)
    let d = await serverFiles.json()
    setFiles(d.files)
    setDirNames(d.dir_names)
    setFileDict(d.file_dict)
    console.log(d.files)
    console.log(d.file_dict)
    console.log(d.dir_names)
  }
  useEffect(() => {
    // getGG()
    getFiles()
    const storedChats = localStorage.getItem("previousChats");

    if (storedChats) {
      setLocalChats(JSON.parse(storedChats));
    }
  }, []);

  useEffect(() => {
    if (!currentTitle && text && message) {
      setCurrentTitle(text);
    }

    console.log(currentTitle)

    if (currentTitle && text && message) {
      const newChat = {
        title: currentTitle,
        role: "user",
        content: text,
        sources:[],
        lines:[],
      };

      const responseMessage = {
        title: currentTitle,
        role: message.role,
        content: message.content,
        sources: message.sources,
        lines: message.lines
      };

      setPreviousChats((prevChats) => [...prevChats, newChat, responseMessage]);
      setLocalChats((prevChats) => [...prevChats, newChat, responseMessage]);

      const updatedChats = [...localChats, newChat, responseMessage];
      localStorage.setItem("previousChats", JSON.stringify(updatedChats));
    }
  }, [message, currentTitle]);

  const currentChat = (localChats || previousChats).filter(
    (prevChat) => prevChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat) => prevChat.title).reverse())
  );

  const localUniqueTitles = Array.from(
    new Set(localChats.map((prevChat) => prevChat.title).reverse())
  ).filter((title) => !uniqueTitles.includes(title));

  return (
    <>
      <div className="container">
        <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
          <div className="sidebar-header" onClick={createNewChat} role="button">
            <BiPlus size={20} />
            <button>New Chat</button>
          </div>
          <div className="sidebar-history">
            {uniqueTitles.length > 0 && previousChats.length !== 0 && (
              <>
                <p>Ongoing</p>
                <ul>
                  {uniqueTitles?.map((uniqueTitle, idx) => {
                    const listItems = document.querySelectorAll("li");

                    listItems.forEach((item) => {
                      if (item.scrollWidth > item.clientWidth) {
                        item.classList.add("li-overflow-shadow");
                      }
                    });

                    return (
                      <li
                        key={idx}
                        onClick={() => backToHistoryPrompt(uniqueTitle)}
                      >
                        {uniqueTitle}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            {localUniqueTitles.length > 0 && localChats.length !== 0 && (
              <>
                <p>Previous</p>
                <ul>
                  {localUniqueTitles?.map((uniqueTitle, idx) => {
                    const listItems = document.querySelectorAll("li");

                    listItems.forEach((item) => {
                      if (item.scrollWidth > item.clientWidth) {
                        item.classList.add("li-overflow-shadow");
                      }
                    });

                    return (
                      <li
                        key={idx}
                        onClick={() => backToHistoryPrompt(uniqueTitle)}
                      >
                        {uniqueTitle}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
          <div className="sidebar-info">
            {/* <div className="sidebar-info-upgrade">
              <BiUser size={20} />
              <p>Upgrade plan</p>
            </div>
            <div className="sidebar-info-user">
              <BiSolidUserCircle size={20} />
              <p>User</p>
            </div> */}
                <LeftSection dirNames={dirNames} 
                fileDict={fileDict} selectedDir={selectedDir} 
                handleDirSelect={handleDirSelect} 
                files={files} selectedFile={selectedFile} 
                handleFileSelect={handleFileSelect} submitFile={submitFile} 
                loading={loading} open={open} submitMultipleFile={submitMultipleFile}
                handleSelectionChange={handleSelectionChange}
                selectedOption={selectedOption}
                selectedFileMultiple={selectedFileMultiple} handleSelectedFileMultiple={handleSelectedFileMultiple}
                />
          </div>
          
        </section>
        

        <section className="main">
          {!currentTitle && (
            <div className="empty-chat-container">
              <BiBot size={45}/>
              <h1>Regulatory Assistant</h1>
              
            </div>
          )}

          {isShowSidebar ? (
            <MdOutlineArrowRight
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          ) : (
            <MdOutlineArrowLeft
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          )}
          
          <div className="main-header">
            <ul>
              {currentChat?.map((chatMsg, idx) => {
                const isUser = chatMsg.role === "user";

                return (
                  <li key={idx} ref={scrollToLastItem}>
                    {isUser ? (
                      <div>
                        <BiSolidUserCircle size={28.8} />
                      </div>
                    ) : (
                      <img src="images/light-logo.svg" alt="ChatGPT" />
                    )}
                    {isUser ? (
                      <div>
                        <p className="role-title">You</p>
                        <p>{chatMsg.content}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="role-title">Assistant</p>
                        <p>{chatMsg.content}</p>
                        {chatMsg.sources && <button onClick={()=>{
                          setShowSources(true)
                        }}
                        style={{marginTop:'10px', cursor:'default',padding:'2px',borderColor:'white', border:'1px solid'}} className="role-title">Sources</button>}
                        {/* <Modal open={showSources} onClose={()=> setShowSources(false)} center classNames={{
                            overlay: 'customOverlay',
                            modal: 'customModal',
                          }}>
                            <h2>Sources</h2>
                          <div style={{ marginBottom: '15px', marginTop:'10px' }}>
                          {chatMsg.sources && showSources &&chatMsg.sources.map(src =>(
                                            <p>- PDF: {src.split(':')[0]}, Page: {src.split(':')[1]}, Chunk: {src.split(':')[2]}</p>
                                          ))}
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={()=> setShowSources(false)} 
                              style={{ 
                                marginRight: '10px', 
                                padding: '10px 15px', 
                                backgroundColor: '#404150', 
                                color: '#fff', 
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              Close
                            </button>
                            
                          </div>
                        </Modal> */}
                        {chatMsg.sources && showSources &&chatMsg.sources.map((src, itdx) =>(
                          <p>- PDF: {src.split(':')[0]}, Page: {src.split(':')[1]}, Chunk: {src.split(':')[2]}, Lines: {chatMsg.lines && chatMsg.lines[itdx]}</p>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <BeatLoader
        color={color}
        loading={isResponseLoading}
        cssOverride={override}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
          
          <div className="main-bottom">
            {errorText && <p className="errorText">{errorText}</p>}
            <form className="form-container" onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Send a message."
                spellCheck="false"
                value={isResponseLoading ? "Processing..." : text}
                onChange={(e) => setText(e.target.value)}
                readOnly={isResponseLoading}
              />
              {!isResponseLoading && (
                <button type="submit">
                  <BiSend size={20} />
                </button>
              )}
            </form>
            <p>
            Select files to chat with them
            </p>
          </div>

          <Modal open={isOpen} onClose={close} center classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}>
          <h2>Configuration</h2>
        <div style={{ marginBottom: '15px', marginTop:'10px' }}>
          <label>
            Chunk Size
            <input 
              type="number" 
              defaultValue={1000} 
              style={{ 
                marginTop:'5px',
                display: 'block', 
                width: '100%', 
                padding: '8px', 
                boxSizing: 'border-box', 
                backgroundColor: '#404150', 
                color: '#fff',
                border: '1px solid #555',
                outline: 'none'
              }} 
            />
            <small style={{ display: 'block', marginTop: '5px', color: '#aaa' }}>Default: 1000</small>
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Chunk Overlap
            <input 
              type="number" 
              defaultValue={200} 
              style={{ 
                marginTop:'5px',
                display: 'block', 
                width: '100%', 
                padding: '8px', 
                boxSizing: 'border-box', 
                backgroundColor: '#404150', 
                color: '#fff',
                border: '1px solid #555',
                outline: 'none'
              }} 
            />
            <small style={{ display: 'block', marginTop: '5px', color: '#aaa' }}>Default: 200</small>
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Chunking Strategy
            <select 
              value={chunkingStrategy} 
              onChange={handleStrategyChange}
              style={{ 
                marginTop:'5px',
                display: 'block', 
                width: '100%', 
                padding: '8px', 
                boxSizing: 'border-box',
                backgroundColor: '#404150', 
                color: '#fff',
                border: '1px solid #555',
                outline: 'none'
              }}
            >
              <option value="RecursiveCharacterTextSplitter">Recursive Character Text Splitter</option>
              <option value="SemanticChunker">Semantic Chunker</option>
              <option value="CharacterTextSplitter">Character Text Splitter</option>
              {/* Add more options here if needed */}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            MetaData 1
            <input 
            value={metadata1} 
            onChange={handleMetadata1}
              type="text" 
              placeholder="Enter information about the file"
              style={{ 
                marginTop:'5px',
                display: 'block', 
                width: '100%', 
                padding: '8px', 
                boxSizing: 'border-box', 
                backgroundColor: '#404150', 
                color: '#fff',
                border: '1px solid #555',
                outline: 'none'
              }} 
            />
            {/* <small style={{ display: 'block', marginTop: '5px', color: '#aaa' }}>Default: 200</small> */}
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            MetaData 2
            <input 
            value={metadata2} 
            onChange={handleMetadata2}
              type="text" 
              placeholder="Enter information about the file"
              style={{ 
                marginTop:'5px',
                display: 'block', 
                width: '100%', 
                padding: '8px', 
                boxSizing: 'border-box', 
                backgroundColor: '#404150', 
                color: '#fff',
                border: '1px solid #555',
                outline: 'none'
              }} 
            />
            {/* <small style={{ display: 'block', marginTop: '5px', color: '#aaa' }}>Default: 200</small> */}
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            MetaData 3
            <input 
            value={metadata3} 
            onChange={handleMetadata3}
              type="text" 
              placeholder="Enter information about the file"
              style={{ 
                marginTop:'5px',
                display: 'block', 
                width: '100%', 
                padding: '8px', 
                boxSizing: 'border-box', 
                backgroundColor: '#404150', 
                color: '#fff',
                border: '1px solid #555',
                outline: 'none'
              }} 
            />
            {/* <small style={{ display: 'block', marginTop: '5px', color: '#aaa' }}>Default: 200</small> */}
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={close} 
            style={{ 
              marginRight: '10px', 
              padding: '10px 15px', 
              backgroundColor: '#404150', 
              color: '#fff', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          <button 
            onClick={close} 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#404150', 
              color: '#fff', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
          
        </section>
      </div>
    </>
  );
}

export default App;
