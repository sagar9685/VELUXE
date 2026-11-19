import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import AIConcierge from './AIConcierge';
import CompareBar from './CompareBar';
import Toaster from './Toaster';

/** Shared page frame: announcement, navigation, page content and footer. */
export default function Layout() {
  const { pathname } = useLocation();

  // Start each route at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
      <AIConcierge />
      <Toaster />
    </div>
  );
}
