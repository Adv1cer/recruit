import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const myFont = localFont({ src: './fonts/Aspekta-400.woff2' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <div>
          <Navbar />
        </div>
        <div>
          {children}
        </div>
        <div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
