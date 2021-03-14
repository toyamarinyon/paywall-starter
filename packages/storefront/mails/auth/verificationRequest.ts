import mjml2html from "mjml";
interface verificationRequestPrams {
  url: string;
  site: string;
  email: string;
}
export function html({ url }: verificationRequestPrams) {
  // Uses tables for layout and inline CSS due to email client limitations
  const output = mjml2html(`
  <mjml>
    <mj-body background-color="#eee">
      <mj-section background-color="#eee"></mj-section>
      <mj-section background-color="#fff" border-bottom="solid 1px #eee">
        <mj-column>
          <mj-text>
            <p style="font-weight: bold; font-style: italic;font-size: 36px;">PAYWALL
            </p>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fafafa">
        <mj-column>
          <mj-text align="center"><p>メールアドレスのご入力ありがとうございました。</p><p>以下のボタンを押すと、PAYWALLにログインできます。</p></mj-text>
          <mj-button background-color="#6366f1" href="${url}">ログイン</mj-button>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `);
  return output.html;
}

export function text({ url, site }: verificationRequestPrams) {
  return `Sign in to ${site}\n${url}\n\n`;
}
