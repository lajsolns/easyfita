import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata = {
  title: 'EasyFITA – Your Trusted Auto Repair & Roadside Assistance Partner',
  description:
    'EasyFITA connects car owners to professional mechanics for quick, affordable, and convenient repairs in Accra, Ghana. Book a mechanic online or request emergency roadside assistance.',
  keywords: 'auto repair, mechanic, roadside assistance, car repair Accra, mobile mechanic Ghana, oil change, battery jumpstart, vehicle diagnostics',
  openGraph: {
    title: 'EasyFITA – Auto Repair & Roadside Assistance',
    description: 'Book a trusted mechanic online. We come to you – anywhere in Accra, Ghana.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
