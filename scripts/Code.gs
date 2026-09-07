const SHEET_HEADERS = ['Todo ID', 'Todo', 'Updated At']
const SHEET_TIMEZONE = 'Asia/Jakarta'

function doPost(e) {
  const lock = LockService.getScriptLock()

  try {
    lock.waitLock(10000)

    const body = JSON.parse(e.postData.contents)
    const expectedSecret = PropertiesService
      .getScriptProperties()
      .getProperty('WEBHOOK_SECRET')

    if (!expectedSecret || body.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'Unauthorized.' })
    }

    if (!body.todoId || !body.text) {
      return jsonResponse({ ok: false, error: 'Data todo tidak lengkap.' })
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    ensureHeaders(sheet)

    const lastRow = sheet.getLastRow()
    const rows = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, 3).getValues()
      : []
    const todoId = String(body.todoId)
    const updatedAt = formatUpdatedAt(body.updatedAt)

    for (let index = 0; index < rows.length; index += 1) {
      if (String(rows[index][0]) === todoId) {
        const rowNumber = index + 2
        sheet.getRange(rowNumber, 2, 1, 2).setValues([[String(body.text), updatedAt]])
        return jsonResponse({ ok: true, action: 'updated' })
      }
    }

    sheet.appendRow([todoId, String(body.text), updatedAt])
    return jsonResponse({ ok: true, action: 'inserted' })
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || 'Internal error.' })
  } finally {
    lock.releaseLock()
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS])
    return
  }

  const headers = sheet.getRange(1, 1, 1, SHEET_HEADERS.length).getValues()[0]
  if (headers.join('|') !== SHEET_HEADERS.join('|')) {
    throw new Error('Header Sheet harus: Todo ID | Todo | Updated At')
  }
}

function formatUpdatedAt(value) {
  const date = value ? new Date(value) : new Date()
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date
  return Utilities.formatDate(validDate, SHEET_TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
