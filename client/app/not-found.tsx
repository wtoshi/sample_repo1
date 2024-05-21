'use client';

import Error from "next/error";

export default function NotFound() {

  // const t = useTranslations("System");

  return (
    <html>
      <body className="flex justify-center items-center">
        {/* <h1>{t('notFound-title')}</h1>      
          <h2>{t('notFound-desc')}</h2> */}

        <html lang="en">
          <body>
            <Error statusCode={404} />
          </body>
        </html>
      </body>
    </html>
  );
}