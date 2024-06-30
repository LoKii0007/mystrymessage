import { FormatDate } from '@/utils/formatDate';
import React from 'react'

interface Message {
  content: string;
  createdAt: string;
  _id: string;
}

function Card({ message, onDelete }: { message: Message, onDelete: ()=> void }) {
  return (
    <>
      <div className="card w-[47%] border-2 p-5 rounded-lg my-5 flex flex-col">
        <div className="card-body pb-5 flex w-full justify-between">
          <div className="message text-xl">{message.content}</div>
          <button onClick={onDelete} className="delete-btn rounded-md"><i className="bi bi-trash3-fill"></i></button>
        </div>
        <div className="card-bottom">
          <div className="date">{FormatDate(message.createdAt)}</div>
        </div>
      </div>
    </>
  )
}

export default Card