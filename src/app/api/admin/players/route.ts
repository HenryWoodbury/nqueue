import { NextRequest, NextResponse } from "next/server"
import csv from "csv-parser"
import { Readable } from "stream"
import prisma from "@/lib/prisma"
import type { PlayerUniverseCsvFields, PlayerCreateInput } from "@/types/api"

/*

TODO: Create the upload rosters route. That one will have commissioner protection.
TODO: Drill down and figure out the type assertions for withAccelerate vs pg adapter.

*/

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    // 'csvFile' matches the 'name'/'append' used on the frontend FormData
    const file = formData.get("csvFile") as Blob | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    // Convert Blob to a Buffer for compatibility with Node.js streams
    const buffer = Buffer.from(await file.arrayBuffer())
    const parsedData: PlayerUniverseCsvFields[] = []

    // Process the buffer as a stream using csv-parser
    await new Promise<void>((resolve, reject) => {
      Readable.from(buffer)
        .pipe(csv())
        .on("data", (data: PlayerUniverseCsvFields) => parsedData.push(data))
        .on("end", () => resolve())
        .on("error", (error) => reject(error))
    })

    const playerUniverseArray: PlayerCreateInput[] = parsedData
      .map((row) => ({
        ottoneuId: row["Ottoneu ID"].trim(),
        name: row["Name"]?.trim(),
        fangraphsId: row["FG ID"]?.trim() || row["FG Minor ID"]?.trim() || null,
        mlbamId: row["MLBAM ID"]?.trim() || null,
        birthday: row["Birthday"]?.trim() || null,
        positions: row["Ottoneu Positions"]?.trim() || null,
      }))
      .filter((user) => user.ottoneuId) // Ensure essential fields exist

    if (playerUniverseArray.length === 0) {
      return NextResponse.json(
        { message: "No valid data found in CSV." },
        { status: 400 }
      )
    }

    // Insert all valid records into the PostgreSQL database
    const result = await prisma["playerUniverse"].createMany({
      data: playerUniverseArray,
      skipDuplicates: true, // Avoid duplicate entries
    })

    return NextResponse.json({
      message: "File processed and data saved successfully",
      rowsImported: result.count,
    })
  } catch (error) {
    console.error("Error during CSV import:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
