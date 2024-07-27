// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Mermaid from './Mermaid'
import AceEditor from 'react-ace';
import Header from '../Header';
import Footer from "../Footer";
import { TailSpin } from 'react-loader-spinner';
import example from './example';
import config from '../resources/config.json'

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';

function App() {
  const [messages, setMessages] = useState({});
  const [userInput, setUserInput] = useState('');
  const [mermaidCharts, setMermaidCharts] = useState({});
  const [summary, setSummary] = useState({});
  const [code, setCode] = useState(example);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [chatTrigger, setChatTrigger] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [analysing, setAnalysing] = useState(false)
  const [parsedCode, setParsedCode] = useState([])
  const [parseIndex, setParseIndex] = useState(-1)

  useEffect(() => {
    const healthCheckServer = async () => {
      const response = await fetch(config.server_url + '/health', {
        method: 'GET',
        }).catch((err) => {
          if (err.response) {
              alert("Server responded with a " + err.response.status + " bad response!");
          } else {
              alert("Server is offline!")
          }
      });
    }
    healthCheckServer();
  }, []); 
  
  const sendMessage = () => {
    if (userInput.trim() !== '') {
      const newMessages = messages
      newMessages[parseIndex] = [...messages[parseIndex], {content: userInput, role: 'user'}, {content: '...', role: 'assistant'}]
      setMessages(newMessages);
      setUserInput('');
      getAIChatResponse(newMessages);
    }
  };

  const getAIChatResponse = async (messages) => {
    try {
      const response = await fetch(config.server_url + '/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: parsedCode[parseIndex]['code'], summary: summary[parseIndex], mermaid: mermaidCharts[parseIndex], messages: messages[parseIndex] })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const newMessages = messages
      newMessages[parseIndex] = [...messages[parseIndex].slice(0,-1), {content: result.content, role: 'assistant'}]
      console.log(newMessages)
      setMessages(newMessages)
      setChatTrigger(!chatTrigger)
    } catch (error) {
      if (error.response) {
        alert("Server responded with a " + error.response.status + " bad response!");
      } else {
        alert("Server is offline!")
      }
    }
  };

  const parseCode = async () => {
    try {
      setAnalysing(true)
      const response = await fetch(config.server_url + '/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
      });
      setAnalysing(false)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result)
      setParsedCode(result.parsed_code)
      setParseIndex(0)
    } catch (error) {
      if (error.response) {
        alert("Server responded with a " + error.response.status + " bad response!");
      } else {
        alert("Server is offline!")
      }
    }
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const generateFlowchart = async () => {
    try {
      setLoading(true)
      const response = await fetch(config.server_url + '/flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: parsedCode[parseIndex]['code'] })
      });
      setLoading(false)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const newMermaidCharts = mermaidCharts
      newMermaidCharts[parseIndex] = result.mermaid
      setMermaidCharts(newMermaidCharts);

      const newSummary = summary
      newSummary[parseIndex] = result.summary
      setSummary(newSummary)

      const newMessages = messages
      newMessages[parseIndex] = [{content: 'Here is the explanation of the code:\n\n' + result.summary, role: 'assistant'}]
      setMessages(newMessages);
      setReloadCounter(prev => prev + 1);
    } catch (error) {
      if (error.response) {
        alert("Server responded with a " + error.response.status + " bad response!");
      } else {
        alert("Server is offline!")
      }
    }
  };

  return (
    <>
    <Header />
    <div className="main-container">
      <div className="code-container">
        <div style={{overflowY: 'auto'}}>
          <AceEditor
            mode="python"
            theme="tomorrow"
            value={parseIndex===-1 ? code : parsedCode[parseIndex]['code']}
            readOnly={parseIndex!==-1}
            onChange={(newCode) => {setCode(newCode); setParsedCode([]); setMermaidCharts({}); setMessages({}); setSummary({})}}
            name="code_editor"
            editorProps={{ $blockScrolling: true }}
            width="700px"
            height="400px"
            fontSize={16}
            style={{
              backgroundColor: "#dddddd00",
            }}
            setOptions={{
              showLineNumbers: false,
              showGutter: false,
            }}
          />
        </div>
        <div style={{display:'flex', height:'100%', flexDirection:'column-reverse', gap:'10px', overflowY:'auto', minWidth: '120px'}}>
          <button className="chat-button generate-button" onClick={parseCode} disabled={loading || parseIndex!==-1}>Analyse</button>
          <button className="chat-button generate-button" onClick={generateFlowchart} disabled={loading || parseIndex===-1} style={{marginTop:'20px'}} >Generate</button>
          <button className="chat-button code-button" onClick={()=>{setParseIndex(-1)}} disabled={parseIndex===-1}>Full Code</button>
          {parsedCode.map((val, index) => (
            <button className="chat-button code-button" onClick={() => setParseIndex(index)} disabled={parseIndex===index}>
              {val.name.length < 10 ? val.name : val.name.slice(0,10)+'...'}
            </button>
          ))}
          { analysing?
          <div className="loading-container" style={{display:'flex', justifyContent:'center'}}>
              <TailSpin
                height="40"
                width="40"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
            : <></>}
        </div>

      </div>
      <div className="cfg-container">
        {
          loading ?
            <div className="loading-container" style={{display:'flex', justifyContent:'center'}}>
              <TailSpin
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
            :
            !(parseIndex in mermaidCharts) ?
              <p class="stylish-text">Click &nbsp; <strong> analyse </strong> &nbsp; and &nbsp; <strong> generate </strong> &nbsp; to visualize code</p>
              :
              <div className="mermaid-display" style={{ width: '100%', height: '100%' }}>
                <Mermaid key={reloadCounter} chart={mermaidCharts[parseIndex]} />
              </div>

        }
        <p class="stylish-text" style={{ fontSize: '16px'}}>Note: The diagrams are occasionally inaccurate. Speak with the chatbot below for more accurate explanation</p>
      </div>

      <div className="chat-container">
        <div className="messages">
          {(parseIndex in messages) ?
            messages[parseIndex].map((message, index) => (
              <div className={"message " + message.role} key={index}>
                {message.content.split('\n').map((line, index) => {
                return (
                    <>
                        {line}
                        <br />
                    </>
                );
                })}
              </div>
            ))
          :
            <></>
          }
        </div>
        <div className="chat-input-button-container">
          <textarea  
            type="text"
            id="userMsg"
            placeholder="Type a message..."
            value={userInput}
            onChange={handleUserInputChange}
            className="chat-input"
          />
          <button className="chat-button" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  );
}

export default App;















