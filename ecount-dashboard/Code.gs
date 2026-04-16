const SHEET_NAMES = {
  CONFIG: 'config',
  RAW: 'raw_sales',
  DASHBOARD: 'dashboard_base',
  LOGS: 'sync_logs',
};

const RAW_HEADERS = [
  'sale_date',
  'slip_no',
  'order_no',
  'customer_code',
  'customer_name',
  'item_code',
  'item_name',
  'qty',
  'supply_amount',
  'vat_amount',
  'total_amount',
  'channel',
  'sales_rep',
  'status',
  'updated_at',
  'sync_batch_at',
];

const DASHBOARD_HEADERS = [
  'sale_date',
  'year_month',
  'channel',
  'sales_rep',
  'customer_name',
  'item_name',
  'gross_sales',
  'cancel_amount',
  'final_sales',
  'qty',
  'last_sync_at',
];

const LOG_HEADERS = [
  'run_at',
  'mode',
  'status',
  'row_count',
  'message',
];

function initializeProject() {
  getOrCreateSheet_(SHEET_NAMES.CONFIG, ['key', 'value']);
  getOrCreateSheet_(SHEET_NAMES.RAW, RAW_HEADERS);
  getOrCreateSheet_(SHEET_NAMES.DASHBOARD, DASHBOARD_HEADERS);
  getOrCreateSheet_(SHEET_NAMES.LOGS, LOG_HEADERS);

  const defaults = {
    BASE_URL: 'https://oapi.ecount.com',
    TOKEN_PATH: '/OAPI/V2/OAuth2/Token',
    SALES_PATH: '/OAPI/V2/Sales/GetSalesList',
    TOKEN_FIELD: 'access_token',
    DATA_FIELD: 'Data',
    START_DATE_FIELD: 'start_date',
    END_DATE_FIELD: 'end_date',
    LOOKBACK_DAYS: '0',
    COMPANY_CODE: '',
    API_ID: '',
    API_SECRET: '',
    START_DATE: '',
    MONTHLY_TARGET: '',
    LAST_SYNC_AT: '',
  };

  Object.keys(defaults).forEach((key) => {
    if (!getConfigValue_(key)) {
      setConfigValue_(key, defaults[key]);
    }
  });
}

function syncSalesMain() {
  syncSalesData_({ mode: 'MAIN', daysBack: 0 });
}

function syncSalesRetry() {
  syncSalesData_({ mode: 'RETRY', daysBack: 0 });
}

function syncRecent3Days() {
  syncSalesData_({ mode: 'BACKFILL', daysBack: 2 });
}

function syncSalesData_(options) {
  const now = new Date();
  const config = getConfigMap_();
  const fallbackDaysBack = Number(config.LOOKBACK_DAYS || 0);
  const range = buildDateRange_(now, options.daysBack ?? fallbackDaysBack);

  try {
    const rows = fetchSalesFromEcount_(config, range);
    upsertRawSales_(rows, now);
    rebuildDashboardBase_(now);
    setConfigValue_('LAST_SYNC_AT', formatDateTime_(now));
    appendLog_(now, options.mode, 'SUCCESS', rows.length, 'Sync complete');
    Logger.log(`Sync complete. mode=${options.mode}, rows=${rows.length}`);
  } catch (error) {
    appendLog_(now, options.mode, 'FAILED', 0, String(error));
    throw error;
  }
}

function buildDateRange_(baseDate, daysBack) {
  const tz = Session.getScriptTimeZone() || 'Asia/Seoul';
  const end = new Date(baseDate);
  const start = new Date(baseDate);
  start.setDate(start.getDate() - daysBack);
  start.setHours(0, 0, 0, 0);

  return {
    startDate: Utilities.formatDate(start, tz, 'yyyy-MM-dd'),
    endDate: Utilities.formatDate(end, tz, 'yyyy-MM-dd'),
    syncAt: Utilities.formatDate(end, tz, 'yyyy-MM-dd HH:mm:ss'),
  };
}

function fetchSalesFromEcount_(config, range) {
  const baseUrl = config.BASE_URL || 'https://oapi.ecount.com';
  const companyCode = config.COMPANY_CODE;
  const apiId = config.API_ID;
  const apiSecret = config.API_SECRET;
  const salesPath = config.SALES_PATH || '/OAPI/V2/Sales/GetSalesList';
  const dataField = config.DATA_FIELD || 'Data';
  const startDateField = config.START_DATE_FIELD || 'start_date';
  const endDateField = config.END_DATE_FIELD || 'end_date';

  if (!companyCode || !apiId || !apiSecret) {
    throw new Error('config sheet is missing COMPANY_CODE, API_ID, or API_SECRET.');
  }

  const token = getAccessToken_(baseUrl, companyCode, apiId, apiSecret);

  const endpoint = buildUrl_(baseUrl, salesPath);
  const payload = {};
  payload[startDateField] = range.startDate;
  payload[endDateField] = range.endDate;

  const response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const status = response.getResponseCode();
  const body = response.getContentText();
  if (status >= 300) {
    throw new Error(`매출 조회 실패 (${status}): ${body}`);
  }

  const parsed = JSON.parse(body);
  const list = getNestedValue_(parsed, dataField) || parsed.Data || parsed.data || [];
  return list.map((item) => mapSalesRow_(item));
}

function getAccessToken_(baseUrl, companyCode, apiId, apiSecret) {
  const config = getConfigMap_();
  const tokenPath = config.TOKEN_PATH || '/OAPI/V2/OAuth2/Token';
  const tokenField = config.TOKEN_FIELD || 'access_token';
  const endpoint = buildUrl_(baseUrl, tokenPath);
  const payload = {
    company_code: companyCode,
    api_id: apiId,
    api_secret: apiSecret,
  };

  const response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const status = response.getResponseCode();
  const body = response.getContentText();
  if (status >= 300) {
    throw new Error(`인증 실패 (${status}): ${body}`);
  }

  const parsed = JSON.parse(body);
  return getNestedValue_(parsed, tokenField) || parsed.access_token || parsed.AccessToken || '';
}

