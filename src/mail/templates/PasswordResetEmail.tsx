import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name?: string;
  resetUrl?: string;
  expiresIn?: string;
  supportEmail?: string;
  company?: string;
}

export const PasswordResetEmail = ({
  name = "Játékos",
  resetUrl = "https://damareen.hu/auth/reset-password",
  expiresIn = "1 óra",
  supportEmail = "support@damareen.hu",
  company = "Damareen",
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Jelszó visszaállítás a {company} fiókodhoz</Preview>
      <Body
        style={{
          backgroundColor: "#09090b",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: "0",
          padding: "0",
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#09090b" }}
        >
          <tr>
            <td align="center" style={{ padding: "48px 20px" }}>
              <Container
                style={{
                  margin: "0 auto",
                  maxWidth: "672px",
                  border: "1px solid #3d2663",
                  backgroundColor: "#18181b",
                  padding: "48px",
                }}
              >
                {/* Header */}
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td align="center" style={{ paddingBottom: "48px" }}>
                      <Heading
                        style={{
                          margin: "0",
                          fontSize: "60px",
                          fontWeight: "900",
                          color: "#c084fc",
                          letterSpacing: "-3px",
                        }}
                      >
                        {company}
                      </Heading>
                      <Text
                        style={{
                          marginTop: "12px",
                          marginBottom: "0",
                          fontSize: "16px",
                          color: "#71717a",
                          fontWeight: "600",
                          letterSpacing: "1.6px",
                          textTransform: "uppercase",
                        }}
                      >
                        A Kazamaták Harcosa
                      </Text>
                    </td>
                  </tr>
                </table>

                {/* Main Content */}
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td>
                      <Heading
                        style={{
                          margin: "0 0 16px 0",
                          fontSize: "36px",
                          fontWeight: "700",
                          color: "#fafafa",
                          letterSpacing: "-0.9px",
                        }}
                      >
                        Jelszó visszaállítás 🔒
                      </Heading>

                      <Text
                        style={{
                          marginBottom: "32px",
                          marginTop: "0",
                          fontSize: "18px",
                          lineHeight: "29px",
                          color: "#d4d4d8",
                        }}
                      >
                        Szia,{" "}
                        <span style={{ color: "#c084fc", fontWeight: "600" }}>
                          {name}
                        </span>
                        !
                      </Text>

                      <Text
                        style={{
                          marginBottom: "24px",
                          marginTop: "0",
                          fontSize: "16px",
                          lineHeight: "26px",
                          color: "#a1a1aa",
                        }}
                      >
                        Jelszó visszaállítási kérelmet kaptunk a fiókodhoz. Ha te
                        voltál, kattints az alábbi gombra egy új jelszó
                        beállításához.
                      </Text>

                      <Text
                        style={{
                          marginBottom: "40px",
                          marginTop: "0",
                          fontSize: "16px",
                          lineHeight: "26px",
                          color: "#a1a1aa",
                        }}
                      >
                        Ez a link{" "}
                        <span style={{ color: "#c084fc", fontWeight: "600" }}>
                          {expiresIn}
                        </span>{" "}
                        múlva lejár biztonsági okokból.
                      </Text>

                      {/* CTA Button */}
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{ margin: "48px 0" }}
                      >
                        <tr>
                          <td align="center">
                            <table cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  align="center"
                                  style={{
                                    backgroundColor: "#9333ea",
                                    padding: "20px 48px",
                                  }}
                                >
                                  <a
                                    href={resetUrl}
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      color: "#ffffff",
                                      textDecoration: "none",
                                      display: "inline-block",
                                    }}
                                  >
                                    Új jelszó beállítása
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      {/* Alternative Link */}
                      <Text
                        style={{
                          marginBottom: "12px",
                          marginTop: "0",
                          fontSize: "12px",
                          color: "#71717a",
                        }}
                      >
                        Ha a gomb nem működik, másold be ezt a linket a
                        böngésződbe:
                      </Text>
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{ marginBottom: "48px" }}
                      >
                        <tr>
                          <td
                            style={{
                              backgroundColor: "#1c1c21",
                              border: "1px solid #3d2663",
                              padding: "16px",
                            }}
                          >
                            <Text
                              style={{
                                margin: "0",
                                fontSize: "12px",
                                color: "#c084fc",
                                fontFamily: "monospace",
                                overflowWrap: "break-word",
                              }}
                            >
                              {resetUrl}
                            </Text>
                          </td>
                        </tr>
                      </table>

                      <Hr
                        style={{
                          borderWidth: "0",
                          borderTop: "1px solid #3d2663",
                          margin: "40px 0",
                        }}
                      />

                      {/* Security Tips */}
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{ marginBottom: "40px" }}
                      >
                        <tr>
                          <td>
                            <Heading
                              style={{
                                marginBottom: "24px",
                                marginTop: "0",
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#f4f4f5",
                              }}
                            >
                              Biztonsági tippek 🛡️
                            </Heading>
                          </td>
                        </tr>

                        {/* Tip 1 */}
                        <tr>
                          <td style={{ paddingBottom: "20px" }}>
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  width="40"
                                  valign="top"
                                  style={{ paddingRight: "16px" }}
                                >
                                  <table
                                    width="40"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    style={{ height: "40px" }}
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        valign="middle"
                                        style={{
                                          backgroundColor: "#2d1b4e",
                                          border: "1px solid #4d3470",
                                          fontSize: "20px",
                                        }}
                                      >
                                        🔐
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                <td valign="top" style={{ paddingTop: "4px" }}>
                                  <Text
                                    style={{
                                      margin: "0 0 4px 0",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      color: "#e4e4e7",
                                    }}
                                  >
                                    Erős jelszó
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Használj legalább 8 karaktert, nagy- és
                                    kisbetűket, számokat és speciális karaktereket
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        {/* Tip 2 */}
                        <tr>
                          <td style={{ paddingBottom: "20px" }}>
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  width="40"
                                  valign="top"
                                  style={{ paddingRight: "16px" }}
                                >
                                  <table
                                    width="40"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    style={{ height: "40px" }}
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        valign="middle"
                                        style={{
                                          backgroundColor: "#2d1b4e",
                                          border: "1px solid #4d3470",
                                          fontSize: "20px",
                                        }}
                                      >
                                        🚫
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                <td valign="top" style={{ paddingTop: "4px" }}>
                                  <Text
                                    style={{
                                      margin: "0 0 4px 0",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      color: "#e4e4e7",
                                    }}
                                  >
                                    Egyedi jelszó
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Ne használd ugyanazt a jelszót több oldalon
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        {/* Tip 3 */}
                        <tr>
                          <td>
                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  width="40"
                                  valign="top"
                                  style={{ paddingRight: "16px" }}
                                >
                                  <table
                                    width="40"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    style={{ height: "40px" }}
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        valign="middle"
                                        style={{
                                          backgroundColor: "#2d1b4e",
                                          border: "1px solid #4d3470",
                                          fontSize: "20px",
                                        }}
                                      >
                                        🔒
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                <td valign="top" style={{ paddingTop: "4px" }}>
                                  <Text
                                    style={{
                                      margin: "0 0 4px 0",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      color: "#e4e4e7",
                                    }}
                                  >
                                    2FA aktiválása
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Beállításokban aktiváld a kétfaktoros
                                    hitelesítést még nagyobb biztonságért
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <Hr
                        style={{
                          borderWidth: "0",
                          borderTop: "1px solid #3d2663",
                          margin: "40px 0",
                        }}
                      />

                      {/* Warning */}
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{ marginBottom: "24px" }}
                      >
                        <tr>
                          <td
                            style={{
                              border: "1px solid #5c1d1d",
                              backgroundColor: "#231616",
                              padding: "20px",
                            }}
                          >
                            <Text
                              style={{
                                margin: "0",
                                fontSize: "14px",
                                lineHeight: "23px",
                                color: "#fca5a5",
                              }}
                            >
                              <span style={{ fontWeight: "700" }}>
                                ⚠️ Nem te voltál?
                              </span>{" "}
                              Ha nem te kértél jelszó visszaállítást, hagyd
                              figyelmen kívül ezt az emailt. A fiókod
                              biztonságban van, senki sem fér hozzá ezen link
                              nélkül. Ha aggódsz a fiókod biztonsága miatt,
                              jelezd nekünk:{" "}
                              <span style={{ fontWeight: "600" }}>
                                {supportEmail}
                              </span>
                            </Text>
                          </td>
                        </tr>
                      </table>

                      {/* Additional Info */}
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{ marginBottom: "0" }}
                      >
                        <tr>
                          <td
                            style={{
                              border: "1px solid #1e3a5f",
                              backgroundColor: "#0f1c2e",
                              padding: "20px",
                            }}
                          >
                            <Text
                              style={{
                                margin: "0",
                                fontSize: "14px",
                                lineHeight: "23px",
                                color: "#93c5fd",
                              }}
                            >
                              <span style={{ fontWeight: "700" }}>
                                ℹ️ Hasznos információ:
                              </span>{" "}
                              Ha lejár ez a link, bármikor kérhetsz újat a
                              bejelentkezési oldalon az &ldquo;Elfelejtett jelszó&rdquo;
                              gombra kattintva.
                            </Text>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                {/* Footer */}
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    marginTop: "48px",
                    paddingTop: "32px",
                    borderTop: "1px solid #2d1b3d",
                  }}
                >
                  <tr>
                    <td align="center">
                      <Text
                        style={{
                          marginBottom: "12px",
                          marginTop: "0",
                          fontSize: "12px",
                          color: "#71717a",
                        }}
                      >
                        Ezt az emailt a {company} küldte.
                      </Text>
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "12px",
                          color: "#52525b",
                        }}
                      >
                        © {new Date().getFullYear()} {company}. Minden jog
                        fenntartva.
                      </Text>
                      <Text
                        style={{
                          marginTop: "20px",
                          marginBottom: "0",
                          fontSize: "12px",
                          color: "#52525b",
                        }}
                      >
                        Kérdésed van? Írj nekünk:{" "}
                        <a
                          href={`mailto:${supportEmail}`}
                          style={{
                            color: "#c084fc",
                          }}
                        >
                          {supportEmail}
                        </a>
                      </Text>
                    </td>
                  </tr>
                </table>
              </Container>
            </td>
          </tr>
        </table>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;
