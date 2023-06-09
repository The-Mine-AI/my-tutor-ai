import './globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

import AppBar from './components/AppBar'; 

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ overflow: 'hidden' }}>
        <AppBar />
        <div style={{ height: "100%" }}>
          {children}
        </div>
      </body>
    </html>
  )
}
