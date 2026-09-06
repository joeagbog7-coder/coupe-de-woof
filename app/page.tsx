"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const fallbackServices = [
  {
    title: "Petit chien",
    items: [
      ["Tonte", "45 €"],
      ["Coupe ciseaux", "50 €"],
      ["Épilation", "55 €"],
    ],
  },
  {
    title: "Moyen chien",
    items: [
      ["Tonte", "50 €"],
      ["Coupe ciseaux", "55 €"],
      ["Épilation", "60 €"],
    ],
  },
  {
    title: "Grand chien",
    items: [
      ["Bain + Débourrage", "40 €/h"],
      ["Épilation", "70 €"],
    ],
  },
];

const fallbackOtherServices = [
  ["Bain", "25 €"],
  ["Débourrage / Démêlage", "30 €/h"],
  ["Griffes", "7 €"],
  ["Désensibilisation", "10 € la 1ère séance"],
  ["Chiot", "15 € — 30 min"],
];

const fallbackCatServices = [
  ["Démêlage", "30 €"],
  ["Démêlage + Bain", "40 €"],
  ["Tonte", "30 €"],
  ["Tonte + Bain", "40 €"],
];

const fallbackNacServices = [
  ["Démêlage", "30 €"],
  ["Tonte", "30 €"],
];

const fallbackGallery = [
  {
    before: "/images/avant1.jpeg",
    after: "/images/apres1.jpeg",
  },
  {
    before: "/images/avant2.jpeg",
    after: "/images/apres2.jpeg",
  },
  {
    before: "/images/avant3.jpeg",
    after: "/images/apres3.jpeg",
  },
  {
    before: "/images/avant4.jpeg",
    after: "/images/apres4.jpeg",
  },
];

type ServiceRow = [string, string];

type ServiceGroup = {
  title: string;
  items: ServiceRow[];
};

type ApiService = {
  id: number;
  category: string;
  name: string;
  price: string;
  description?: string | null;
  position: number;
  active: boolean;
};

type ApiGalleryImage = {
  id: number;
  beforeUrl: string;
  afterUrl: string;
  position: number;
  active: boolean;
};

type ApiContent = {
  siteContent?: Array<{
    key: string;
    value: string;
  }>;
  services?: ApiService[];
  galleryImages?: ApiGalleryImage[];
};

function groupServicesFromApi(items: ApiService[] | undefined) {
  if (!items?.length) {
    return {
      services: fallbackServices,
      otherServices: fallbackOtherServices,
      catServices: fallbackCatServices,
      nacServices: fallbackNacServices,
    };
  }

  const active = items
    .filter((item) => item.active)
    .sort((a, b) => a.position - b.position);

  const findByCategory = (patterns: string[]) =>
    active
      .filter((item) => {
        const category = item.category.toLowerCase();

        return patterns.some((pattern) => category.includes(pattern));
      })
      .map((item) => [item.name, item.price] as ServiceRow);

  const petit = findByCategory(["petit"]);
  const moyen = findByCategory(["moyen"]);
  const grand = findByCategory(["grand"]);

  const cat = findByCategory(["chat", "félin", "felin"]);
  const nac = findByCategory(["nac"]);
  const other = findByCategory([
    "autre",
    "complément",
    "complement",
    "soin",
  ]);

  return {
    services: [
      {
        title: "Petit chien",
        items: petit.length ? petit : fallbackServices[0].items,
      },
      {
        title: "Moyen chien",
        items: moyen.length ? moyen : fallbackServices[1].items,
      },
      {
        title: "Grand chien",
        items: grand.length ? grand : fallbackServices[2].items,
      },
    ],
    otherServices: other.length ? other : fallbackOtherServices,
    catServices: cat.length ? cat : fallbackCatServices,
    nacServices: nac.length ? nac : fallbackNacServices,
  };
}

function PawIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-8 w-8"
      fill="currentColor"
    >
      <ellipse
        cx="19"
        cy="18"
        rx="7"
        ry="10"
        transform="rotate(-28 19 18)"
      />
      <ellipse
        cx="45"
        cy="18"
        rx="7"
        ry="10"
        transform="rotate(28 45 18)"
      />
      <ellipse
        cx="12"
        cy="34"
        rx="6"
        ry="9"
        transform="rotate(-52 12 34)"
      />
      <ellipse
        cx="52"
        cy="34"
        rx="6"
        ry="9"
        transform="rotate(52 52 34)"
      />
      <path d="M32 29c-9 0-16 8-16 17 0 8 7 12 16 12s16-4 16-12c0-9-7-17-16-17Z" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <circle cx="17" cy="18" r="7" />
      <circle cx="17" cy="46" r="7" />
      <path d="M23 22 52 49" />
      <path d="M23 42 52 15" />
      <path d="M31 31 52 49" />
      <path d="M31 33 52 15" />
    </svg>
  );
}

function ServiceList({
  items,
  light = false,
}: {
  items: string[][];
  light?: boolean;
}) {
  return (
    <div className="mt-6 space-y-4">
      {items.map(([name, price]) => (
        <div
          key={`${name}-${price}`}
          className={`flex items-start justify-between gap-6 border-b pb-4 last:border-0 last:pb-0 ${
            light
              ? "border-[#f3e9d0]/10"
              : "border-[#cfa97c]/30"
          }`}
        >
          <span
            className={`text-[15px] leading-6 ${
              light
                ? "text-[#f3e9d0]/75"
                : "text-[#3a2c20]/80"
            }`}
          >
            {name}
          </span>

          <span
            className={`shrink-0 font-semibold ${
              light
                ? "text-[#f3e9d0]"
                : "text-[#3a2c20]"
            }`}
          >
            {price}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [siteServices, setSiteServices] = useState(fallbackServices);
  const [siteOtherServices, setSiteOtherServices] =
    useState(fallbackOtherServices);
  const [siteCatServices, setSiteCatServices] =
    useState(fallbackCatServices);
  const [siteNacServices, setSiteNacServices] =
    useState(fallbackNacServices);
  const [siteGallery, setSiteGallery] =
    useState(fallbackGallery);
  const [siteContent, setSiteContent] =
    useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSiteContent() {
      try {
        const response = await fetch("/api/admin/content", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data: ApiContent = await response.json();

        const grouped = groupServicesFromApi(data.services);

        setSiteServices(grouped.services);
        setSiteOtherServices(grouped.otherServices);
        setSiteCatServices(grouped.catServices);
        setSiteNacServices(grouped.nacServices);

        if (data.siteContent) {
          const contentMap =
            data.siteContent.reduce<Record<string, string>>(
              (acc, item) => {
                acc[item.key] = item.value;
                return acc;
              },
              {}
            );

          setSiteContent(contentMap);
        }

        if (data.galleryImages?.length) {
          const gallery = data.galleryImages
            .filter((item) => item.active)
            .sort((a, b) => a.position - b.position)
            .map((item) => ({
              before: item.beforeUrl,
              after: item.afterUrl,
            }));

          if (gallery.length) {
            setSiteGallery(gallery);
          }
        }
      } catch (error) {
        console.error(
          "Impossible de charger le contenu du site.",
          error
        );
      }
    }

    loadSiteContent();
  }, []);

  const phone = siteContent.phone || "07 62 53 14 92";
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

  const email =
    siteContent.email || "coupedewoof@gmail.com";

  const address =
    siteContent.address ||
    "30 Rue du Colonel Boutin, 44430 Le Loroux-Bottereau";

  const instagram =
    siteContent.instagram || "@coupedewoof";

  const instagramHandle = instagram.startsWith("@")
    ? instagram
    : `@${instagram}`;

  const instagramUrl = `https://www.instagram.com/${instagramHandle.replace(
    "@",
    ""
  )}/`;

  const hours = [
    ["Lundi", siteContent.monday || "9h00–12h00 / 13h30–18h00"],
    ["Mardi", siteContent.tuesday || "9h00–12h00 / 13h30–18h00"],
    ["Mercredi", siteContent.wednesday || "9h00–12h00 / 13h30–18h00"],
    ["Jeudi", siteContent.thursday || "Fermé"],
    ["Vendredi", siteContent.friday || "9h00–12h00 / 13h30–18h00"],
    ["Samedi", siteContent.saturday || "9h00–14h00"],
    ["Dimanche", siteContent.sunday || "Fermé"],
  ];

  return (
    <main className="overflow-hidden bg-[#f3e9d0] text-[#3a2c20]">

      {/* =========================================================
          NAVIGATION
      ========================================================= */}

      <header className="absolute left-0 top-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          {/* LOGO + NOM DU SITE */}

          <a
            href="#accueil"
            className="flex items-center gap-3 text-[#f3e9d0] drop-shadow-lg"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#f3e9d0]">
              <Image
                src="/images/logo.jpeg"
                alt="Logo Coupe de Woof"
                fill
                className="object-contain"
                sizes="44px"
              />
            </div>

            <span className="font-display text-xl tracking-wide">
              Coupe de Woof
            </span>
          </a>

          <nav className="hidden items-center gap-9 text-sm font-medium text-[#f3e9d0] md:flex">
            <a
              href="#prestations"
              className="transition-opacity hover:opacity-60"
            >
              Prestations
            </a>

            <a
              href="#galerie"
              className="transition-opacity hover:opacity-60"
            >
              Galerie
            </a>

            <a
              href="#contact"
              className="transition-opacity hover:opacity-60"
            >
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="rounded-full bg-[#3a2c20] px-5 py-2.5 text-sm font-semibold text-[#f3e9d0] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-[#4a3828]"
          >
            Nous contacter
          </a>

        </div>
      </header>


      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        id="accueil"
        className="relative min-h-screen overflow-hidden bg-[#3a2c20] text-[#f3e9d0]"
      >

        {/* PHOTO DE FOND */}

        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="Chien après toilettage chez Coupe de Woof"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* ASSOMBRISSEMENT */}

        <div className="absolute inset-0 bg-[#171411]/50" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#171411]/95 via-[#171411]/72 to-[#171411]/25" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#171411]/80 via-transparent to-[#171411]/20" />


        {/* DÉCORATIONS */}

        <div className="absolute -left-32 bottom-[-180px] h-[430px] w-[430px] rounded-full border border-[#cfa97c]/15" />

        <div className="absolute -right-28 top-[-130px] h-[360px] w-[360px] rounded-full bg-[#f3e9d0]/10" />

        <div className="absolute left-[5%] top-[34%] rotate-[-18deg] text-[#cfa97c]/20">
          <PawIcon />
        </div>


        {/* CONTENU */}

        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-28 lg:px-10">

          <div className="grid w-full items-center gap-12">

            {/* =====================================================
                TEXTE GAUCHE
            ===================================================== */}

            <div className="max-w-2xl">

              <div className="mb-7 flex items-center gap-4">

                <span className="h-px w-12 bg-[#cfa97c]" />

                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f3e9d0]/90">
                  Salon de toilettage
                </p>

              </div>


              <p className="mb-7 text-xs font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                Le Loroux-Bottereau
              </p>


              <h1 className="max-w-xl font-display text-[4rem] leading-[0.9] tracking-[-0.045em] sm:text-[5.5rem] lg:text-[6.8rem]">

                Votre compagnon,

                <br />

                <span className="text-[#cfa97c]">
                  notre attention.
                </span>

              </h1>


              <div className="mt-8 flex items-center gap-4 text-[#cfa97c]">

                <span className="h-px w-16 bg-[#cfa97c]" />

                <ScissorsIcon />

                <span className="h-px w-16 bg-[#cfa97c]" />

              </div>


              <p className="mt-7 max-w-xl font-times text-xl leading-8 text-[#f3e9d0]/95 sm:text-2xl">

                Toilettage, soins et mise en beauté

                <br className="hidden sm:block" />

                pour chiens, chats et NAC.

              </p>


              <div className="mt-7 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f3e9d0]/70">

                <span>Chiens</span>

                <span className="h-1 w-1 rounded-full bg-[#cfa97c]" />

                <span>Chats</span>

                <span className="h-1 w-1 rounded-full bg-[#cfa97c]" />

                <span>NAC</span>

              </div>


              <div className="mt-9 flex flex-wrap gap-4">

                <a
                  href="#prestations"
                  className="rounded-full bg-[#b67c43] px-7 py-3.5 text-sm font-semibold text-[#f3e9d0] shadow-2xl shadow-black/20 transition-all hover:-translate-y-1 hover:bg-[#c58a4d]"
                >
                  Découvrir les prestations →
                </a>

                <a
                  href="#contact"
                  className="rounded-full border border-[#f3e9d0]/60 bg-[#171411]/20 px-7 py-3.5 text-sm font-semibold text-[#f3e9d0] backdrop-blur-sm transition-all hover:bg-[#f3e9d0] hover:text-[#3a2c20]"
                >
                  Nous contacter
                </a>

              </div>

            </div>

          </div>

        </div>


        {/* SCROLL */}

        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#f3e9d0]/55">

          <span className="text-lg">
            ↓
          </span>

          <span>
            Découvrir
          </span>

        </div>

      </section>


      {/* =========================================================
          PRESTATIONS
      ========================================================= */}

      <section
        id="prestations"
        className="relative overflow-hidden bg-[#3a2c20] px-6 py-28 text-[#f3e9d0] lg:px-10"
      >

        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#cfa97c]/10" />

        <div className="absolute -left-32 bottom-[-180px] h-[420px] w-[420px] rounded-full border border-[#cfa97c]/10" />

        <div className="absolute right-[8%] top-[18%] rotate-12 text-[#cfa97c]/10">
          <PawIcon />
        </div>


        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div className="max-w-3xl">

              <div className="flex items-center gap-4">

                <span className="h-px w-12 bg-[#cfa97c]" />

                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#cfa97c]">
                  Prestations & tarifs
                </p>

              </div>

              <h2 className="mt-5 font-display text-5xl leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl">

                Prendre soin de

                <br />

                votre compagnon.

              </h2>

            </div>


            <p className="max-w-sm text-sm leading-7 text-[#f3e9d0]/55">

              Des prestations pensées pour respecter chaque animal,
              son pelage, son comportement et ses besoins.

            </p>

          </div>


          {/* CHIENS */}

          <div className="grid gap-5 lg:grid-cols-3">

            {siteServices.map((service, index) => (

              <article
                key={service.title}
                className={`group relative overflow-hidden rounded-[2rem] border p-7 transition-all duration-300 hover:-translate-y-2 ${
                  index === 1
                    ? "border-[#cfa97c]/40 bg-[#f3e9d0] text-[#3a2c20]"
                    : "border-[#f3e9d0]/10 bg-[#f3e9d0]/[0.06]"
                }`}
              >

                <div
                  className={`absolute right-7 top-6 font-display text-6xl leading-none ${
                    index === 1
                      ? "text-[#3a2c20]/[0.06]"
                      : "text-[#f3e9d0]/[0.05]"
                  }`}
                >
                  0{index + 1}
                </div>


                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full ${
                    index === 1
                      ? "bg-[#b67c43] text-[#f3e9d0]"
                      : "bg-[#b67c43]/15 text-[#cfa97c]"
                  }`}
                >
                  <PawIcon />
                </div>


                <div className="relative mt-7">

                  <h3 className="font-display text-3xl sm:text-4xl">
                    {service.title}
                  </h3>

                </div>


                <div className="relative mt-8 space-y-5">

                  {service.items.map(([name, price]) => (

                    <div
                      key={`${name}-${price}`}
                      className={`flex items-end justify-between gap-5 border-b pb-4 last:border-0 last:pb-0 ${
                        index === 1
                          ? "border-[#3a2c20]/10"
                          : "border-[#f3e9d0]/10"
                      }`}
                    >

                      <span
                        className={`text-sm ${
                          index === 1
                            ? "text-[#3a2c20]/65"
                            : "text-[#f3e9d0]/65"
                        }`}
                      >
                        {name}
                      </span>

                      <span
                        className={`shrink-0 font-semibold ${
                          index === 1
                            ? "text-[#b67c43]"
                            : "text-[#f3e9d0]"
                        }`}
                      >
                        {price}
                      </span>

                    </div>

                  ))}

                </div>

              </article>

            ))}

          </div>


          {/* AUTRES SOINS */}

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">

            <article className="rounded-[2rem] border border-[#f3e9d0]/10 bg-[#f3e9d0]/[0.06] p-7">

              <div className="flex items-center justify-between gap-5">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#cfa97c]">
                    Compléments
                  </p>

                  <h3 className="mt-2 font-display text-3xl">
                    Autres soins
                  </h3>

                </div>

                <div className="hidden rounded-full border border-[#cfa97c]/30 p-3 text-[#cfa97c] sm:block">
                  <ScissorsIcon />
                </div>

              </div>

              <ServiceList
                items={siteOtherServices}
                light
              />

            </article>


            <article className="rounded-[2rem] border border-[#f3e9d0]/10 bg-[#f3e9d0]/[0.06] p-7">

              <div className="grid gap-10 sm:grid-cols-2">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#cfa97c]">
                    Félin
                  </p>

                  <h3 className="mt-2 font-display text-3xl">
                    Chat
                  </h3>

                  <ServiceList
                    items={siteCatServices}
                    light
                  />

                </div>


                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#cfa97c]">
                    Autres animaux
                  </p>

                  <h3 className="mt-2 font-display text-3xl">
                    NAC
                  </h3>

                  <ServiceList
                    items={siteNacServices}
                    light
                  />

                </div>

              </div>

            </article>

          </div>


          {/* NOTE */}

          <div className="mt-10 flex flex-col gap-5 border-t border-[#f3e9d0]/10 pt-8 md:flex-row md:items-start">

            <div className="shrink-0 text-[#cfa97c]">
              <PawIcon />
            </div>

            <p className="max-w-4xl text-sm leading-7 text-[#f3e9d0]/50">

              Nos tarifs sont établis dans le respect du bien-être de chaque
              animal. Ils peuvent être ajustés en fonction de son comportement,
              de son état général, ainsi que du temps et de l’attention
              nécessaires pour lui offrir des soins adaptés et de qualité.

            </p>

          </div>

        </div>

      </section>


      {/* =========================================================
          GALERIE
      ========================================================= */}

      <section
        id="galerie"
        className="bg-[#f3e9d0] px-6 py-28 lg:px-10"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <div className="flex items-center gap-4">

                <span className="h-px w-12 bg-[#b67c43]" />

                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b67c43]">
                  Galerie
                </p>

              </div>

              <h2 className="mt-5 font-display text-5xl leading-tight sm:text-6xl">
                Avant & après
              </h2>

            </div>


            <p className="max-w-md text-sm leading-7 text-[#3a2c20]/65">

              Découvrez quelques transformations réalisées au fil des
              toilettages.

            </p>

          </div>


          <div className="grid gap-8 md:grid-cols-2">

            {siteGallery.map((item, index) => (

              <article
                key={item.before}
                className="overflow-hidden rounded-[2rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-3 shadow-xl shadow-[#3a2c20]/10 transition-transform hover:-translate-y-1"
              >

                <div className="grid grid-cols-2 gap-3">

                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">

                    <Image
                      src={item.before}
                      alt={`Chien avant toilettage ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-[#3a2c20]/90 px-3 py-1 text-xs font-semibold text-[#f3e9d0]">
                      Avant
                    </span>

                  </div>


                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">

                    <Image
                      src={item.after}
                      alt={`Chien après toilettage ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-[#b67c43]/95 px-3 py-1 text-xs font-semibold text-[#f3e9d0]">
                      Après
                    </span>

                  </div>

                </div>


                <div className="flex items-center justify-between px-3 py-4">

                  <span className="font-display text-xl">
                    Transformation {index + 1}
                  </span>

                  <span className="text-[#b67c43]">
                    <PawIcon />
                  </span>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          CONTACT
      ========================================================= */}

      <section
        id="contact"
        className="bg-[#f3e9d0] px-6 py-28 lg:px-10"
      >

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">

          <div>

            <div className="flex items-center gap-4">

              <span className="h-px w-12 bg-[#b67c43]" />

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b67c43]">
                Contact
              </p>

            </div>


            <h2 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl">
              Parlons de votre compagnon.
            </h2>


            <p className="mt-6 max-w-lg text-base leading-8 text-[#3a2c20]/70">

              Une question sur une prestation ou envie de prendre contact ?
              Retrouvez toutes les informations nécessaires ci-dessous.

            </p>


            <a
              href={phoneHref}
              className="mt-8 inline-flex rounded-full bg-[#3a2c20] px-7 py-3.5 text-sm font-semibold text-[#f3e9d0] transition-transform hover:-translate-y-1"
            >
              Appeler Coupe de Woof
            </a>

          </div>


          <div className="grid gap-4 sm:grid-cols-2">


            {/* TÉLÉPHONE */}

            <div className="rounded-[1.75rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-6">

              <div className="text-[#b67c43]">
                <PawIcon />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em]">
                Téléphone
              </p>

              <a
                href={phoneHref}
                className="mt-2 block font-display text-2xl hover:underline"
              >
                07 62 53 14 92
              </a>

            </div>


            {/* EMAIL */}

            <div className="rounded-[1.75rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-6">

              <div className="text-[#b67c43]">
                <PawIcon />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em]">
                Email
              </p>

              <a
                href={`mailto:${email}`}
                className="mt-2 block break-all font-display text-xl hover:underline"
              >
                coupedewoof@gmail.com
              </a>

            </div>


            {/* ADRESSE */}

            <div className="rounded-[1.75rem] bg-[#3a2c20] p-6 text-[#f3e9d0] sm:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#cfa97c]">
                Adresse
              </p>

              <p className="mt-3 font-display text-2xl">
                {address.split(",")[0]}
              </p>

              <p className="mt-1 text-[#f3e9d0]/70">
                {address.split(",").slice(1).join(",").trim()}
              </p>

            </div>


            {/* HORAIRES */}

            <div className="rounded-[1.75rem] border border-[#cfa97c]/40 bg-[#cfa97c]/20 p-6 sm:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b67c43]">
                Horaires
              </p>

              <div className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">

                <p>
                  <strong>{hours[0][0]} :</strong> {hours[0][1]}
                </p>

                <p>
                  <strong>{hours[1][0]} :</strong> {hours[1][1]}
                </p>

                <p>
                  <strong>{hours[2][0]} :</strong> {hours[2][1]}
                </p>

                <p>
                  <strong>{hours[3][0]} :</strong> {hours[3][1]}
                </p>

                <p>
                  <strong>{hours[4][0]} :</strong> {hours[4][1]}
                </p>

                <p>
                  <strong>{hours[5][0]} :</strong> {hours[5][1]}
                </p>

                <p>
                  <strong>{hours[6][0]} :</strong> {hours[6][1]}
                </p>

              </div>

            </div>


            {/* INSTAGRAM */}

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[1.75rem] bg-[#b67c43] p-6 text-[#f3e9d0] transition-transform hover:-translate-y-1 sm:col-span-2"
            >

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f3e9d0]/70">
                Instagram
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">

                <span className="font-display text-3xl">
                  @coupedewoof
                </span>

                <span className="text-2xl transition-transform group-hover:translate-x-1">
                  →
                </span>

              </div>

            </a>

          </div>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="bg-[#3a2c20] px-6 py-10 text-[#f3e9d0] lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <p className="font-display text-2xl">
              Coupe de Woof
            </p>

            <p className="mt-1 text-sm text-[#f3e9d0]/55">
              Salon de toilettage
            </p>

          </div>


          <p className="text-sm text-[#f3e9d0]/50">
            © {new Date().getFullYear()} Coupe de Woof — Tous droits réservés.
          </p>

        </div>

      </footer>

    </main>
  );
}