import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ 
  children, 
  params 
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  let messages: Record<string, any>;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (err) {
    messages = (await import("../messages/en.json")).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}