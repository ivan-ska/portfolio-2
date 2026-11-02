// Google Таблица с проектами.
// Доступ к ней должен быть «Все, у кого есть ссылка → Читатель».
export const SHEET_ID = '1pnzyYj-AiN_Fnu-Ul1sIxMGURj48NZmY_lajxVsv0Fk'

// Номер вкладки: число после gid= в адресе таблицы. У первой вкладки это 0.
export const SHEET_GID = '0'

export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&gid=${SHEET_GID}`
