import { NextResponse } from 'next/server'

export async function POST(request) {
  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_URL
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET

  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json(
      { ok: false, error: 'Integrasi Google Sheets belum dikonfigurasi.' },
      { status: 500 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Request tidak valid.' },
      { status: 400 },
    )
  }

  const todoId = typeof body?.todoId === 'string' ? body.todoId.trim() : ''
  const text = typeof body?.text === 'string' ? body.text.trim() : ''

  if (!todoId || !text || text.length > 120) {
    return NextResponse.json(
      { ok: false, error: 'Todo ID atau nama todo tidak valid.' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todoId,
        text,
        updatedAt: new Date().toISOString(),
        secret: webhookSecret,
      }),
      cache: 'no-store',
    })
    const result = await response.json().catch(() => null)

    if (!response.ok || !result?.ok) {
      return NextResponse.json(
        { ok: false, error: result?.error || 'Google Sheets gagal menerima data.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Google Sheets tidak dapat dihubungi.' },
      { status: 502 },
    )
  }
}
