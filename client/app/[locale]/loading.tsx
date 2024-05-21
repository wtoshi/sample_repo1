"use client"
import Spinner from "@/components/shared/skeletons/spinner"

export default function Loading() {
  return (
    <div className='w-full h-full  mx-auto my-auto'><Spinner size={10}/></div>
    // <div className='w-full h-full  mx-auto my-auto z-50'>Loading..</div>
  )
}
