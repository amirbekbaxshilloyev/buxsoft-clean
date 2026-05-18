const CONFIG = {
  SPREADSHEET_ID: '1FMmnrl2luQNSVqKfsXRv6RfKFHDW53k4JPeo9iQN7_s',
  SHEETS: {
    SETTINGS: 'SETTINGS',
    CATEGORIES: 'CATEGORIES',
    TARIFFS: 'TARIFFS',
    SERVICES: 'SERVICES',
    TESTIMONIALS: 'TESTIMONIALS',
    FAQ: 'FAQ',
    STATS: 'STATS',
    LEADS: 'LEADS',
  },
};

function doGet() {
  try {
    return jsonResponse({ success: true, data: getWebsiteContent(), timestamp: new Date().toISOString() });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message || 'Unknown server error' });
  }
}

function doPost(e) {
  try {
    const body = parseBody(e);
    const lead = validateLead(body);
    saveLead(lead);
    sendTelegramNotification(lead);
    return jsonResponse({ success: true, message: 'Lead saved successfully' });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message || 'Lead submit failed' });
  }
}

function getWebsiteContent() {
  return {
    settings: readSettings(),
    categories: readTable(CONFIG.SHEETS.CATEGORIES),
    tariffs: readTable(CONFIG.SHEETS.TARIFFS),
    services: readTable(CONFIG.SHEETS.SERVICES),
    testimonials: readTable(CONFIG.SHEETS.TESTIMONIALS),
    faq: readTable(CONFIG.SHEETS.FAQ),
    stats: readTable(CONFIG.SHEETS.STATS),
  };
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function readSettings() {
  const sheet = getSpreadsheet().getSheetByName(CONFIG.SHEETS.SETTINGS);
  if (!sheet) throw new Error('SETTINGS sheet not found');
  const values = sheet.getDataRange().getValues();
  const settings = {};
  values.slice(1).forEach(function(row) {
    const key = String(row[0] || '').trim();
    if (key) settings[key] = normalizeValue(row[1]);
  });
  return settings;
}

function readTable(sheetName) {
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(sheetName + ' sheet not found');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(function(header) { return String(header || '').trim(); });
  return values.slice(1)
    .filter(function(row) { return row.some(function(cell) { return cell !== '' && cell !== null; }); })
    .map(function(row) {
      const item = {};
      headers.forEach(function(header, index) {
        if (header) item[header] = normalizeValue(row[index]);
      });
      return item;
    })
    .filter(function(item) {
      if (Object.prototype.hasOwnProperty.call(item, 'active')) return item.active === true || item.active === 'TRUE' || item.active === 'true';
      return true;
    })
    .sort(function(a, b) { return Number(a.sort || 0) - Number(b.sort || 0); });
}

function normalizeValue(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const clean = value.trim();
    if (clean === 'TRUE') return true;
    if (clean === 'FALSE') return false;
    return clean;
  }
  return value;
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Empty request body');
  try { return JSON.parse(e.postData.contents); } catch (error) { throw new Error('Invalid JSON body'); }
}

function validateLead(body) {
  const lead = {
    date: new Date(),
    name: String(body.name || '').trim(),
    company: String(body.company || '').trim(),
    phone: String(body.phone || '').trim(),
    telegram: String(body.telegram || '').trim(),
    industry: String(body.industry || '').trim(),
    tariff: String(body.tariff || '').trim(),
    services: Array.isArray(body.services) ? body.services.join(', ') : String(body.services || ''),
    total: Number(body.total || 0),
    comment: String(body.comment || '').trim(),
    status: 'new',
  };
  if (!lead.name) throw new Error('Name is required');
  if (!lead.phone && !lead.telegram) throw new Error('Phone or Telegram is required');
  return lead;
}

function saveLead(lead) {
  const sheet = getSpreadsheet().getSheetByName(CONFIG.SHEETS.LEADS);
  if (!sheet) throw new Error('LEADS sheet not found');
  sheet.appendRow([lead.date, lead.name, lead.company, lead.phone, lead.telegram, lead.industry, lead.tariff, lead.services, lead.total, lead.comment, lead.status]);
}

function sendTelegramNotification(lead) {
  const properties = PropertiesService.getScriptProperties();
  const botToken = properties.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = properties.getProperty('TELEGRAM_CHAT_ID');
  if (!botToken || !chatId) return;

  const message =
    '🧾 *Yangi BuxSoft lead*\n\n' +
    '*Ism:* ' + escapeTelegram(lead.name) + '\n' +
    '*Kompaniya:* ' + escapeTelegram(lead.company || '-') + '\n' +
    '*Telefon:* ' + escapeTelegram(lead.phone || '-') + '\n' +
    '*Telegram:* ' + escapeTelegram(lead.telegram || '-') + '\n' +
    '*Faoliyat:* ' + escapeTelegram(lead.industry || '-') + '\n' +
    '*Tarif:* ' + escapeTelegram(lead.tariff || '-') + '\n' +
    '*Xizmatlar:* ' + escapeTelegram(lead.services || '-') + '\n' +
    '*Jami:* ' + escapeTelegram(String(lead.total || 0)) + ' so‘m\n' +
    '*Izoh:* ' + escapeTelegram(lead.comment || '-') + '\n' +
    '*Vaqt:* ' + escapeTelegram(new Date().toLocaleString('uz-UZ'));

  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'MarkdownV2' }),
    muteHttpExceptions: true,
  });
}

function escapeTelegram(value) {
  return String(value || '').replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
