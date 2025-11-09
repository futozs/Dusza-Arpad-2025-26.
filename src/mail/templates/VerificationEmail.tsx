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

interface VerificationEmailProps {
  name?: string;
  verificationUrl?: string;
  expiresIn?: string;
  supportEmail?: string;
  company?: string;
}

export const VerificationEmail = ({
  name = "Játékos",
  verificationUrl = "https://damareen.hu/auth/verify",
  expiresIn = "24 óra",
  supportEmail = "support@damareen.hu",
  company = "Damareen",
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Erősítsd meg email címedet a {company} regisztrációhoz
      </Preview>
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
                        Üdvözlünk, {name}! 🎮
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
                        Köszönjük, hogy csatlakoztál a{" "}
                        <span style={{ color: "#c084fc", fontWeight: "600" }}>
                          {company}
                        </span>{" "}
                        fantasy kártyajáték világához!
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
                        A regisztrációd befejezéséhez erősítsd meg email címedet
                        az alábbi gombra kattintva. Ez a link{" "}
                        <span style={{ color: "#c084fc", fontWeight: "600" }}>
                          {expiresIn}
                        </span>{" "}
                        múlva lejár.
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
                                    href={verificationUrl}
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      color: "#ffffff",
                                      textDecoration: "none",
                                      display: "inline-block",
                                    }}
                                  >
                                    Email cím megerősítése
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
                              {verificationUrl}
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

                      {/* What's Next Section */}
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
                              Mi vár rád ezután?
                            </Heading>
                          </td>
                        </tr>

                        {/* Step 1 */}
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
                                          fontSize: "16px",
                                          fontWeight: "700",
                                          color: "#c084fc",
                                        }}
                                      >
                                        1
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
                                    Gyűjts kártyákat
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Kezdd alapkártyákkal és bővítsd gyűjteményed
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        {/* Step 2 */}
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
                                          fontSize: "16px",
                                          fontWeight: "700",
                                          color: "#c084fc",
                                        }}
                                      >
                                        2
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
                                    Építsd fel paklidat
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Válaszd ki kártyáid stratégiailag
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        {/* Step 3 */}
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
                                          fontSize: "16px",
                                          fontWeight: "700",
                                          color: "#c084fc",
                                        }}
                                      >
                                        3
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
                                    Hódítsd meg kazamatákat
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Legyőzd a vezéreket és szerezz dicsőséget
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
                        style={{ marginBottom: "0" }}
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
                                ⚠️ Biztonság:
                              </span>{" "}
                              Ha nem te regisztráltál, hagyd figyelmen kívül ezt
                              az emailt, vagy jelezd nekünk a következő címen:{" "}
                              <span style={{ fontWeight: "600" }}>
                                {supportEmail}
                              </span>
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

export default VerificationEmail;
