import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Tailwind,
  pixelBasedPreset,
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
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Head />
        <Preview>Új bejelentkezés észlelve a {company} fiókodban</Preview>
        <Body className="bg-zinc-950 font-sans">
          <Container className="mx-auto my-12 max-w-2xl rounded-2xl border border-purple-500/20 bg-gradient-to-br from-zinc-900/95 to-zinc-950 p-12 shadow-2xl">
            {/* Header */}
            <Section className="text-center mb-12">
              <Heading className="m-0 text-6xl font-black text-purple-400 tracking-tight">
                {company}
              </Heading>
              <Text className="mt-3 text-base text-zinc-500 font-semibold tracking-wide uppercase">
                A Kazamaták Harcosa
              </Text>
            </Section>

            {/* Main Content */}
            <Section>
              <Heading className="m-0 mb-4 text-4xl font-bold text-zinc-50 tracking-tight">
                Új bejelentkezés 🔐
              </Heading>

              <Text className="mb-8 text-lg leading-relaxed text-zinc-300">
                Szia,{" "}
                <span className="text-purple-400 font-semibold">{name}</span>!
              </Text>

              <Text className="mb-10 text-base leading-relaxed text-zinc-400">
                Új bejelentkezést észleltünk a fiókodba. Ha ez te voltál, nincs
                teendőd. Ha nem te jelentkeztél be, azonnal lépj és biztosítsd
                fiókodat.
              </Text>

              {/* Login Details */}
              <Section className="mb-10 rounded-xl border border-purple-500/20 bg-zinc-900/50 p-6">
                <Heading className="m-0 mb-6 text-xl font-bold text-zinc-100">
                  Bejelentkezés részletei
                </Heading>

                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-purple-500/10 pb-3">
                    <Text className="m-0 text-sm font-semibold text-zinc-400">
                      Időpont
                    </Text>
                    <Text className="m-0 text-sm text-zinc-200">
                      {loginDate} {loginTime}
                    </Text>
                  </div>

                  <div className="flex items-start justify-between border-b border-purple-500/10 pb-3">
                    <Text className="m-0 text-sm font-semibold text-zinc-400">
                      Eszköz
                    </Text>
                    <Text className="m-0 text-sm text-zinc-200">{device}</Text>
                  </div>

                  <div className="flex items-start justify-between border-b border-purple-500/10 pb-3">
                    <Text className="m-0 text-sm font-semibold text-zinc-400">
                      Böngésző
                    </Text>
                    <Text className="m-0 text-sm text-zinc-200">{browser}</Text>
                  </div>

                  <div className="flex items-start justify-between border-b border-purple-500/10 pb-3">
                    <Text className="m-0 text-sm font-semibold text-zinc-400">
                      Hely
                    </Text>
                    <Text className="m-0 text-sm text-zinc-200">
                      {location}
                    </Text>
                  </div>

                  <div className="flex items-start justify-between">
                    <Text className="m-0 text-sm font-semibold text-zinc-400">
                      IP cím
                    </Text>
                    <Text className="m-0 text-sm text-zinc-200 font-mono">
                      {ipAddress}
                    </Text>
                  </div>
                </div>
              </Section>

              <Hr className="my-10 border-purple-500/20" />

              {/* Security Actions */}
              <Section className="mb-10">
                <Heading className="mb-6 text-2xl font-bold text-zinc-100">
                  Nem te voltál? 🚨
                </Heading>

                <Text className="mb-6 text-base leading-relaxed text-zinc-400">
                  Ha ezt a bejelentkezést nem te kezdeményezted, valaki
                  hozzáférhet a fiókodhoz. Kövess az alábbi lépéseket azonnal:
                </Text>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-base font-bold text-red-400">
                      1
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Változtasd meg jelszavad
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Használj erős, egyedi jelszót amit még sehol nem
                        használtál
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-base font-bold text-red-400">
                      2
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Aktiváld a 2FA-t
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Kétfaktoros hitelesítés további védelmet biztosít
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-base font-bold text-red-400">
                      3
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Ellenőrizd aktív munkameneteid
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Jelentkeztesd ki az ismeretlen eszközöket
                      </Text>
                    </div>
                  </div>
                </div>
              </Section>

              {/* CTA Button */}
              <Section className="text-center my-12">
                <Button
                  href={securityUrl}
                  className="inline-block rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-12 py-5 text-base font-bold text-white shadow-lg hover:shadow-purple-500/50 transition-shadow"
                >
                  Biztonsági beállítások
                </Button>
              </Section>

              <Hr className="my-10 border-purple-500/20" />

              {/* Info Section */}
              <Section className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-5 mb-6">
                <Text className="m-0 text-sm leading-relaxed text-blue-300">
                  <span className="font-bold">ℹ️ Te voltál?</span> Ha ezt a
                  bejelentkezést te kezdeményezted, nincs szükség további
                  lépésekre. Ez az email csak biztonsági célból lett elküldve,
                  hogy tájékoztassunk minden fiókaktivitásról.
                </Text>
              </Section>

              {/* Warning */}
              <Section className="rounded-xl border border-red-500/20 bg-red-950/20 p-5">
                <Text className="m-0 text-sm leading-relaxed text-red-300">
                  <span className="font-bold">
                    ⚠️ Segítségre van szükséged?
                  </span>{" "}
                  Ha gyanús aktivitást észlelsz vagy nem tudsz bejelentkezni a
                  fiókodba, azonnal lépj kapcsolatba velünk:{" "}
                  <span className="font-semibold">{supportEmail}</span>
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-12 pt-8 border-t border-purple-500/10 text-center">
              <Text className="mb-3 text-xs text-zinc-500">
                Ezt az emailt a {company} küldte.
              </Text>
              <Text className="m-0 text-xs text-zinc-600">
                © {new Date().getFullYear()} {company}. Minden jog fenntartva.
              </Text>
              <Text className="mt-5 text-xs text-zinc-600">
                Kérdésed van? Írj nekünk:{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {supportEmail}
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LoginAlert;
