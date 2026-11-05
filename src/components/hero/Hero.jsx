import portrait from '../../assets/portrait.jpg'
import { CONTACTS } from '../../config'
import { useScale } from '../../lib/scale'
import ContactButton from './ContactButton'
import CvSheet from './CvSheet'
import NameFolder from './NameFolder'
import './Hero.css'

// Хиро-блок над сеткой проектов.
// 3–4 колонки: всё в одну строку. 2 колонки: две строки (фото + папка, CV + контакты).
export default function Hero() {
  const { cols } = useScale()
  const { email, telegram, cv } = CONTACTS

  return (
    <section className={`hero ${cols >= 3 ? 'hero--wide' : 'hero--narrow'}`}>
      <div className="hero__inner">
        <div className="hero__group hero__group--intro">
          <div className="hero__portrait">
            <img src={portrait} alt="Ivan Skarabahatau" />
          </div>
          <NameFolder />
        </div>

        <div className="hero__group hero__group--contacts">
          <CvSheet href={cv} />
          <div className="hero__contacts">
            <ContactButton type="mail" label="Mail" href={email && `mailto:${email}`} />
            <ContactButton
              type="telegram"
              label="Telegram"
              href={telegram && `https://t.me/${telegram}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
