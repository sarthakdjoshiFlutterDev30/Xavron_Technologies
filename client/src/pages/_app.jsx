import '../styles/global.css';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>XAVRON-Education Management System</title>
        <link rel="icon" href="/Logo_Xavron.png" />
        <meta name="keywords" content="XAVRON, XAVRON Technologies, XAVRON Technologies (OPC) Pvt. Ltd., Education Management System, Attendance Management System, Project Management System, Student Management System" />
        <meta name="author" content="XAVRON Technologies (OPC) Pvt. Ltd." />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandexbot" content="index, follow" />
        <meta name="duckduckbot" content="index, follow" />
        <meta name="baidubot" content="index, follow" />
        <meta name="sogoubot" content="index, follow" />
        <meta name="360bot" content="index, follow" />
        <meta name="sogou" content="index, follow" />
        <meta name="360" content="index, follow" />
        <meta name="sogou" content="index, follow" />
        <meta property="og:title" content="XAVRON Technologies (OPC) Pvt. Ltd. – Smart Attendance & Education ERP" />
<meta property="og:description" content="QR attendance, geofencing, face authentication, student verification, teacher panel, and complete education ERP automation." />
<meta property="og:image" content="/Logo_Xavron.png" />
<meta property="og:url" content="https://yourdomain.com" />
<meta property="og:type" content="website" />
<meta name="twitter:title" content="XAVRON Technologies (OPC) Pvt. Ltd. – Smart QR + Geofencing Attendance" />
<meta name="twitter:description" content="Automated student attendance with QR, geofencing, face scan, and institution ERP." />
<meta name="twitter:image" content="/Logo_Xavron.png" />
<meta name="twitter:card" content="summary_large_image" />

        <meta name="description" content="XAVRON Technologies (OPC) Pvt. Ltd. delivers next-generation smart attendance and ERP solutions with QR check-ins, 20m geofencing, face verification, real-time dashboards, and complete school/college automation. Fast, secure, and cloud-powered for modern institutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

