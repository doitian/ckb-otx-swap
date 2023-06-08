import "./globals.css";
import { injectConfig } from "./lib/runtime-config";
import { rubik, mono } from "./fonts";
import navigation from "./navigation";
import Header from "./components/header";

export const metadata = {
  title: "OTX Swap",
  template: "%s | OTX Swap",
  description: "Atomic swap demo on CKB via OTX",
};

export default function RootLayout({
  children,
  init,
  config = injectConfig(),
}) {
  return (
    <html lang="en" className={`${rubik.variable} ${mono.variable}`}>
      <body className="bg-white">
        <Header title={metadata.title} navigation={navigation} />

        <main className="relative isolate px-6 pt-14 lg:px-8">
          {config.configured ? children : init}
        </main>
      </body>
    </html>
  );
}
