import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload } from '@/components/Upload'

export default function Admin() {
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
            <Upload title="Player Universe" />
          </div>
        </DialogContent>
      </Dialog>      
    </div>     
  )
}
