import './globals.css';

export const metadata = {
  title: 'PLI Portal | Varroc',
  description: 'Production Linked Incentive Portal for Vendor Connect',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
