import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-purple-400/30 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-purple-900/40">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            Belépés
          </CardTitle>
          <CardDescription className="text-zinc-300 text-base">
            Lépj be a kártyák világába
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-zinc-200 font-semibold">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="pakli.mester@damareen.hu"
                  className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-zinc-200 font-semibold">Jelszó</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-purple-300 underline-offset-4 hover:text-purple-200 hover:underline font-medium transition-colors"
                  >
                    Elfelejtetted?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  className="border-2 border-purple-400/40 bg-zinc-950/70 text-zinc-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                  required 
                />
              </Field>
              <Field>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600 text-white font-bold text-lg py-6 shadow-2xl shadow-purple-900/60 border-2 border-white/20 transition-all hover:scale-[1.02] hover:shadow-purple-600/80"
                >
                  Belépés
                </Button>
                <FieldDescription className="text-center text-zinc-300 mt-4">
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
