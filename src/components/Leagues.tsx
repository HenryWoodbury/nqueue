"use client"

import Link from "next/link"
import { LayersPlus } from "lucide-react"

import { useGetLeagues } from "@/hooks/useFetcher"
import type { LeaguesPayload } from "@/hooks/useFetcher"
import { LoadingSkeleton } from "./Loading"
import type { Draft, League } from "@/types/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

function AddDraft() {
  return (
    <Button variant="outline">
      <LayersPlus /> Add Draft
    </Button>
  )
}

function LeaguesList() {
  const { leagues, error, isLoading }: LeaguesPayload = useGetLeagues()
  if (isLoading) return <LoadingSkeleton />
  if (error)
    return (
      <>
        <p>Error</p>
        <p>{error.message}</p>
      </>
    )

  if (!leagues?.length)
    return (
      <>
        <p>No leagues yet</p>
      </>
    )

  const formatDrafts = (drafts: Draft[]) => {
    if (drafts.length) {
      if (drafts.length === 1) {
        return <Link href={`/draft/${drafts[0].id}`}>{drafts[0].name}</Link>
      } else {
        // Create Combobox?
      }
    }
    return <AddDraft />
  }

  return (
    <>
      <p>Your Leagues</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>League ID</TableHead>
            <TableHead>League Name</TableHead>
            <TableHead>Commissioner</TableHead>
            <TableHead>Drafts</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Updated Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagues.map((league: League) => (
            <TableRow key={league.id}>
              <TableCell>
                <Link href={`/league/${league.id}`}>{league.id}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/league/${league.id}`}>{league.name}</Link>
              </TableCell>
              <TableCell>{league.commissioner}</TableCell>
              <TableCell>{formatDrafts(league.drafts)}</TableCell>
              <TableCell>{new Date(league.createdAt).toDateString()}</TableCell>
              <TableCell>{new Date(league.updatedAt).toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export { LeaguesList }
