'use client'

import { useSearchParams } from 'next/navigation'
import CLIENT_ID from '../secrets';
import { useEffect, useState } from 'react';

function getToken(code: string): Promise<any> {

  // stored in the previous step
  let codeVerifier = window.localStorage.getItem('code_verifier');
  if (!codeVerifier) throw new Error("Code verifier not set");

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

  return fetch('https://accounts.spotify.com/api/token', payload)
    .then(body => body.json())
    .then(response => {
      if (!response.error) {
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
      } else throw new Error("Failed to authenticate")
    });
}


export default function Redirect() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  const [noError, setError] = useState(true);
  
  useEffect(() => {
    if (code) {
      getToken(code)
      .then(() => window.location.href = "/")
      .catch(() => setError(true));
    } else setError(true);
  });
 
  return <>{noError ? <p>Authenticated! Loading....</p> : <p> Failed. Please try again</p>}</>
}