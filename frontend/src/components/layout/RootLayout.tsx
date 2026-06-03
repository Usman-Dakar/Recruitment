import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieConsent from '@/components/common/CookieConsent'

export default function RootLayout() {
  return (
    <>
      <CookieConsent />
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
