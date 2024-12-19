import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const myFont = localFont({ src: './fonts/Aspekta-400.woff2' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <div className="bg-slate-800">
          <Navbar />
        </div>
        <div>
          {children}
        </div>
        <div className="bg-slate-800">
          <Footer />
        </div>
      </body>
    </html>
  );
}
