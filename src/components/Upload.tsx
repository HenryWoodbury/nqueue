import { CloudUpload } from "lucide-react"

import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import {
  Button
} from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Upload({ title }: { title: string }) {
  return (
    <div className="w-full max-w-md">
      <form>
        <Field>
          <FieldLabel htmlFor="file-upload">{title}</FieldLabel>
          <div className="flex w-full justify-center items-center gap-2">
            <Input id="file-upload" type="file" className="block" />
            <Button variant="outline" className="icon"><CloudUpload /></Button>
          </div>
        </Field>
      </form>
    </div>
  )
}
