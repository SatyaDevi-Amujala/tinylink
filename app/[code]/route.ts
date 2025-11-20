import { NextRequest, NextResponse } from 'next/server'
import { pool } from '../lib/db'

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
    console.log('Redirect request for code:', code)

    const res = await pool.query('SELECT * FROM links WHERE shortCode = $1', [code])
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const link = res.rows[0]

    // Increment click count and update last clicked
    await pool.query('UPDATE links SET clickCount = clickCount + 1, lastClickedAt = NOW() WHERE shortCode = $1', [code])

    // Redirect to original URL
    return NextResponse.redirect(link.originalurl, { status: 302 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}