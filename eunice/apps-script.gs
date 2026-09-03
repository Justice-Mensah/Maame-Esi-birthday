/**
 * Eunice birthday page — visit logger.
 *
 * This receives each visitor's IP + location from the page and appends a row
 * to your Google Sheet. Nothing is stored in any database — just your Sheet.
 *
 * ── SETUP (about 5 minutes) ─────────────────────────────────────────────
 * 1. Create a new Google Sheet (sheets.new). Name it e.g. "Eunice Visits".
 * 2. Extensions ▸ Apps Script. Delete the sample code, paste ALL of this.
 * 3. Click Save (disk icon).
 * 4. Deploy ▸ New deployment ▸ (gear) Web app.
 *      - Description:  visit logger
 *      - Execute as:   Me
 *      - Who has access: Anyone
 *    Deploy ▸ Authorize access ▸ allow.
 * 5. Copy the "Web app" URL (ends with /exec).
 * 6. Paste that URL into index.html →  window.LOG_ENDPOINT = "...".
 *
 * Re-deploying: if you edit this script later, do Deploy ▸ Manage deployments
 * ▸ edit ▸ Version: New version, so the /exec URL keeps working.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Visits') || ss.insertSheet('Visits');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Time', 'IP', 'City', 'Region', 'Country',
        'Latitude', 'Longitude', 'Coordinates (map)', 'ISP',
        'Device', 'Language', 'Screen', 'Timezone', 'Referrer', 'Page'
      ]);
      sheet.setFrozenRows(1);
    }

    var lat = data.latitude || '';
    var lng = data.longitude || '';
    var mapLink = (lat && lng)
      ? '=HYPERLINK("https://www.google.com/maps?q=' + lat + ',' + lng + '","' + lat + ', ' + lng + '")'
      : '';

    sheet.appendRow([
      new Date(),
      data.ip || '', data.city || '', data.region || '', data.country || '',
      lat, lng, mapLink, data.isp || '',
      data.user_agent || '', data.language || '', data.screen || '',
      data.timezone || '', data.referrer || '', data.page || ''
    ]);

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

function doGet() {
  return ContentService.createTextOutput('Eunice visit logger is running.');
}
