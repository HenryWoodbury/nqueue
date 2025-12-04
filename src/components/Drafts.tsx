'use client'

import Link from 'next/link'
import { Trash2 } from 'lucide-react'

import {useGetDrafts} from '@/hooks/useFetcher'
import { LoadingSkeleton } from './Loading'
import type { Draft } from '@/types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {  Button } from '@/components/ui/button'

function DraftsList() {
  const { drafts, isLoading, isError } = useGetDrafts()
  if (isLoading) return (
    <LoadingSkeleton />
  )
  if (isError) return (
    <>
      <p>Error</p>
      <p>{isError.errorMessage}</p>
    </>
  )

  if (drafts.length === 0) return (
    <>
      <p>No drafts yet</p>
    </>
  )

  return (
    <>
      <p>
        Your Drafts
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Draft ID
            </TableHead>
            <TableHead>
              Draft Name
            </TableHead>
            <TableHead>
              Created Date
            </TableHead>
            <TableHead>
              Updated Date
            </TableHead>
            <TableHead>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drafts.map((draft: Draft) => (
            <TableRow key={draft.id}>
              <TableCell>
                <Link href={`/drafts/${draft.id}`}>
                  {draft.id}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/drafts/${draft.id}`}>
                  {draft.draftName}
                </Link>
              </TableCell>
              <TableCell>
                {new Date(draft.createdAt).toDateString()}
              </TableCell>
              <TableCell>
                {new Date(draft.updatedAt).toDateString()}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon-sm" className="text-red-600"><Trash2 /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export {DraftsList}