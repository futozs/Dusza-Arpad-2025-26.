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
      <Tailwind>
        <Head />
        <Preview>Jelszó visszaállítás a {company} fiókodhoz</Preview>
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
                Jelszó visszaállítás 🔒
              </Heading>

              <Text className="mb-8 text-lg leading-relaxed text-zinc-300">
                Szia,{" "}
                <span className="text-purple-400 font-semibold">{name}</span>!
              </Text>

              <Text className="mb-6 text-base leading-relaxed text-zinc-400">
                Jelszó visszaállítási kérelmet kaptunk a fiókodhoz. Ha te
                voltál, kattints az alábbi gombra egy új jelszó beállításához.
              </Text>

              <Text className="mb-10 text-base leading-relaxed text-zinc-400">
                Ez a link{" "}
                <span className="text-purple-400 font-semibold">
                  {expiresIn}
                </span>{" "}
                múlva lejár biztonsági okokból.
              </Text>

              {/* CTA Button */}
              <Section className="text-center my-12">
                <Button
                  href={resetUrl}
                  className="inline-block rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-12 py-5 text-base font-bold text-white shadow-lg hover:shadow-purple-500/50 transition-shadow"
                >
                  Új jelszó beállítása
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="mb-3 text-xs text-zinc-500">
                Ha a gomb nem működik, másold be ezt a linket a böngésződbe:
              </Text>
              <Text className="mb-12 break-all rounded-lg bg-zinc-900/50 border border-purple-500/20 p-4 text-xs text-purple-400 font-mono">
                {resetUrl}
              </Text>

              <Hr className="my-10 border-purple-500/20" />

              {/* Security Tips */}
              <Section className="mb-10">
                <Heading className="mb-6 text-2xl font-bold text-zinc-100">
                  Biztonsági tippek 🛡️
                </Heading>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-xl">
                      🔐
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Erős jelszó
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Használj legalább 8 karaktert, nagy- és kisbetűket,
                        számokat és speciális karaktereket
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-xl">
                      🚫
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Egyedi jelszó
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Ne használd ugyanazt a jelszót több oldalon
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-xl">
                      🔒
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        2FA aktiválása
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Beállításokban aktiváld a kétfaktoros hitelesítést még
                        nagyobb biztonságért
                      </Text>
                    </div>
                  </div>
                </div>
              </Section>

              <Hr className="my-10 border-purple-500/20" />

              {/* Warning */}
              <Section className="rounded-xl border border-red-500/20 bg-red-950/20 p-5 mb-6">
                <Text className="m-0 text-sm leading-relaxed text-red-300">
                  <span className="font-bold">⚠️ Nem te voltál?</span> Ha nem te
                  kértél jelszó visszaállítást, hagyd figyelmen kívül ezt az
                  emailt. A fiókod biztonságban van, senki sem fér hozzá ezen
                  link nélkül. Ha aggódsz a fiókod biztonsága miatt, jelezd
                  nekünk: <span className="font-semibold">{supportEmail}</span>
                </Text>
              </Section>

              {/* Additional Info */}
              <Section className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-5">
                <Text className="m-0 text-sm leading-relaxed text-blue-300">
                  <span className="font-bold">ℹ️ Hasznos információ:</span> Ha
                  lejár ez a link, bármikor kérhetsz újat a bejelentkezési
                  oldalon az "Elfelejtett jelszó" gombra kattintva.
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

export default PasswordResetEmail;
