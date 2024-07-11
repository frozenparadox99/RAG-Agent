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

function App() {
  const [files, setFiles] = useState(); 
  const [selectedFile, setSelectedFile] = useState(f[0]);
  let [color, setColor] = useState("#ffffff");
  let [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState(true)
  let [isOpen, setIsOpen] = useState(false)

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

  const submitFile = async (file) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('file', file);  // Append the file to FormData

      const response = await fetch('http://18.221.233.48:5000/upload-pdf', {
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
        selected_file:selectedFile
      }),
    };
    const query = await fetch(
      'http://18.221.233.48:5000/submit-query',
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
        sources: d.src
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
    const prevChats = await fetch('http://18.221.233.48:5000/get-chats')
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
    const serverFiles = await fetch('http://18.221.233.48:5000/get-files')
    let d = await serverFiles.json()
    setFiles(d.files)
    console.log(d.files)
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
        sources:[]
      };

      const responseMessage = {
        title: currentTitle,
        role: message.role,
        content: message.content,
        sources: message.sources
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
                <LeftSection files={files} selectedFile={selectedFile} handleFileSelect={handleFileSelect} submitFile={submitFile} loading={loading} open={open}/>
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
                        {chatMsg.sources && showSources &&chatMsg.sources.map(src =>(
                          <p>- PDF: {src.split(':')[0]}, Page: {src.split(':')[1]}, Chunk: {src.split(':')[2]}</p>
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
              defaultValue="RecursiveCharacterTextSplitter" 
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
              <option value="RecursiveCharacterTextSplitter">RecursiveCharacterTextSplitter</option>
              {/* Add more options here if needed */}
            </select>
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
