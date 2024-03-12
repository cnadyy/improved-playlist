'use client'

import { useSearchParams } from 'next/navigation'

export default function Redirect() {
    const searchParams = useSearchParams();
  const search = searchParams.get('code')
 
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {search}</>
}