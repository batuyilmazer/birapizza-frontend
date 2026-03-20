# project: bira.pizza

## Stack
- Astro@6.0.6 + React, Typescript, Tailwind CSS, GSAP

## Commands
- 'npm run dev' - development server
- 'npm run build' - production build
- 'npm install' - <TODO: Fill here>

## Project Structure

```
birapizza-frontend/
├── public/
│   ├── fonts/                  # Self-hosted fontlar (Google Fonts yerine tercih et)
│   ├── images/                 # Build sürecinde işlenmeyen statik dosyalar (favicon, OG image)
│   └── favicon.svg
│
├── src/
│   ├── assets/                 # Astro'nun build sırasında optimize ettiği görseller
│   │   └── images/             # <Image /> komponentiyle kullanılacak görseller buraya
│   │
│   ├── components/             # Yeniden kullanılabilir UI parçaları
│   │   ├── common/             # Tüm sayfalarda kullanılan evrensel bileşenler
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── SEO.astro       # <head> içindeki tüm meta tag'ler buradan yönetilir
│   │   │   └── Cursor.astro
│   │   ├── ui/                 # Atomik, bağımsız UI elemanları
│   │   │   ├── Button.astro
│   │   │   ├── Badge.astro
│   │   │   └── Card.astro
│   │   └── sections/           # Sayfa içindeki büyük, anlamlı bölümler
│   │       ├── Hero.astro
│   │       ├── Menu.astro
│   │       └── Contact.astro
│   │
│   ├── layouts/                # Sayfa iskeletleri — tüm sayfalar bir layout'u extend eder
│   │   ├── BaseLayout.astro    # Ana iskelet: <html>, <head>, <body>, Header, Footer
│   │   └── MenuLayout.astro    # Menü sayfasına özel layout (gerekirse)
│   │
│   ├── pages/                  # Astro file-based routing — dosya adı = URL yolu
│   │   ├── index.astro         # /
│   │   ├── menu.astro          # /menu
│   │   ├── about.astro         # /about
│   │   └── contact.astro       # /contact
│   │
│   ├── styles/                 # Global ve paylaşılan stiller
│   │   ├── global.css          # CSS reset, @font-face, CSS custom properties (design tokens)
│   │   ├── typography.css      # Başlık, paragraf, link stilleri
│   │   └── animations.css      # Yalnızca CSS @keyframes (loading, simple transitions)
│   │
│   ├── animations/             # GSAP animasyon tanımları — JS/TS animasyonları buraya
│   │   ├── gsap.config.ts      # Plugin kayıtları (ScrollTrigger, etc.) — tek seferlik setup
│   │   ├── transitions.ts      # Sayfa geçiş animasyonları
│   │   └── scroll.ts           # ScrollTrigger bazlı animasyonlar
│   │
│   ├── content/                # Astro Content Collections — CMS yerine type-safe veri katmanı
│   │   └── menu/               # Menü öğeleri (markdown veya JSON)
│   │       ├── pizzas.json
│   │       └── drinks.json
│   │
│   ├── utils/                  # Saf TypeScript yardımcı fonksiyonlar (side-effect yok)
│   │   └── formatPrice.ts
│   │
│   └── types/                  # Proje genelinde kullanılan TypeScript tip tanımları
│       └── index.ts
│
├── .agents/
│   ├── AGENT.md                # Bu dosya — agent ve geliştirici yönergeleri
│   └── CLAUDE.md
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

### Klasör Kuralları

**`src/components/`** — Bileşenleri üç katmana ayır:

- **`ui/`** → Tek başına anlam taşıyan küçük elemanlar. Prop alır, kendi içinde tamamdır. Örnek: `Button`, `Badge`, `Card`. Sayfa veya layout'a bağımlılığı olmaz.
- **`sections/`** → Bir sayfanın büyük bloklarıdır. Birden fazla `ui/` bileşeni barındırabilir. Örnek: `Hero`, `MenuGrid`, `ContactForm`.
- **`common/`** → Her sayfada tekrar eden global bileşenler. Örnek: `Header`, `Footer`, `SEO`.

> Kural: Bir bileşeni iki farklı yerde kullanıyorsan component'e çıkar. Tek yerde kullanılıyorsa sayfada inline tutabilirsin — erken soyutlama yapma.

**`src/pages/`**

- Her dosya otomatik olarak bir URL route'u oluşturur (`menu.astro` → `/menu`).
- Sayfa dosyaları içerik koordinatörü gibi davranır: layout'u import eder, section'ları yerleştirir.
- İş mantığı ve büyük HTML blokları sayfa dosyasına değil, ilgili section veya component'e taşınır.
- Dinamik route'lar için `[slug].astro` sözdizimini kullan.

**`src/layouts/`**

- Her sayfa mutlaka bir layout kullanır. Bare `<html>` tag'i sayfa dosyasında açma.
- `BaseLayout.astro`, `<html>`, `<head>`, `<body>`, `Header` ve `Footer`'ı içerir; `<slot />` ile sayfa içeriğini alır.
- Yeni bir layout ancak gerçekten farklı bir iskelet gerektiğinde oluşturulur.

**`src/styles/`**

- `global.css` → Yalnızca reset, `@font-face`, ve CSS custom properties (design tokens). Selector yazma.
- `typography.css` → `h1`, `h2`, `p`, `a` gibi HTML element bazlı stiller.
- `animations.css` → Yalnızca CSS `@keyframes` (loading spinner, basit geçişler). GSAP animasyonlarını buraya yazma.
- Bileşen/sayfa özel stiller → O dosyanın `<style>` bloğuna yaz. Ayrı `.css` dosyası açma.

**`src/animations/`**

- `gsap.config.ts` → GSAP plugin'lerini (`ScrollTrigger`, `Flip`, vb.) bir kez kaydet. Her component'te `registerPlugin` çağırma.
- `transitions.ts` → Sayfa geçişleri ve genel enter/exit animasyonları.
- `scroll.ts` → ScrollTrigger bazlı animasyonlar.
- Bileşene özel, başka yerde tekrar etmeyecek animasyonlar doğrudan o component'in `<script>` bloğuna yazılabilir.

### GSAP Kullanım Kuralları

GSAP animasyonları Astro'da `<script>` bloğu içinde çalışır (client-side).

```astro
<!-- src/components/sections/Hero.astro -->
<div class="hero" id="hero">...</div>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { registerPlugins } from '../animations/gsap.config';

  registerPlugins(); // Plugin'leri merkezi config'den kaydet

  gsap.from('#hero', { opacity: 0, y: 40, duration: 0.8, ease: 'power2.out' });