function mapSalesRow_(item) {
  return {
    sale_date: item.sale_date || item.io_date || item.date || '',
    slip_no: item.slip_no || item.seq_no || '',
    order_no: item.order_no || item.orderNum || '',
    customer_code: item.customer_code || item.cust_code || '',
    customer_name: item.customer_name || item.cust_name || '',
    item_code: item.item_code || item.prod_cd || '',
    item_name: item.item_name || item.prod_des || '',
    qty: Number(item.qty || 0),
    supply_amount: Number(item.supply_amount || item.supply_amt || 0),
    vat_amount: Number(item.vat_amount || item.vat_amt || 0),
    total_amount: Number(item.total_amount || item.total_amt || 0),
    channel: item.channel || item.sale_channel || '',
    sales_rep: item.sales_rep || item.emp_name || '',
    status: item.status || item.order_status || '정상',
    updated_at: item.updated_at || item.write_date || '',
  };
}

function upsertRawSales_(rows, syncDate) {
  const sheet = getOrCreateSheet_(SHEET_NAMES.RAW, RAW_HEADERS);
  const values = sheet.getDataRange().getValues();
  const syncAt = formatDateTime_(syncDate);

  const indexByKey = {};
  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    const key = buildRowKey_({
      slip_no: row[1],
      order_no: row[2],
    });
    if (key) indexByKey[key] = i + 1;
  }

  rows.forEach((row) => {
    const key = buildRowKey_(row);
    const rowValues = RAW_HEADERS.map((header) =>
      header === 'sync_batch_at' ? syncAt : row[header] ?? ''
    );

    if (key && indexByKey[key]) {
      sheet.getRange(indexByKey[key], 1, 1, RAW_HEADERS.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }
  });
}

function rebuildDashboardBase_(syncDate) {
  const rawSheet = getOrCreateSheet_(SHEET_NAMES.RAW, RAW_HEADERS);
  const dashboardSheet = getOrCreateSheet_(SHEET_NAMES.DASHBOARD, DASHBOARD_HEADERS);
  const values = rawSheet.getDataRange().getValues();
  const syncAt = formatDateTime_(syncDate);
  const output = [DASHBOARD_HEADERS];

  for (let i = 1; i < values.length; i += 1) {
    const row = toObject_(RAW_HEADERS, values[i]);
    const totalAmount = Number(row.total_amount || 0);
    const isCancelled = ['취소', '반품'].includes(String(row.status || '').trim());
    const cancelAmount = isCancelled ? totalAmount : 0;
    const finalSales = isCancelled ? 0 : totalAmount;

    output.push([
      row.sale_date,
      String(row.sale_date || '').slice(0, 7),
      row.channel,
      row.sales_rep,
      row.customer_name,
      row.item_name,
      totalAmount,
      cancelAmount,
      finalSales,
      Number(row.qty || 0),
      syncAt,
    ]);
  }

  dashboardSheet.clearContents();
  dashboardSheet.getRange(1, 1, output.length, DASHBOARD_HEADERS.length).setValues(output);
}

function getConfigMap_() {
  const sheet = getOrCreateSheet_(SHEET_NAMES.CONFIG, ['key', 'value']);
  const values = sheet.getDataRange().getValues();
  const config = {};

  for (let i = 1; i < values.length; i += 1) {
    const key = values[i][0];
    const value = values[i][1];
    if (key) config[key] = value;
  }
  return config;
}

function getConfigValue_(key) {
  const sheet = getOrCreateSheet_(SHEET_NAMES.CONFIG, ['key', 'value']);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i += 1) {
    if (values[i][0] === key) {
      return values[i][1];
    }
  }
  return '';
}

function setConfigValue_(key, value) {
  const sheet = getOrCreateSheet_(SHEET_NAMES.CONFIG, ['key', 'value']);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i += 1) {
    if (values[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
}

function getOrCreateSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader =
    currentHeaders.filter(Boolean).length === 0 ||
    headers.some((header, index) => currentHeaders[index] !== header);

  if (needsHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function buildRowKey_(row) {
  return row.slip_no || row.order_no || '';
}

function toObject_(headers, row) {
  const result = {};
  headers.forEach((header, index) => {
    result[header] = row[index];
  });
  return result;
}

function formatDateTime_(date) {
  const tz = Session.getScriptTimeZone() || 'Asia/Seoul';
  return Utilities.formatDate(date, tz, 'yyyy-MM-dd HH:mm:ss');
}

function appendLog_(date, mode, status, rowCount, message) {
  const sheet = getOrCreateSheet_(SHEET_NAMES.LOGS, LOG_HEADERS);
  sheet.appendRow([
    formatDateTime_(date),
    mode,
    status,
    rowCount,
    message,
  ]);
}

function buildUrl_(baseUrl, path) {
  if (!path) return baseUrl;
  if (/^https?:\/\//i.test(path)) return path;
  return `${String(baseUrl).replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
}

function getNestedValue_(obj, path) {
  if (!path) return '';
  return String(path)
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
}

function setupDailyTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    const handler = trigger.getHandlerFunction();
    if (handler === 'syncSalesMain' || handler === 'syncSalesRetry') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('syncSalesMain')
    .timeBased()
    .everyDays(1)
    .atHour(16)
    .nearMinute(0)
    .create();

  ScriptApp.newTrigger('syncSalesRetry')
    .timeBased()
    .everyDays(1)
    .atHour(16)
    .nearMinute(10)
    .create();
}
