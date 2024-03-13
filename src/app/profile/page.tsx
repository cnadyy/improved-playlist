'use client'

import { useEffect, useState } from 'react';
import getUsername from '@api/getUsername';

const getDisplayName = (setDisplayName: any) => {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) return;
    getUsername().then(response => {
        console.log(response);
        setDisplayName(response.display_name);
    });
}

export default function Profile() {
    const [displayName, setDisplayName] = useState('Not signed in!')
    
    useEffect(() => {
        getDisplayName(setDisplayName)
    })
    
    return <><a>{displayName}</a></>
}