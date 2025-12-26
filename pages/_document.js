import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Pretendard Variable 폰트 로드 (로컬 파일) */}
        <style>{`
          @font-face {
            font-family: 'Pretendard Variable';
            src: url('/PretendardVariable.woff2') format('woff2');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
          }
          html, body, input, button, textarea {
            font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
