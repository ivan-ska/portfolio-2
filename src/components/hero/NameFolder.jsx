import IconArrow from '../icons/IconArrow'

// Папка с именем. При наведении листок за папкой выравнивается, стрелка наклоняется.
export default function NameFolder() {
  return (
    <div className="name-folder">
      <svg className="name-folder__shape" viewBox="0 0 464 345" aria-hidden="true">
        <rect className="name-folder__back" x="20.0293" y="12.1973" width="260" height="130" />
        <path
          className="name-folder__front"
          d="M464 305V40C464 17.9086 446.091 0 424 0H212.269C197.965 0 184.75 7.63753 177.61 20.0311L164.715 42.4123C157.574 54.8059 144.359 62.4434 130.056 62.4434H40C17.9086 62.4434 0 80.352 0 102.443V305C0 327.091 17.9086 345 40 345H424C446.091 345 464 327.091 464 305Z"
        />
      </svg>

      <p className="name-folder__more text-heading">
        <span className="text-trim">More</span>
        <IconArrow className="name-folder__arrow" />
      </p>

      <div className="name-folder__name">
        <h1 className="text-display text-trim">
          Ivan
          <br />
          Skarabahatau
        </h1>
        <p className="name-folder__role text-heading text-trim">Visual designer</p>
      </div>
    </div>
  )
}
