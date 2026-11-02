import './Tag.css'

// Название тега в таблице → класс со стилем в Tag.css.
// Тег, которого нет в списке, показывается в нейтральном сером стиле.
const VARIANTS = {
  web: 'web',
  graphic: 'graphic',
  'ui/ux': 'uiux',
}

export default function Tag({ name }) {
  const variant = VARIANTS[name.toLowerCase()] ?? 'default'
  return <span className={`tag tag--${variant}`}>{name}</span>
}
