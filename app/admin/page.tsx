"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SiteContentItem = {
  id: number;
  key: string;
  value: string;
};

type Service = {
  id?: number;
  category: string;
  name: string;
  price: string;
  description?: string | null;
  position: number;
};

type GalleryImage = {
  id?: number;
  beforeUrl: string;
  afterUrl: string;
  position: number;
};

type ServiceGroup = {
  title: string;
  category: string;
  items: Service[];
};

const defaultHours = [
  ["Lundi", "monday"],
  ["Mardi", "tuesday"],
  ["Mercredi", "wednesday"],
  ["Jeudi", "thursday"],
  ["Vendredi", "friday"],
  ["Samedi", "saturday"],
  ["Dimanche", "sunday"],
] as const;

function PhotoUploader({
  label,
  initialImage,
  onUploaded,
  onError,
}: {
  label: string;
  initialImage: string;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
}) {
  const [image, setImage] = useState(initialImage);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      onError("Format non accepté. Utilisez JPG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError("L'image est trop lourde. Maximum : 5 Mo.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      onError("");

      const signatureResponse = await fetch(
        "/api/admin/upload-signature",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const signatureData = await signatureResponse.json();

      if (
        !signatureResponse.ok ||
        !signatureData.success
      ) {
        throw new Error(
          signatureData.error ??
            "Impossible de préparer l'envoi de la photo."
        );
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append(
        "timestamp",
        String(signatureData.timestamp)
      );
      formData.append("folder", signatureData.folder);
      formData.append("signature", signatureData.signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.secure_url) {
        throw new Error(
          uploadData.error?.message ??
            "Impossible d'envoyer la photo sur Cloudinary."
        );
      }

      setImage(uploadData.secure_url);
      onUploaded(uploadData.secure_url);
    } catch (error) {
      console.error("Erreur upload Cloudinary :", error);

      onError(
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer la photo."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f3e9d0]">
        <Image
          src={image}
          alt={label}
          fill
          className={`object-cover ${
            uploading ? "opacity-50" : ""
          }`}
          sizes="200px"
          unoptimized={image.startsWith("http")}
        />

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#3a2c20]/50">
            <div className="rounded-full bg-[#fff9eb] px-4 py-2 text-xs font-semibold text-[#3a2c20] shadow-lg">
              Envoi en cours...
            </div>
          </div>
        )}
      </div>

      <label
        className={`mt-3 flex w-full items-center justify-center rounded-xl border border-[#3a2c20]/10 bg-[#fff9eb] px-3 py-2.5 text-xs font-semibold transition ${
          uploading
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-[#3a2c20] hover:text-[#f3e9d0]"
        }`}
      >
        {uploading ? "Envoi..." : "Remplacer"}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={uploading}
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
}

function createEmptyService(
  category: string,
  position: number
): Service {
  return {
    category,
    name: "Nouvelle prestation",
    price: "0 €",
    description: null,
    position,
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("prestations");

  const [siteContent, setSiteContent] = useState<
    Record<string, string>
  >({});

  const [services, setServices] = useState<Service[]>([]);

  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const [deletedServiceIds, setDeletedServiceIds] = useState<number[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/content", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de charger les données.");
      }

      const data = await response.json();

      const contentMap: Record<string, string> = {};

      for (const item of data.siteContent as SiteContentItem[]) {
        contentMap[item.key] = item.value;
      }

      setSiteContent(contentMap);
      setServices(data.services ?? []);
      setGallery(data.gallery ?? []);
      setDeletedServiceIds([]);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données du site.");
    } finally {
      setLoading(false);
    }
  }

  function updateContent(key: string, value: string) {
    setSiteContent((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function updateService(
    index: number,
    field: keyof Service,
    value: string
  ) {
    setServices((current) =>
      current.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              [field]:
                field === "position"
                  ? Number(value)
                  : value,
            }
          : service
      )
    );

    setSaved(false);
  }

  function addService(category: string) {
    setServices((current) => {
      const categoryServices = current.filter(
        (service) => service.category === category
      );

      const nextPosition =
        categoryServices.length > 0
          ? Math.max(
              ...categoryServices.map(
                (service) => service.position
              )
            ) + 1
          : 1;

      return [
        ...current,
        createEmptyService(category, nextPosition),
      ];
    });

    setSaved(false);
  }

  function removeService(index: number) {
    const service = services[index];

    if (service.id) {
      setDeletedServiceIds((current) => [
        ...current,
        service.id as number,
      ]);
    }

    setServices((current) =>
      current.filter((_, serviceIndex) => serviceIndex !== index)
    );

    setSaved(false);
  }

  function updateGalleryImage(
    index: number,
    field: "beforeUrl" | "afterUrl",
    url: string
  ) {
    setGallery((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: url,
            }
          : item
      )
    );

    setSaved(false);
  }

  function handleGalleryError(message: string) {
    setError(message);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteContent,
          services,
          gallery,
          deletedServiceIds,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? "Impossible d'enregistrer les modifications."
        );
      }

      setSaved(true);

      await loadData();

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer les modifications."
      );
    } finally {
      setSaving(false);
    }
  }

  const serviceGroups: ServiceGroup[] = [
    {
      title: "Petit chien",
      category: "Petit chien",
      items: services.filter(
        (service) => service.category === "Petit chien"
      ),
    },
    {
      title: "Intermediaire",
      category: "Moyen chien",
      items: services.filter(
        (service) => service.category === "Moyen chien"
      ),
    },
    {
      title: "Grand chien",
      category: "Grand chien",
      items: services.filter(
        (service) => service.category === "Grand chien"
      ),
    },
    {
      title: "Autres soins",
      category: "Autres soins",
      items: services.filter(
        (service) => service.category === "Autres soins"
      ),
    },
    {
      title: "Chat",
      category: "Chat",
      items: services.filter(
        (service) => service.category === "Chat"
      ),
    },
    {
      title: "NAC",
      category: "NAC",
      items: services.filter(
        (service) => service.category === "NAC"
      ),
    },
  ];

  const galleryItems =
    gallery.length > 0
      ? gallery
      : [1, 2, 3, 4].map((number) => ({
          id: number,
          beforeUrl: `/images/avant${number}.jpeg`,
          afterUrl: `/images/apres${number}.jpeg`,
          position: number,
        }));

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3e9d0] text-[#3a2c20]">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b67c43]">
            Administration
          </p>

          <p className="mt-3 font-display text-3xl">
            Chargement...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3e9d0] text-[#3a2c20]">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="border-b border-[#3a2c20]/10 bg-[#fff9eb]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b67c43]">
              Administration
            </p>

            <h1 className="mt-1 font-display text-2xl">
              Coupe de Woof
            </h1>
          </div>

          <a
            href="/"
            className="rounded-full border border-[#3a2c20]/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-[#3a2c20] hover:text-[#f3e9d0]"
          >
            Voir le site →
          </a>
        </div>
      </header>

      {/* =========================================================
          DASHBOARD
      ========================================================= */}

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:px-10">
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="w-full lg:w-64 lg:shrink-0">
          <div className="rounded-[2rem] bg-[#3a2c20] p-3 text-[#f3e9d0] shadow-xl">
            <p className="px-4 pb-3 pt-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#cfa97c]">
              Gestion du site
            </p>

            <button
              onClick={() => setActiveTab("prestations")}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === "prestations"
                  ? "bg-[#b67c43] text-[#f3e9d0]"
                  : "text-[#f3e9d0]/65 hover:bg-[#f3e9d0]/10 hover:text-[#f3e9d0]"
              }`}
            >
              ✂️ Prestations & tarifs
            </button>

            <button
              onClick={() => setActiveTab("infos")}
              className={`mt-1 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === "infos"
                  ? "bg-[#b67c43] text-[#f3e9d0]"
                  : "text-[#f3e9d0]/65 hover:bg-[#f3e9d0]/10 hover:text-[#f3e9d0]"
              }`}
            >
              📍 Informations
            </button>

            <button
              onClick={() => setActiveTab("horaires")}
              className={`mt-1 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === "horaires"
                  ? "bg-[#b67c43] text-[#f3e9d0]"
                  : "text-[#f3e9d0]/65 hover:bg-[#f3e9d0]/10 hover:text-[#f3e9d0]"
              }`}
            >
              🕐 Horaires
            </button>

            <button
              onClick={() => setActiveTab("galerie")}
              className={`mt-1 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === "galerie"
                  ? "bg-[#b67c43] text-[#f3e9d0]"
                  : "text-[#f3e9d0]/65 hover:bg-[#f3e9d0]/10 hover:text-[#f3e9d0]"
              }`}
            >
              🖼️ Galerie
            </button>
          </div>

          <div className="mt-4 rounded-[2rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#b67c43]">
              Conseil
            </p>

            <p className="mt-3 text-sm leading-6 text-[#3a2c20]/65">
              Les modifications seront enregistrées sur le site après
              validation.
            </p>
          </div>
        </aside>

        {/* =====================================================
            CONTENU PRINCIPAL
        ===================================================== */}

        <section className="min-w-0 flex-1">
          {/* ===================================================
              PRESTATIONS
          =================================================== */}

          {activeTab === "prestations" && (
            <div>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b67c43]">
                  Prestations
                </p>

                <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                  Prestations & tarifs
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#3a2c20]/60">
                  Modifiez les tarifs et les prestations affichés
                  sur le site.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {serviceGroups.map((group) => (
                  <article
                    key={group.category}
                    className="rounded-[2rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-2xl">
                          {group.title}
                        </h3>

                        <span className="mt-2 inline-block rounded-full bg-[#f3e9d0] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#b67c43]">
                          {group.category === "Chat"
                            ? "Félin"
                            : group.category === "NAC"
                              ? "Autres animaux"
                              : group.category === "Autres soins"
                                ? "Compléments"
                                : "Chien"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {group.items.length === 0 ? (
                        <p className="rounded-xl bg-[#f3e9d0] px-4 py-3 text-sm text-[#3a2c20]/60">
                          Aucune prestation.
                        </p>
                      ) : (
                        group.items.map((service) => {
                          const index = services.findIndex(
                            (item) =>
                              item.id === service.id &&
                              item.category === service.category &&
                              item.name === service.name
                          );

                          return (
                            <div
                              key={`${service.id ?? "new"}-${index}`}
                              className="grid grid-cols-[1fr_110px_auto] gap-3"
                            >
                              <input
                                value={service.name}
                                onChange={(event) =>
                                  updateService(
                                    index,
                                    "name",
                                    event.target.value
                                  )
                                }
                                className="w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b67c43]"
                              />

                              <input
                                value={service.price}
                                onChange={(event) =>
                                  updateService(
                                    index,
                                    "price",
                                    event.target.value
                                  )
                                }
                                className="w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#b67c43]"
                              />

                              <button
                                type="button"
                                onClick={() => removeService(index)}
                                className="rounded-xl border border-[#3a2c20]/10 px-3 text-sm text-[#3a2c20]/50 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                title="Supprimer"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addService(group.category)}
                      className="mt-5 text-xs font-semibold text-[#b67c43] hover:underline"
                    >
                      + Ajouter une prestation
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================
              INFORMATIONS
          =================================================== */}

          {activeTab === "infos" && (
            <div>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b67c43]">
                  Informations
                </p>

                <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                  Coordonnées
                </h2>

                <p className="mt-3 text-sm text-[#3a2c20]/60">
                  Ces informations apparaissent dans la partie
                  Contact du site.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b67c43]">
                      Téléphone
                    </span>

                    <input
                      value={siteContent.phone ?? ""}
                      onChange={(event) =>
                        updateContent("phone", event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 outline-none focus:border-[#b67c43]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b67c43]">
                      Email
                    </span>

                    <input
                      value={siteContent.email ?? ""}
                      onChange={(event) =>
                        updateContent("email", event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 outline-none focus:border-[#b67c43]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b67c43]">
                      Adresse
                    </span>

                    <input
                      value={siteContent.address ?? ""}
                      onChange={(event) =>
                        updateContent("address", event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 outline-none focus:border-[#b67c43]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b67c43]">
                      Instagram
                    </span>

                    <input
                      value={siteContent.instagram ?? ""}
                      onChange={(event) =>
                        updateContent(
                          "instagram",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 outline-none focus:border-[#b67c43]"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              HORAIRES
          =================================================== */}

          {activeTab === "horaires" && (
            <div>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b67c43]">
                  Horaires
                </p>

                <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                  Horaires d’ouverture
                </h2>

                <p className="mt-3 text-sm text-[#3a2c20]/60">
                  Modifiez directement les horaires affichés sur le
                  site.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-6 sm:p-8">
                <div className="space-y-4">
                  {defaultHours.map(([day, key]) => (
                    <div
                      key={key}
                      className="grid items-center gap-3 sm:grid-cols-[140px_1fr]"
                    >
                      <span className="text-sm font-semibold">
                        {day}
                      </span>

                      <input
                        value={siteContent[key] ?? ""}
                        onChange={(event) =>
                          updateContent(key, event.target.value)
                        }
                        className="w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b67c43]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              GALERIE
          =================================================== */}

          {activeTab === "galerie" && (
            <div>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b67c43]">
                  Galerie
                </p>

                <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                  Photos du site
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#3a2c20]/60">
                  Remplacez facilement les photos avant et après
                  directement depuis cette interface.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {galleryItems.map((item, index) => (
                  <article
                    key={item.id ?? `new-${index}`}
                    className="rounded-[2rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-5"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#b67c43]">
                      Transformation {index + 1}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <PhotoUploader
                        label={`Photo avant transformation ${index + 1}`}
                        initialImage={item.beforeUrl}
                        onUploaded={(url) =>
                          updateGalleryImage(
                            index,
                            "beforeUrl",
                            url
                          )
                        }
                        onError={handleGalleryError}
                      />

                      <PhotoUploader
                        label={`Photo après transformation ${index + 1}`}
                        initialImage={item.afterUrl}
                        onUploaded={(url) =>
                          updateGalleryImage(
                            index,
                            "afterUrl",
                            url
                          )
                        }
                        onError={handleGalleryError}
                      />
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#cfa97c]/30 bg-[#fff9eb] p-4 text-sm leading-6 text-[#3a2c20]/60">
                Les nouvelles photos sont envoyées sur Cloudinary.
                Pensez ensuite à cliquer sur « Enregistrer les
                modifications » pour enregistrer définitivement les
                nouvelles photos sur le site.
              </div>
            </div>
          )}

          {/* ===================================================
              MESSAGE ERREUR
          =================================================== */}

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* ===================================================
              BOUTON ENREGISTRER
          =================================================== */}

          <div className="sticky bottom-5 mt-10 flex items-center justify-between gap-4 rounded-[1.5rem] border border-[#cfa97c]/30 bg-[#fff9eb]/95 p-4 shadow-2xl backdrop-blur">
            <div>
              {saved ? (
                <p className="text-sm font-semibold text-[#4d7a4d]">
                  ✓ Modifications enregistrées
                </p>
              ) : saving ? (
                <p className="text-sm font-semibold text-[#b67c43]">
                  Enregistrement...
                </p>
              ) : (
                <p className="text-sm text-[#3a2c20]/60">
                  Pensez à enregistrer vos modifications.
                </p>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-[#3a2c20] px-7 py-3.5 text-sm font-semibold text-[#f3e9d0] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#4a3828] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Enregistrement..."
                : "Enregistrer les modifications"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}