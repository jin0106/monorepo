import { NextRequest, NextResponse } from 'next/server'
import { localeDefault } from '@/hooks/common/useLocale'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }
  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || localeDefault

    return NextResponse.redirect(new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url))
  }
}
