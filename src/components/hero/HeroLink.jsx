// Ссылка, если адрес задан, и обычный блок, если пока нет
export default function HeroLink({ href, external = false, ...props }) {
  if (!href) return <div {...props} />
  const target = external ? { target: '_blank', rel: 'noreferrer' } : {}
  return <a href={href} {...target} {...props} />
}
