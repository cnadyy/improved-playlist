'use client'

import { useSearchParams } from 'next/navigation'
import CLIENT_ID from '../secrets';
import { useEffect, useState } from 'react';

function getToken(code: string, setAccessToken: any) {

  // stored in the previous step
  let codeVerifier = window.localStorage.getItem('code_verifier');
  if (!codeVerifier) return

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/redirect',
      code_verifier: codeVerifier,
    }),
  }

  fetch('https://accounts.spotify.com/api/token', payload)
    .then(body => body.json())
    .then(response => {
      if (!response.error) {
        console.log(response)
        setAccessToken(response.access_token);
        localStorage.setItem('access_token', response.access_token)
      }
    });
}


export default function Redirect() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  const [accessToken, setAccessToken] = useState("Not loaded");
  
  useEffect(() => {
    if (code) {
      getToken(code, setAccessToken);
    }
  }, []);
 
  return <>Code: {accessToken}</>
}