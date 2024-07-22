// App.js
import React, { useState } from 'react';
import './App.css';
import Mermaid from './Mermaid'
import CodeEditor from '@uiw/react-textarea-code-editor';
import Header from './Header';
import { TailSpin } from 'react-loader-spinner';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [mermaidCharts, setMermaidCharts] = useState({});
  const [summary, setSummary] = useState('');
  const [reloadCounter, setReloadCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [parsedCode, setParsedCode] = useState([])
  const [parseIndex, setParseIndex] = useState(-1)

  const sendMessage = () => {
    if (userInput.trim() !== '') {
      const newMessages = [...messages, {content: userInput, role: 'user'}]
      setMessages(newMessages);
      setUserInput('');
      getAIResponse(newMessages);
    }
  };

  const getAIResponse = async (messages) => {
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: parsedCode[parseIndex]['code'], summary: summary, mermaid: mermaidCharts[parseIndex], messages: messages })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessages([...messages, {content: result.content, role: 'assistant'}])
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const parseCode = async () => {
    try {
      const response = await fetch('http://localhost:8000/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result)
      setParsedCode(result.parsed_code)
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const [code, setCode] = useState(
    `def add(a, b):\n    return a + b`
  );

  const sendCodeToServer = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/flow', {
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
      setMermaidCharts(newMermaidCharts);  // Update the Mermaid chart data
      setSummary(result.summary)
      setMessages([{content: 'Here is the explanation of the code:\n\n' + result.summary, role: 'assistant'}]);
      setReloadCounter(prev => prev + 1);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <>
    <Header />
    <div className="main-container">
      <div className="code-container">
        <div style={{overflowY: 'auto'}}>
          <CodeEditor
            value={parseIndex===-1 ? code : parsedCode[parseIndex]['code']}
            disabled={parseIndex!==-1}
            language="python"
            placeholder="Enter code ..."
            onChange={(evn) => {setCode(evn.target.value); setParsedCode([]); setMermaidCharts({});}}
            padding={15}
            style={{
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              textAlign: 'start',
              fontSize: '16px',
              minWidth: '630px',
              minHeight: '330px',
              border: 'none',
              backgroundColor: "#dddddd",
              resize: 'vertical',
            }}
          />
        </div>
        <div style={{display:'flex', height:'100%', flexDirection:'column-reverse', gap:'10px', overflowY:'auto', minWidth: '120px'}}>
          <button className="chat-button generate-button" onClick={parseCode} disabled={loading || parseIndex!==-1}>Analyse</button>
          <button className="chat-button generate-button" onClick={sendCodeToServer} disabled={loading || parseIndex===-1} style={{marginTop:'20px'}} >Generate</button>
          <button className="chat-button code-button" onClick={()=>{setParseIndex(-1)}} disabled={parseIndex===-1}>code</button>
          {parsedCode.map((val, index) => (
            <button className="chat-button code-button" onClick={() => setParseIndex(index)} disabled={parseIndex===index}>
              {val.name.length < 10 ? val.name : val.name.slice(0,10)+'...'}
            </button>
          ))}
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
              <p class="stylish-text">Click &nbsp; <strong> generate </strong> &nbsp; to visualize code</p>
              :
              <div className="mermaid-display" style={{ width: '100%', height: '100%' }}>
                <Mermaid key={reloadCounter} chart={mermaidCharts[parseIndex]} />
              </div>
        }
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
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
          ))}
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
  </>
  );
}

export default App;















