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
} from '@react-email/components';

interface PasswordResetEmailProps {
  name?: string;
  resetUrl?: string;
  expiresIn?: string;
  supportEmail?: string;
  company?: string;
}

export const PasswordResetEmail = ({
  name = 'Játékos',
  resetUrl = 'https://damareen.hu/reset-password',
  expiresIn = '1 óra',
  supportEmail = 'support@damareen.hu',
  company = 'Damareen',
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Jelszó visszaállítás a {company} fiókodhoz</Preview>
        <Body className="bg-zinc-950 font-sans">
          <Container className="mx-auto my-12 max-w-xl rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-2xl">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="m-0 text-5xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                {company}
              </Heading>
              <Text className="mt-2 text-sm text-zinc-400 font-medium">
                A Kazamaták Harcosa
              </Text>
            </Section>

            <Hr className="my-8 border-purple-500/30" />

            {/* Main Content */}
            <Section>
              <Heading className="m-0 mb-6 text-3xl font-bold text-zinc-100">
                Jelszó visszaállítás 🔒
              </Heading>
              
              <Text className="mb-6 text-lg leading-relaxed text-zinc-300">
                Szia, <strong className="text-purple-300">{name}</strong>!
              </Text>

              <Text className="mb-6 text-base leading-relaxed text-zinc-400">
                Jelszó visszaállítási kérelmet kaptunk a fiókodhoz. Ha te voltál, kattints az alábbi gombra egy új jelszó beállításához.
              </Text>

              <Text className="mb-6 text-base leading-relaxed text-zinc-400">
                Ez a link <strong className="text-purple-300">{expiresIn}</strong> múlva lejár biztonsági okokból.
              </Text>

              {/* CTA Button */}
              <Section className="text-center my-10">
                <Button
                  href={resetUrl}
                  className="inline-block rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 px-10 py-4 text-lg font-bold text-white shadow-2xl"
                >
                  Új jelszó beállítása
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="mb-6 text-sm text-zinc-500">
                Ha a gomb nem működik, másold be ezt a linket a böngésződbe:
              </Text>
              <Text className="mb-8 break-all rounded-lg bg-zinc-950 border border-purple-500/20 p-4 text-sm text-purple-300 font-mono">
                {resetUrl}
              </Text>

              <Hr className="my-8 border-purple-500/30" />

              {/* Security Tips */}
              <Section>
                <Heading className="mb-4 text-xl font-bold text-zinc-100">
                  Biztonsági tippek 🛡️
                </Heading>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Text className="m-0 text-2xl">🔐</Text>
                    <Text className="m-0 text-sm text-zinc-400">
                      <strong className="text-zinc-300">Erős jelszó:</strong> Használj legalább 8 karaktert, nagy- és kisbetűket, számokat és speciális karaktereket
                    </Text>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Text className="m-0 text-2xl">🚫</Text>
                    <Text className="m-0 text-sm text-zinc-400">
                      <strong className="text-zinc-300">Egyedi jelszó:</strong> Ne használd ugyanazt a jelszót több oldalon
                    </Text>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Text className="m-0 text-2xl">🔒</Text>
                    <Text className="m-0 text-sm text-zinc-400">
                      <strong className="text-zinc-300">2FA aktiválása:</strong> Beállításokban aktiváld a kétfaktoros hitelesítést még nagyobb biztonságért
                    </Text>
                  </div>
                </div>
              </Section>

              <Hr className="my-8 border-purple-500/30" />

              {/* Warning */}
              <Section className="rounded-lg border border-red-500/30 bg-red-950/30 p-4 mb-6">
                <Text className="m-0 text-sm text-red-200">
                  <strong>⚠️ Nem te voltál?</strong> Ha nem te kértél jelszó visszaállítást, hagyd figyelmen kívül ezt az emailt. 
                  A fiókod biztonságban van, senki sem fér hozzá ezen link nélkül. Ha aggódsz a fiókod biztonsága miatt, 
                  jelezd nekünk: <strong>{supportEmail}</strong>
                </Text>
              </Section>

              {/* Additional Info */}
              <Section className="rounded-lg border border-blue-500/30 bg-blue-950/30 p-4">
                <Text className="m-0 text-sm text-blue-200">
                  <strong>ℹ️ Hasznos információ:</strong> Ha lejár ez a link, bármikor kérhetsz újat a bejelentkezési oldalon 
                  az "Elfelejtett jelszó" gombra kattintva.
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-10 text-center">
              <Text className="mb-2 text-xs text-zinc-500">
                Ezt az emailt a {company} küldte.
              </Text>
              <Text className="m-0 text-xs text-zinc-600">
                © {new Date().getFullYear()} {company}. Minden jog fenntartva.
              </Text>
              <Text className="mt-4 text-xs text-zinc-600">
                Kérdésed van? Írj nekünk:{' '}
                <a href={`mailto:${supportEmail}`} className="text-purple-400 underline">
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
