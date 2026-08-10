// 1. Crea una hoja de cálculo de Google nueva.
// 2. Abre Extensiones > Apps Script, pega este archivo y guarda.
// 3. En Implementar > Nueva implementación, selecciona "Aplicación web".
//    Ejecutar como: tú. Acceso: cualquiera. Copia la URL /exec resultante.
// 4. Pega esa URL en rsvpEndpoint, dentro de src/app/app.component.ts.

const SHEET_NAME = 'Respuestas';
const HEADERS = ['Recibida', 'Nombre', 'Asistencia', 'Acompañantes', 'Canción', 'Alergias / intolerancias', 'Mensaje'];

function doPost(event) {
  const data = JSON.parse(event.postData.contents || '{}');
  if (data.website) return response({ ok: true }); // campo trampa para bots

  const sheet = getSheet();
  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.name || '', data.attendance || '', data.guestNames || '',
    data.song || '', data.dietary || '', data.note || ''
  ]);
  return response({ ok: true });
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
