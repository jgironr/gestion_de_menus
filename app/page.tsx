"use client"
import {signOut} from 'next-auth/react'

function HomePage() {
  return (
    <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div>
        <h1 className="text-white text-5xl">Home</h1>
        
      </div>
    </section>
  )
}
export default HomePage