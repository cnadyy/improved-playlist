'use client'

import authenticate from '@/api/authenticate';

export default function page() {
    return (
        <div>
            <h2>You are not yet authenticated to use this appliaction</h2>
            <p>Click <a style={{color: "blue", textDecoration: "underline", cursor: "pointer"}} onClick={authenticate}>here</a> to authenticate</p>
        </div>
    )
}