</script>
```

```ts
// src/animations/gsap.config.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function registerPlugins() {
  gsap.registerPlugin(ScrollTrigger);
}
```

**Kurallar:**
- `gsap.registerPlugin()` her component'te çağırma — `gsap.config.ts`'den merkezi olarak yönet.
- Animasyon yalnızca bir bileşende kullanılacaksa o bileşenin `<script>` bloğuna yaz.
- Birden fazla bileşende tekrar eden animasyonları `src/animations/` altına fonksiyon olarak çıkar.
- Basit hover/transition efektleri için önce CSS tercih et; karmaşık, timeline veya scroll bazlı animasyonlar için GSAP kullan.
- `document.querySelector` yerine Astro'da `<script>` bloğu zaten DOM hazır olduğunda çalışır; ekstra `DOMContentLoaded` listener'a gerek yok.

### Styling Kuralları

Her `.astro` dosyasındaki `<style>` bloğu otomatik olarak scope'lanır; class isimleri çakışmaz.

```astro
<!-- src/components/ui/Card.astro -->
<div class="card">
  <slot />
</div>

<style>
  /* Bu stil sadece Card.astro'ya uygulanır */
  .card {
    background: var(--color-surface);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }
</style>
```

Renk, tipografi ve boşluk gibi tüm tasarım kararları `global.css` içindeki `:root` bloğunda tanımlanır.
Kod içinde sabit renk (`#EB3321`) veya sabit boyut (`16px`) yazma — her zaman CSS değişkeni kullan.

```css
/* src/styles/global.css */
:root {
  --color-brand:   #EB3321;
  --color-surface: #FFFFFF;
  --color-text:    #1A1A1A;
  --color-muted:   #6B6B6B;

  --font-display:  'Bahianita', serif;
  --font-body:     'Inter', sans-serif;

  --spacing-xs:    0.25rem;
  --spacing-sm:    0.5rem;
  --spacing-md:    1rem;
  --spacing-lg:    2rem;
  --spacing-xl:    4rem;

  --radius-sm:     4px;
  --radius-md:     8px;
  --radius-lg:     16px;
}
```

### BaseLayout Kullanımı

```astro
<!-- src/layouts/BaseLayout.astro -->
---
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Bira Pizza — Napoli usulü pizza.' } = Astro.props;
---
<html lang="tr">
  <head>
    <SEO title={title} description={description} />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

```astro
<!-- src/pages/menu.astro -->
---
import BaseLayout from '../layouts/BaseLayout.astro';
import MenuGrid from '../components/sections/Menu.astro';
---
<BaseLayout title="Menü | Bira Pizza">
  <MenuGrid />
</BaseLayout>
```

### Yeni Sayfa Ekleme Adımları

1. `src/pages/sayfa-adi.astro` dosyası oluştur.
2. `BaseLayout` ile sar; `title` ve gerekirse `description` ver.
3. Sayfanın büyük bölümlerini `src/components/sections/` altına component olarak çıkar.
4. Atomik elemanları (buton, kart, rozet) `src/components/ui/` altına koy.
5. Bu bileşene özel stiller için o dosyanın `<style>` bloğunu kullan.
6. Paylaşılan yeni bir token gerekiyorsa `src/styles/global.css`'e ekle.

### Yeni Bileşen Ekleme Adımları

1. Hangi katmana ait olduğunu belirle: `ui/`, `sections/`, `common/`.
2. Doğru klasörün altına `BilesenAdi.astro` dosyası oluştur (PascalCase).
3. Props'ları TypeScript `interface Props` ile tanımla.
4. Stiller için `<style>` bloğu kullan; `global.css`'e dokunma.
5. Sabit değer (renk, boyut) yazma — CSS değişkeni kullan.

### Genel Kurallar

- **Dosya isimleri:** Bileşenler `PascalCase` (`Button.astro`), sayfalar ve klasörler `kebab-case` (`menu.astro`).
- **TypeScript:** Her zaman `interface Props` ile prop tiplerini tanımla. `any` kullanma.
- **Görseller:** Optimize edilmesi gerekenler `src/assets/images/`'a, doğrudan referans edilecekler `public/images/`'a.
- **Fontlar:** Google Fonts CDN yerine `public/fonts/`'a indirip `@font-face` ile yükle (performans + GDPR).
- **Dependency:** Yeni paket eklemeden önce Astro'nun built-in çözümünü kontrol et.
- **Interaktivite:** React/Vue gerçekten gerekmedikçe ekleme. Astro component'ları ve vanilla JS yeterliyse onları kullan.
- **Animasyon:** Basit efektler için CSS kullan. Timeline, scroll bazlı veya karmaşık sekanslar için GSAP kullan. Her ikisini aynı anda karıştırma — bir animasyonun sahibi ya CSS ya GSAP olsun.

## Code Style

## Do Not

## Git & Workflow

## Testing

## Enviroment Variables