// Google Таблица с проектами.
// Доступ к ней должен быть «Все, у кого есть ссылка → Читатель».
export const SHEET_ID = '1pnzyYj-AiN_Fnu-Ul1sIxMGURj48NZmY_lajxVsv0Fk'

// Номер вкладки: число после gid= в адресе таблицы. У первой вкладки это 0.
export const SHEET_GID = '0'

// Ссылки в хиро-блоке. Пока значение пустое, элемент выглядит так же, но не кликается.
export const CONTACTS = {
  email: '', // адрес почты, например 'name@gmail.com'
  telegram: '', // ник в Telegram без @, например 'username'
  cv: '', // ссылка на PDF с резюме (Dropbox, Google Drive и т.п.)
}

export const SHEET_CSV_URL =`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&gid=${SHEET_GID}`
