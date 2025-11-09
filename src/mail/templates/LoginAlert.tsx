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

interface LoginAlertProps {
  name?: string;
  loginTime?: string;
  loginDate?: string;
  ipAddress?: string;
  location?: string;
  device?: string;
  browser?: string;
  securityUrl?: string;
  supportEmail?: string;
  company?: string;
}

export const LoginAlert = ({
  name = "Játékos",
  loginTime = "14:30",
  loginDate = "2025. november 7.",
  ipAddress = "192.168.1.1",
  location = "Budapest, Magyarország",
  device = "Windows PC",
  browser = "Chrome",
  securityUrl = "https://damareen.hu/dashboard/settings",
  supportEmail = "support@damareen.hu",
  company = "Damareen",
}: LoginAlertProps) => {
  return (
    <Html>
      <Head />
      <Preview>Új bejelentkezés észlelve a {company} fiókodban</Preview>
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
                        Új bejelentkezés 🔐
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
                          marginBottom: "40px",
                          marginTop: "0",
                          fontSize: "16px",
                          lineHeight: "26px",
                          color: "#a1a1aa",
                        }}
                      >
                        Új bejelentkezést észleltünk a fiókodba. Ha ez te voltál,
                        nincs teendőd. Ha nem te jelentkeztél be, azonnal lépj és
                        biztosítsd fiókodat.
                      </Text>

                      {/* Login Details */}
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{
                          marginBottom: "40px",
                          border: "1px solid #3d2663",
                          backgroundColor: "#1c1c21",
                          padding: "24px",
                        }}
                      >
                        <tr>
                          <td>
                            <Heading
                              style={{
                                margin: "0 0 24px 0",
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#f4f4f5",
                              }}
                            >
                              Bejelentkezés részletei
                            </Heading>

                            <table width="100%" cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  style={{
                                    borderBottom: "1px solid #2d1b3d",
                                    paddingBottom: "12px",
                                    paddingTop: "0",
                                  }}
                                >
                                  <table
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                  >
                                    <tr>
                                      <td width="50%" valign="top">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#a1a1aa",
                                          }}
                                        >
                                          Időpont
                                        </Text>
                                      </td>
                                      <td width="50%" valign="top" align="right">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            color: "#e4e4e7",
                                          }}
                                        >
                                          {loginDate} {loginTime}
                                        </Text>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    borderBottom: "1px solid #2d1b3d",
                                    paddingBottom: "12px",
                                    paddingTop: "16px",
                                  }}
                                >
                                  <table
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                  >
                                    <tr>
                                      <td width="50%" valign="top">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#a1a1aa",
                                          }}
                                        >
                                          Eszköz
                                        </Text>
                                      </td>
                                      <td width="50%" valign="top" align="right">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            color: "#e4e4e7",
                                          }}
                                        >
                                          {device}
                                        </Text>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    borderBottom: "1px solid #2d1b3d",
                                    paddingBottom: "12px",
                                    paddingTop: "16px",
                                  }}
                                >
                                  <table
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                  >
                                    <tr>
                                      <td width="50%" valign="top">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#a1a1aa",
                                          }}
                                        >
                                          Böngésző
                                        </Text>
                                      </td>
                                      <td width="50%" valign="top" align="right">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            color: "#e4e4e7",
                                          }}
                                        >
                                          {browser}
                                        </Text>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    borderBottom: "1px solid #2d1b3d",
                                    paddingBottom: "12px",
                                    paddingTop: "16px",
                                  }}
                                >
                                  <table
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                  >
                                    <tr>
                                      <td width="50%" valign="top">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#a1a1aa",
                                          }}
                                        >
                                          Hely
                                        </Text>
                                      </td>
                                      <td width="50%" valign="top" align="right">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            color: "#e4e4e7",
                                          }}
                                        >
                                          {location}
                                        </Text>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td style={{ paddingTop: "16px" }}>
                                  <table
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                  >
                                    <tr>
                                      <td width="50%" valign="top">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#a1a1aa",
                                          }}
                                        >
                                          IP cím
                                        </Text>
                                      </td>
                                      <td width="50%" valign="top" align="right">
                                        <Text
                                          style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            color: "#e4e4e7",
                                            fontFamily: "monospace",
                                          }}
                                        >
                                          {ipAddress}
                                        </Text>
                                      </td>
                                    </tr>
                                  </table>
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

                      {/* Security Actions */}
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
                              Nem te voltál? 🚨
                            </Heading>

                            <Text
                              style={{
                                marginBottom: "24px",
                                marginTop: "0",
                                fontSize: "16px",
                                lineHeight: "26px",
                                color: "#a1a1aa",
                              }}
                            >
                              Ha ezt a bejelentkezést nem te kezdeményezted,
                              valaki hozzáférhet a fiókodhoz. Kövesd az alábbi
                              lépéseket azonnal:
                            </Text>
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
                                          backgroundColor: "#3d1616",
                                          border: "1px solid #5c1d1d",
                                          fontSize: "16px",
                                          fontWeight: "700",
                                          color: "#f87171",
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
                                    Változtasd meg jelszavad
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Használj erős, egyedi jelszót amit még sehol
                                    nem használtál
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
                                          backgroundColor: "#3d1616",
                                          border: "1px solid #5c1d1d",
                                          fontSize: "16px",
                                          fontWeight: "700",
                                          color: "#f87171",
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
                                    Aktiváld a 2FA-t
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Kétfaktoros hitelesítés további védelmet
                                    biztosít
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
                                          backgroundColor: "#3d1616",
                                          border: "1px solid #5c1d1d",
                                          fontSize: "16px",
                                          fontWeight: "700",
                                          color: "#f87171",
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
                                    Ellenőrizd aktív munkameneteid
                                  </Text>
                                  <Text
                                    style={{
                                      margin: "0",
                                      fontSize: "14px",
                                      color: "#71717a",
                                    }}
                                  >
                                    Jelentkeztesd ki az ismeretlen eszközöket
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

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
                                    href={securityUrl}
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      color: "#ffffff",
                                      textDecoration: "none",
                                      display: "inline-block",
                                    }}
                                  >
                                    Biztonsági beállítások
                                  </a>
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

                      {/* Info Section */}
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{ marginBottom: "24px" }}
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
                                ℹ️ Te voltál?
                              </span>{" "}
                              Ha ezt a bejelentkezést te kezdeményezted, nincs
                              szükség további lépésekre. Ez az email csak
                              biztonsági célból lett elküldve, hogy tájékoztassunk
                              minden fiókaktivitásról.
                            </Text>
                          </td>
                        </tr>
                      </table>

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
                                ⚠️ Segítségre van szükséged?
                              </span>{" "}
                              Ha gyanús aktivitást észlelsz vagy nem tudsz
                              bejelentkezni a fiókodba, azonnal lépj kapcsolatba
                              velünk:{" "}
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

export default LoginAlert;
