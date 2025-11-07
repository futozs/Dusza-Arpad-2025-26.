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

interface VerificationEmailProps {
  name?: string;
  verificationUrl?: string;
  expiresIn?: string;
  supportEmail?: string;
  company?: string;
}

export const VerificationEmail = ({
  name = 'Játékos',
  verificationUrl = 'https://damareen.hu/verify',
  expiresIn = '24 óra',
  supportEmail = 'support@damareen.hu',
  company = 'Damareen',
}: VerificationEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Erősítsd meg email címedet a {company} regisztrációhoz</Preview>
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
                Üdvözlünk, {name}! 🎮
              </Heading>
              
              <Text className="mb-6 text-lg leading-relaxed text-zinc-300">
                Köszönjük, hogy csatlakoztál a <strong className="text-purple-300">{company}</strong> fantasy kártyajáték világához!
              </Text>

              <Text className="mb-6 text-base leading-relaxed text-zinc-400">
                A regisztrációd befejezéséhez erősítsd meg email címedet az alábbi gombra kattintva. 
                Ez a link <strong className="text-purple-300">{expiresIn}</strong> múlva lejár.
              </Text>

              {/* CTA Button */}
              <Section className="text-center my-10">
                <Button
                  href={verificationUrl}
                  className="inline-block rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 px-10 py-4 text-lg font-bold text-white shadow-2xl"
                >
                  Email cím megerősítése
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="mb-6 text-sm text-zinc-500">
                Ha a gomb nem működik, másold be ezt a linket a böngésződbe:
              </Text>
              <Text className="mb-8 break-all rounded-lg bg-zinc-950 border border-purple-500/20 p-4 text-sm text-purple-300 font-mono">
                {verificationUrl}
              </Text>

              <Hr className="my-8 border-purple-500/30" />

              {/* What's Next Section */}
              <Section>
                <Heading className="mb-4 text-xl font-bold text-zinc-100">
                  Mi vár rád ezután?
                </Heading>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-sm font-bold text-purple-300">
                      1
                    </div>
                    <Text className="m-0 text-sm text-zinc-400">
                      <strong className="text-zinc-300">Gyűjts kártyákat</strong> - Kezdd alapkártyákkal
                    </Text>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-sm font-bold text-purple-300">
                      2
                    </div>
                    <Text className="m-0 text-sm text-zinc-400">
                      <strong className="text-zinc-300">Építsd fel paklidat</strong> - Válaszd ki stratégiailag
                    </Text>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-sm font-bold text-purple-300">
                      3
                    </div>
                    <Text className="m-0 text-sm text-zinc-400">
                      <strong className="text-zinc-300">Hódítsd meg kazamatákat</strong> - Legyőzd a vezéreket
                    </Text>
                  </div>
                </div>
              </Section>

              <Hr className="my-8 border-purple-500/30" />

              {/* Warning */}
              <Section className="rounded-lg border border-red-500/30 bg-red-950/30 p-4 mb-6">
                <Text className="m-0 text-sm text-red-200">
                  <strong>⚠️ Biztonság:</strong> Ha nem te regisztráltál, hagyd figyelmen kívül ezt az emailt, 
                  vagy jelezd nekünk a következő címen: <strong>{supportEmail}</strong>
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

export default VerificationEmail;