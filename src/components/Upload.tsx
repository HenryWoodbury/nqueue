"use client"

import { CloudUpload } from "lucide-react"
import { useState, useRef } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/*
TODO: Show a sample of the uploaded data to confirm?
TODO: Option to overwrite vs only add
TODO: Better messaging and validation
TODO: What am I getting out of Field and Button components?
TODO: Add a clear option (clear file)
TODO: Abstract upload into a more generic component used by each Upload type
*/

interface Upload {
  endpoint: string
  fileType?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  successCallback?: (result: any) => void
}

export function Upload({
  endpoint,
  fileType = ["text/csv"],
  successCallback,
}: Upload) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile && !fileType.includes(selectedFile.type)) {
      // TODO: Customize message based on selectedFile.type
      setMessage("Please select a valid file.")
      setFile(null)
      return
    }
    setFile(selectedFile)
    setMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("Uploading and processing...")
    if (!file) {
      setMessage("Please select a file first.")
      return
    }

    setIsLoading(true)
    setMessage("Uploading and processing...")
    const formData = new FormData()
    formData.append("csvFile", file)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || "Upload failed due to a server error."
        )
      }

      const result = await response.json()
      setMessage(`Success: ${result.rowsImported} records imported.`)
      if (successCallback) successCallback(result)
      setFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: unknown) {
      console.error("Error uploading file:", error)
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <FieldLabel
          htmlFor="csvUpload"
          className="block px-2 py-1 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        >
          {file ? file.name : "No file selected"}
        </FieldLabel>
        <Field>
          <Input
            id="csvUpload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </Field>
      </div>
      <Button
        type="submit"
        disabled={isLoading || !file}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
      >
        <CloudUpload className="size-5" />
        {isLoading ? "Processing..." : "Upload and Save Data"}
      </Button>
      {message && (
        <p
          className={`text-sm ${
            message.startsWith("Error") ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
