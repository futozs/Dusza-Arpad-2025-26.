<div align="center">
  <img src="public/damareen.png" alt="Damareen Logo" width="200"/>
  
  # Damareen
  
  ### 🏆 Dusza Árpád Programozói Emlékverseny 2025/26
  
  [![GitHub Stars](https://img.shields.io/github/stars/futozs/Dusza-Arpad-2025-26?style=for-the-badge&logo=github)](https://github.com/futozs/Dusza-Arpad-2025-26)
  [![GitHub Forks](https://img.shields.io/github/forks/futozs/Dusza-Arpad-2025-26?style=for-the-badge&logo=github)](https://github.com/futozs/Dusza-Arpad-2025-26)
  [![Website](https://img.shields.io/badge/Website-damareen.hu-00ADD8?style=for-the-badge&logo=google-chrome&logoColor=white)](https://damareen.hu)
  
  ![Next.js](https://img.shields.io/badge/Next.js-16.0-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  
  **Stratégiai kártyajáték platform • NextAuth autentikáció • Email notifikációk**
  
  
</div>

<div align="center">

## ⚡ Gyors Indítás

**Előfeltételek:** `Node.js 18+` • `MySQL 8.0+`

</div>

<div align="center">

<table>
<tr>
<td width="50%" valign="top" align="center">

### <a href="https://nodejs.org/en/download" target="_blank">Node.js</a>

```bash
git clone https://github.com/futozs/Dusza-Arpad-2025-26
cd Dusza-Arpad-2025-26

npm install
npx auth secret
```

</td>
<td width="50%" valign="top" align="center">

### <a href="https://bun.sh/" target="_blank">Bun</a> (gyorsabb)

```bash
git clone https://github.com/futozs/Dusza-Arpad-2025-26
cd Dusza-Arpad-2025-26

bun install
bunx auth secret
```

</td>
</tr>
</table>

</div>

<div align="center">

### 🔧 Környezeti Változók

Hozz létre `.env` fájlt:

</div>

<div align="center">
<div style="text-align: left; display: inline-block; max-width: 650px;">

```env
DATABASE_URL="mysql://username:password@localhost:3306/damareen"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generated-secret-from-npx-auth-secret>"
APP_URL="https://localhost:3000"


# Email (opcionális)
MAILCOW_HOST="mail.something.hu"
MAILCOW_PORT="587"
MAILCOW_USER="support@damareen.hu"
MAILCOW_PASSWORD="nagyonerosjelszo"
MAILCOW_SECURE="false"
EMAIL_FROM="noreply@localhost"
```

</div>
</div>


<div align="center">

### 🗄️ Adatbázis & Indítás

<table>
<tr>
<td width="50%" valign="top" align="center">

**Node.js**
```bash
npx prisma migrate reset
npx prisma generate
npm run build
npm run start
```

</td>
<td width="50%" valign="top" align="center">

**Bun**
```bash
bunx prisma migrate reset
bunx prisma generate
bun run build
bun run start
```

</td>
</tr>
</table>

<div align="center">

> **Alkalmazás fut:** [`http://localhost:3000`](http://localhost:3000)

</div>

---

<div align="center">

## 🐳 Docker

```bash
docker-compose -f .devcontainer/docker-compose.yml up --build
```

(ARM platformok nem támogatottak!)

</div>

<br/>

<div align="center">

## 🔑 Teszt Fiókok

| Szerep | Email | Jelszó |
|:------:|:------|:------:|
| Admin | `admin@damareen.hu` | `123456789` |
| Webmaster | `webmaster@damareen.hu` | `123456789` |
| Játékos | `jatekos1@damareen.hu` | `123456789` |
| Játékos | `jatekos2@damareen.hu` | `123456789` |
| Játékos | `jatekos3@damareen.hu` | `123456789` |

</div>

---

## 📖 Projekt Áttekintés

A **Damareen** egy komplex, full-stack stratégiai kártyajáték platform, amely a Dusza Árpád Programozói Emlékverseny 2025/26-os versenykiírására készült. A projekt célja egy modern, biztonságos és skálázható webalkalmazás létrehozása, amely egyesíti a játékélményt a professzionális fejlesztési gyakorlatokkal.

### Játék Koncepció

A játékosok különböző dungeon-ökön keresztül haladnak, ahol stratégiai csatákban vesznek részt. Minden játékos gyűjt kártyákat, épít deckeket, és fejleszti karakterét a progresszív játékmenet során.

---

## ✨ Főbb Funkciók

<details>
<summary><b>🔍 Kattints ide a részletes funkciólista megtekintéséhez</b></summary>

<div align="center">

<br/>

| **Kategória** | **Funkciók** | **Technológia** |
|:---|:---|:---|
| **🔐 Autentikáció & Biztonság** | NextAuth.js alapú bejelentkezés<br/>Kétfaktoros hitelesítés (2FA)<br/>Email verifikáció<br/>Jelszó visszaállítás<br/>Backup kódok kezelése<br/>Session management | NextAuth.js v5<br/>Prisma Session Store<br/>TOTP (speakeasy)<br/>bcrypt |
| **🎮 Játék Mechanika** | Dungeon progresszió nyomon követés<br/>Dinamikus kártya kollekció<br/>Interaktív deck builder<br/>Turn-based csata rendszer<br/>Leader & World kártyák<br/>Real-time battle arena | React State Management<br/>Framer Motion<br/>Custom Game Engine |
| **📊 Dashboard & Profilok** | Személyre szabható profil<br/>Részletes statisztikák<br/>Globális ranglisták<br/>Játék történet & replay<br/>Teljesítmény metrikák<br/>Profil láthatóság beállítások | React Query<br/>Chart.js/Recharts<br/>Server Components |
| **⚙️ Admin & Webmaster Panel** | User management & role kezelés<br/>Kártya létrehozás & szerkesztés<br/>Environment konfiguráció<br/>Dungeon szerkesztő<br/>Játék paraméterek finomhangolása<br/>Audit log rendszer | Role-based Access Control<br/>Server Actions<br/>Optimistic Updates |
| **📧 Email Rendszer** | Bejelentkezési értesítések<br/>Jelszó visszaállítás email<br/>Email cím verifikáció<br/>Egyedi HTML templates<br/>Automatikus email küldés | React Email<br/>Nodemailer<br/>SMTP konfiguráció |
| **🎨 UI/UX** | Responsive design minden eszközön<br/>Dark mode támogatás<br/>Animált komponensek<br/>Scroll reveal effektek<br/>Spotlight kártyák<br/>Liquid ether háttér | Tailwind CSS<br/>Framer Motion<br/>Radix UI<br/>shadcn/ui |

</div>

</details>

---

## 🧰 Tech Stack

<div align="center">

### Core

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend & Database

![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)

### UI & Animation

![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Radix](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)
![shadcn](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

---

## 🚀 Development

<div align="center">

### Fejlesztői Parancsok

| Parancs | Leírás |
|:--------|:-------|
| `npm run dev` / `bun run dev` | Development szerver indítása (hot reload) |
| `npm run build` / `bun run build` | Production build létrehozása |
| `npm run start` / `bun run start` | Production szerver indítása |
| `npm run lint` | ESLint futtatása |
| `npx prisma studio` / `bunx prisma studio` | Adatbázis GUI megnyitása |
| `npx prisma migrate dev` | Új migráció létrehozása |
| `npm run email:dev` | Email template preview szerver |

</div>

## 📧 Email Szolgáltatás

Az alkalmazás **React Email** templateket használ automatikus értesítésekhez:

### Email Típusok
-  Bejelentkezési riasztások: Új eszközről történő bejelentkezés esetén
-  Jelszó visszaállítás: Token-alapú jelszó reset
-  Email verifikáció: Regisztráció utáni megerősítés

### Email Development Mode

```bash
npm run email:dev
# Elérhető: http://localhost:3001
```

Email templatek szerkesztése közben élőben látható preview minden template-ről.

---

## 🏗️ Adatbázis Architektúra

### Fő Táblák

<div align="center">

| Tábla | Leírás | Kapcsolatok |
|:------|:-------|:------------|
| Tábla | Leírás | Kapcsolatok |
|:------|:-------|:------------|
| **Felhasználó** | Felhasználói adatok, szerepkör kezelése | → Fiók, Munkamenet, Játékos |
| **Játékos** | Játékos statisztikák és előrehaladás | → Felhasználó, KazamataElőrehaladás, Gyűjtemény |
| **Vezérkártya** | Vezérkártyák fő adatai | → JátékosGyűjtemény |
| **Világkártya** | Világkártyák fő adatai | → Csatákban használatos |
| **Kazamata** | Pályák és nehézségi szintek | → KazamataElőrehaladás |
| **Környezet** | Környezeti típusok és módosítók | → Csatafeltételek |
| **Csata** | Csaták története és eredményei | → Játékos, Vezérkártya |

</div>

## Jövőbeli Funkciók

- [ ] Napi küldetések és jutalom rendszer
- [ ] Kártya egyesítés mechanika (duplikált kártyák kombinálása erősebb kártyákért, ha lenne ilyen)
- [ ] Barát rendszer és kihívás mód
- [ ] Kártya ritkaság szintek
- [ ] Időzített esemény kazamaták (hétvégi, ünnepi kihívások)
- [ ] Pakli template-ek mentése és megosztása
- [ ] Teljesítmény és trófeák rendszer
- [ ] Heti ranglétrák szezonális jutalmakkal
- [ ] Kártyakinézet testreszabás (skin rendszer)
- [ ] Battle pass rendszer exkluzív jutalmakkal (mertmiértne)
- [ ] Napi bejelentkezési jutalmak és streak bónuszok


## 💬 Kapcsolat & Support

**Készítők:**
- **Futó Zsombor** - Lead Developer - Full stack Developer -
- **Gyulai Gergő** - Full-stack Developer  
- **Szűcs Noel Gergő** - Tesztelő, Dokumentáció

**Projekt Link:** [github.com/futozs/Dusza-Arpad-2025-26](https://github.com/futozs/Dusza-Arpad-2025-26)

**Live Platform:** [damareen.hu](https://damareen.hu)

---
## Licensz

**MIT** © 2025 Futó Zsombor, Gyulai Gergő, Szűcs Noel Gergő

---

<div align="center">

### ⭐ Ha tetszik a projekt, adj neki egy csillagot!

**Made with ❤️ by Npm Install**

</div>