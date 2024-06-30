import React from 'react'

interface Message {
    content: string;
    createdAt: string;
  }

function Card({message}:{message:Message}) {
  return (
    <>
      <div className="card w-[35vw] border-2 p-5 m-5 flex flex-col justify-center">
        <div className="message text-2xl">{message.content}</div>
        <div className="date">{message.createdAt}</div>
      </div>
    </>
  )
}

export default Card