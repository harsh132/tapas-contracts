import "~/styles/globals.css";
import { Space_Grotesk } from "next/font/google";
import { type Metadata } from "next";
import Footer from "~/components/footer";
import { ThemeProvider } from "~/components/theme-provider";

const poppins = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tapas",
  description:
    "Tapas makes your life easy by letting you pay in crypto anywhere!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
