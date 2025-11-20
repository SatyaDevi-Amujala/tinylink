import { NextRequest, NextResponse } from 'next/server'
import { pool } from '../../lib/db'

// Link interface matching DB
interface Link {
  id: number
  shortCode: string
  originalUrl: string
  createdAt: string
  clickCount: number
  lastClickedAt: string | null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received body:', body)  // Log the received data
    const { originalUrl, shortCode } = body

    if (!originalUrl || typeof originalUrl !== 'string' || !isValidUrl(originalUrl)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    if (shortCode && (typeof shortCode !== 'string' || !isValidShortCode(shortCode))) {
      return NextResponse.json({ error: 'Invalid short code' }, { status: 400 })
    }

    // Generate random code if not provided
    const code = shortCode || generateShortCode()

    // Check if code exists
    const existingRes = await pool.query('SELECT * FROM links WHERE shortCode = $1', [code])
    if (existingRes.rows.length > 0) {
      return NextResponse.json({ error: 'Short code already exists' }, { status: 409 })
    }

    // Insert link
    await pool.query('INSERT INTO links (shortCode, originalUrl) VALUES ($1, $2)', [code, originalUrl])

    // Get the inserted link
    const newRes = await pool.query('SELECT * FROM links WHERE shortCode = $1', [code])
    const link = newRes.rows[0]

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    // Get total count
    const countRes = await pool.query('SELECT COUNT(*) FROM links')
    const total = parseInt(countRes.rows[0].count, 10)

    // Get paginated data
    const res = await pool.query('SELECT * FROM links ORDER BY createdAt DESC LIMIT $1 OFFSET $2', [limit, offset])

    return NextResponse.json({ data: res.rows, total, page, limit })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.hostname.includes('.') && url.hostname.length > 3
  } catch (_) {
    return false
  }
}

function isValidShortCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code)
}

function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}