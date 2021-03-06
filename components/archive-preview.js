import DateFormatter from './date-formatter'
import Link from 'next/link'

export default function ArchivePreview({
  title,
  date,
  subtitle,
  readTime,
  publication,
  slug,
  draft,
}) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2 leading-snug">
        {!draft ?
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <a className="hover:underline">{title}</a>
          </Link>
          :
          <Link as={`/drafts/${slug}`} href="/drafts/[slug]">
            <a className="hover:underline">{title}</a>
          </Link>
        }
      </h3>
      <p className="text-md text-gray-600 font-medium leading-relaxed pr-2 mb-2">{subtitle}</p>
      <div className="flex justify-start font-normal text-sm text-gray-600 mb-2">
        {!draft ?
          <div className="pr-2">
            Published on <DateFormatter dateString={date} />
          </div>
          :
          <div className="pr-2">
            Last edited on <DateFormatter dateString={date} />
          </div>} {' · '}
        <p className="px-2"> {readTime} read</p>
        {publication && (<p className="pr-2"> {' · '}In {publication}</p>)}
      </div>
      <hr className="border-accent-2" />
    </div>
  )
}
