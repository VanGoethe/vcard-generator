import Link from 'next/link'
import { NextSeo } from 'next-seo'

export default function NotFoundPage() {
  return (
    <div className="bg-zinc-900 flex min-h-screen w-full flex-col items-center justify-center px-6 py-12">
      <NextSeo
        title="Page not found | iMMAP Visit Card Generator"
        description="This visit card or page does not exist, or it may have been removed."
        noindex
        nofollow
      />

      <div className="flex max-w-md flex-col items-center gap-8 text-center">
        <p className="text-6xl font-semibold leading-none text-[#bf1f26]">
          404
        </p>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-wide text-white md:text-3xl">
            Page not found
          </h1>
          <p className="text-base font-light text-gray-300">
            We couldn&apos;t find this visit card or page. It may not exist yet,
            or the link might be incorrect.
          </p>
        </div>

        <div className="underline-red mx-auto" aria-hidden />

        <Link
          href="/"
          className="inline-flex min-h-12 min-w-[160px] items-center justify-center rounded-md bg-red-800 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-[#193661] focus:ring-offset-1 focus:ring-offset-zinc-900"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
