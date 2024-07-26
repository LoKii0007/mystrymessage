import { FormatDate } from '@/utils/formatDate';
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface Message {
  content: string;
  createdAt: string;
  _id: string;
}

function Card({ message, onDelete }: { message: Message, onDelete: () => void }) {
  return (
    <>
      <div className="card md:w-[47%] w-full border-2 p-5 rounded-lg my-5 flex bg-neutral-50 flex-col">
        <div className="card-body pb-5 flex w-full justify-between">
          <div className="message text-xl">{message.content}</div>
          {/* <Button onClick={onDelete} variant="destructive"><i className="bi bi-trash3-fill"></i></Button> */}
          <AlertDialog>
            <AlertDialogTrigger><i className="bi bi-trash3-fill p-4"></i></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction  onClick={onDelete} ><i className="bi bi-trash3-fill"></i></AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* <button onClick={onDelete} className="delete-btn rounded-md"><i className="bi bi-trash3-fill"></i></button> */}
        </div>
        <div className="card-bottom">
          <div className="date">{FormatDate(message.createdAt)}</div>
        </div>
      </div>
    </>
  )
}

export default Card