'use client';

import {useEffect, useRef, useState} from 'react';

// import * as THREE from 'three';
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function Home() {

  const canvasRef = useRef();
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const handleSubmit = async (e) =>{
    e.preventDefault();
   // 폼 데이터를 서버로 전송하는 로직
   const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: outputValue, // 'outputValue'를 사용하여 서버에 전송
    }),
  });

  // 서버 응답 처리
  const data = await response.json();
  console.log(data);
};

  const handleSendMessage = async () => {
  // ChatGPT API를 호출하여 결과를 받고, 결과를 변수에 저장합니다.
  const generatedOutput = await getMessage(inputValue);
 // 결과를 outputValue 상태에 저장합니다.
 setOutputValue(generatedOutput || '');

 // 입력 필드를 초기화합니다.
 setInputValue('');
};
// useEffect를 사용하여 outputValue 상태가 변경될 때 데이터베이스로 전송합니다.
useEffect(() => {
  const sendOutputToDatabase = async () => {
    if (outputValue) {
      await sendToDatabase(outputValue);
    }
  };

  sendOutputToDatabase();
}, [outputValue]);
return(
  <div>
  <canvas ref={canvasRef} style = {{width:'100%',height:'100%'}}/>
  <div>
  <form onSubmit={handleSubmit}>
  <input
          type="text"
          placeholder="당신의 비어있는 공간은 어디입니까?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
  />
    <button onClick = {handleSendMessage}>SEND</button>

    
      <textarea name = "title" value = {outputValue} onChange = {(e)=> setOutputValue(e.target.value)} />
      {/* <button type = "submit">SEND</button> */}
    </form> 
  </div>
  <div style = {{width:`${loadingProgress}%`}}>Loading...</div>
  </div>
);
}
async function sendToDatabase(content) {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: content }), // 'content'를 사용하여 서버에 전송
  });

  // 서버 응답 처리
  const data = await response.json();
  console.log(data);
}

async function getMessage(input){
  console.log('getMessage');
  const API_KEY = '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';
  const options = {
      method:'POST',
      headers:{
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
      },
      body:JSON.stringify({
          model: "gpt-3.5-turbo",
          messages:[{role:"user",content: input + "이 단어를 평화로운 시 한문장으로 바꿔주세요."}],
          max_tokens: 100,
      })
  }
  try{
      const response = await fetch('https://api.openai.com/v1/chat/completions',options)
      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      }
   
  }catch(error){
      console.log(error);
  }
}