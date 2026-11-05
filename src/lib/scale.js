import { useSyncExternalStore } from 'react'

// Все размеры на сайте взяты из макета при ширине 1440 и записаны в «единицах макета».
// На экране каждая единица = var(--u). При 3 колонках --u = ширина окна / 1440.
export const GRID = {
  colWidth: 464, // ширина колонки
  gap: 12, // между колонками
  pad: 12, // отступ страницы слева и справа
  top: 38, // от разделителя до карточек: 38 + половина линии = 40, как в макете
  bottom: 120, // пустота под сеткой
  rowGap: 24, // между карточками по вертикали
  caption: 36, // подпись под превью: 6 отступ + 30 строка
}

export const MIN_COLS = 2
export const MAX_COLS = 4

// На узких экранах текст, теги, отступы и скругления крупнее, чем при простом
// уменьшении макета. Ширина колонок от этого не меняется: сетка всё так же на весь экран.
// От 900px и шире увеличения нет, к 480px и уже оно плавно доходит до +30%.
const MOBILE_BOOST = 0.3
const BOOST_FROM = 900
const BOOST_FULL = 480

function mobileBoost(width) {
  const progress = (BOOST_FROM - width) / (BOOST_FROM - BOOST_FULL)
  return 1 + MOBILE_BOOST * Math.min(1, Math.max(0, progress))
}

// Сколько колонок поставить и какой получится масштаб.
// Колонок столько, чтобы каждая была как можно ближе к 464 из макета:
// 2 колонки — до ~1190px, 3 — до ~1666px, дальше 4.
// u — размер единицы макета в px, colWidth — ширина колонки в единицах макета
// (464, если нет мобильного увеличения).
export function scaleFor(width) {
  const step = GRID.colWidth + GRID.gap
  const cols = Math.min(MAX_COLS, Math.max(MIN_COLS, Math.round(width / step)))
  const designWidth = cols * step - GRID.gap + GRID.pad * 2
  const u = (width / designWidth) * mobileBoost(width)
  const colWidth = (width / u - GRID.pad * 2 - GRID.gap * (cols - 1)) / cols
  return { cols, u, colWidth, heroU: heroUnit(width, cols, u) }
}

// Хиро-блок.
// 3–4 колонки: одна строка. Обычно хиро в тех же единицах, что и сетка, а кнопки
// контактов занимают остаток ширины. На очень широких экранах кнопки стали бы
// слишком длинными, поэтому там весь хиро крупнеет, а кнопки не шире HERO_CONTACTS_MAX.
// 2 колонки: две строки, верхняя (фото 345 + 12 + папка 464 = 821)
// растягивается ровно на ширину сетки.
const HERO_FIXED = 345 + 464 + 226 + 12 * 3 // фото, папка, CV и промежутки
const HERO_CONTACTS_MAX = 570
export const HERO_NARROW_WIDTH = 821

function heroUnit(width, cols, u) {
  const available = width - GRID.pad * 2 * u
  if (cols >= 3) return Math.max(u, available / (HERO_FIXED + HERO_CONTACTS_MAX))
  return available / HERO_NARROW_WIDTH
}

function subscribe(callback) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

// Ширина окна без полосы прокрутки
function getWidth() {
  return document.documentElement.clientWidth
}

export function useScale() {
  return scaleFor(useSyncExternalStore(subscribe, getWidth))
}
