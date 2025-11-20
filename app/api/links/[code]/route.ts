import { NextRequest, NextResponse } from 'next/server'
import { pool } from '../../../lib/db'

// Link interface
interface Link {
  id: number
  shortCode: string
  originalUrl: string
  createdAt: string
  clickCount: number
  lastClickedAt: string | null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const res = await pool.query('SELECT * FROM links WHERE shortCode = $1', [code])
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const link = res.rows[0]
    const transformedLink = {
      id: link.id,
      shortCode: link.shortcode,
      originalUrl: link.originalurl,
      createdAt: link.createdat,
      clickCount: link.clickcount,
      lastClickedAt: link.lastclickedat
    }

    return NextResponse.json(transformedLink)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const res = await pool.query('DELETE FROM links WHERE shortCode = $1', [code])
    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Link deleted' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}