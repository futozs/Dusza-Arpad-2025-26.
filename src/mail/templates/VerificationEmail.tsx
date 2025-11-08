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
  verificationUrl = 'https://damareen.hu/auth/verify',
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
                Üdvözlünk, {name}! 🎮
              </Heading>
              
              <Text className="mb-8 text-lg leading-relaxed text-zinc-300">
                Köszönjük, hogy csatlakoztál a <span className="text-purple-400 font-semibold">{company}</span> fantasy kártyajáték világához!
              </Text>

              <Text className="mb-10 text-base leading-relaxed text-zinc-400">
                A regisztrációd befejezéséhez erősítsd meg email címedet az alábbi gombra kattintva. 
                Ez a link <span className="text-purple-400 font-semibold">{expiresIn}</span> múlva lejár.
              </Text>

              {/* CTA Button */}
              <Section className="text-center my-12">
                <Button
                  href={verificationUrl}
                  className="inline-block rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-12 py-5 text-base font-bold text-white shadow-lg hover:shadow-purple-500/50 transition-shadow"
                >
                  Email cím megerősítése
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="mb-3 text-xs text-zinc-500">
                Ha a gomb nem működik, másold be ezt a linket a böngésződbe:
              </Text>
              <Text className="mb-12 break-all rounded-lg bg-zinc-900/50 border border-purple-500/20 p-4 text-xs text-purple-400 font-mono">
                {verificationUrl}
              </Text>

              <Hr className="my-10 border-purple-500/20" />

              {/* What's Next Section */}
              <Section className="mb-10">
                <Heading className="mb-6 text-2xl font-bold text-zinc-100">
                  Mi vár rád ezután?
                </Heading>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-base font-bold text-purple-400">
                      1
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Gyűjts kártyákat
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Kezdd alapkártyákkal és bővítsd gyűjteményed
                      </Text>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-base font-bold text-purple-400">
                      2
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Építsd fel paklidat
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Válaszd ki kártyáid stratégiailag
                      </Text>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-base font-bold text-purple-400">
                      3
                    </div>
                    <div className="pt-1">
                      <Text className="m-0 mb-1 text-base font-semibold text-zinc-200">
                        Hódítsd meg kazamatákat
                      </Text>
                      <Text className="m-0 text-sm text-zinc-500">
                        Legyőzd a vezéreket és szerezz dicsőséget
                      </Text>
                    </div>
                  </div>
                </div>
              </Section>

              <Hr className="my-10 border-purple-500/20" />

              {/* Warning */}
              <Section className="rounded-xl border border-red-500/20 bg-red-950/20 p-5">
                <Text className="m-0 text-sm leading-relaxed text-red-300">
                  <span className="font-bold">⚠️ Biztonság:</span> Ha nem te regisztráltál, hagyd figyelmen kívül ezt az emailt, 
                  vagy jelezd nekünk a következő címen: <span className="font-semibold">{supportEmail}</span>
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
                Kérdésed van? Írj nekünk:{' '}
                <a href={`mailto:${supportEmail}`} className="text-purple-400 hover:text-purple-300 underline">
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