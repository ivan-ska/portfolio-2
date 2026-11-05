import { useHover } from '../../lib/hover'
import IconMail from '../icons/IconMail'
import IconTelegram from '../icons/IconTelegram'
import HeroLink from './HeroLink'

// Кнопка контакта: подпись слева, иконка справа, линия снизу.
// type — 'mail' или 'telegram', от него зависят цвет и иконка.
export default function ContactButton({ type, label, href }) {
  const [active, hoverProps] = useHover()

  return (
    <HeroLink
      href={href}
      external={type !== 'mail'}
      className={`contact-button contact-button--${type}${active ? ' is-active' : ''}`}
      {...hoverProps}
    >
      <span className="text-heading text-trim">{label}</span>
      {type === 'mail' ? (
        <IconMail open={active} className="contact-button__icon" />
      ) : (
        <IconTelegram typing={active} className="contact-button__icon" />
      )}
    </HeroLink>
  )
}
