'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload } from '@/components/Upload'

import type { PlayerUniverseCsvFields } from '@/types/api'

export default function Admin() {
  // Do something with the result
  const onSuccess = (result: PlayerUniverseCsvFields[]) => {
    console.log(result)
  }
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Admin
      </h1>
      <Dialog>
        <DialogTrigger>Upload Player Universe</DialogTrigger>
        <DialogContent className="w-[90vw] h-[80vh] min-w-[90vw] flex flex-col">
          <DialogHeader>
            <DialogTitle>Upload Player Universe</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Upload draft eligibile players. This should be a CSV file ... 
          </DialogDescription>
          <div className="w-full h-full grow overflow-auto">
            <h2>Player Universe</h2>
            <Upload endpoint='/api/admin/players' successCallback={onSuccess} />
          </div>
        </DialogContent>
      </Dialog>      
    </div>     
  )
}
