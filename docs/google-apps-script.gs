// 1. Crea una hoja de cálculo de Google nueva (en tu Drive).
// 2. DESDE ESA HOJA abre Extensiones > Apps Script (el script debe estar vinculado a la hoja,
//    no creado suelto en script.google.com), pega este archivo y guarda.
// 3. En Implementar > Nueva implementación, selecciona "Aplicación web".
//    Ejecutar como: tú. Acceso: cualquiera. Copia la URL /exec resultante.
// 4. Pega esa URL en rsvpEndpoint, dentro de src/app/app.component.ts.
//
// IMPORTANTE: cada vez que cambies este archivo debes publicar una versión nueva en
// Implementar > Administrar implementaciones > (lápiz) > Versión: "Nueva versión" > Implementar.
// Si no, la URL /exec sigue ejecutando el código antiguo.
//
// Para comprobar que todo está bien enlazado, abre la URL /exec en el navegador: debe
// responder con {"ok":true,"sheet":"Respuestas","rows":N}.

const SHEET_NAME = 'Respuestas';
const HEADERS = ['Recibida', 'Nombre', 'Asistencia', 'Acompañantes', 'Canción', 'Alergias / intolerancias', 'Mensaje', 'Idioma'];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || '{}');
    if (data.website) return response({ ok: true }); // campo trampa para bots

    getSheet().appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || '', data.attendance || '', data.guestNames || '',
      data.song || '', data.dietary || '', data.note || '', data.language || ''
    ]);
    return response({ ok: true });
  } catch (error) {
    return response({ ok: false, error: String(error) });
  }
}

// Comprobación rápida: abrir la URL /exec en el navegador.
function doGet() {
  try {
    const sheet = getSheet();
    return response({ ok: true, sheet: sheet.getName(), rows: Math.max(sheet.getLastRow() - 1, 0) });
  } catch (error) {
    return response({ ok: false, error: String(error) });
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('El script no está vinculado a una hoja de cálculo. Créalo desde Extensiones > Apps Script dentro de la hoja.');
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
