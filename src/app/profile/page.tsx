'use client'

import { useEffect, useState } from 'react';
import getUserData from '@api/getUserData';
import { useSearchParams } from 'next/navigation';

function getDisplayName(setDisplayName: Function) {
    getUserData()
        .then(res => setDisplayName(res.display_name));
}

export default function Profile() {
    const [displayName, setDisplayName] = useState("loading...");
    
    useEffect(() => {
        getDisplayName(setDisplayName)
    }, []);
    
    return <><a>{displayName}</a></>
}