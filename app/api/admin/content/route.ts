import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [siteContent, services, gallery] = await Promise.all([
      prisma.siteContent.findMany({
        orderBy: {
          key: "asc",
        },
      }),

      prisma.service.findMany({
        where: {
          active: true,
        },
        orderBy: [
          {
            category: "asc",
          },
          {
            position: "asc",
          },
        ],
      }),

      prisma.galleryImage.findMany({
        where: {
          active: true,
        },
        orderBy: {
          position: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      siteContent,
      services,
      gallery,
    });
  } catch (error) {
    console.error("Erreur récupération contenu admin :", error);

    return NextResponse.json(
      {
        error: "Impossible de récupérer les données.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const siteContent = body.siteContent ?? {};
    const services = Array.isArray(body.services)
      ? body.services
      : [];
    const gallery = Array.isArray(body.gallery)
      ? body.gallery
      : [];
    const deletedServiceIds = Array.isArray(
      body.deletedServiceIds
    )
      ? body.deletedServiceIds
      : [];

    await prisma.$transaction(async (tx) => {
      // ------------------------------------------------------------
      // INFORMATIONS + HORAIRES
      // ------------------------------------------------------------

      for (const [key, value] of Object.entries(siteContent)) {
        if (typeof value !== "string") {
          continue;
        }

        await tx.siteContent.upsert({
          where: {
            key,
          },
          update: {
            value,
          },
          create: {
            key,
            value,
          },
        });
      }

      // ------------------------------------------------------------
      // SUPPRESSION DES PRESTATIONS
      // ------------------------------------------------------------

      for (const id of deletedServiceIds) {
        if (typeof id !== "number") {
          continue;
        }

        await tx.service.update({
          where: {
            id,
          },
          data: {
            active: false,
          },
        });
      }

      // ------------------------------------------------------------
      // PRESTATIONS
      // ------------------------------------------------------------

      for (const service of services) {
        if (
          typeof service.name !== "string" ||
          typeof service.price !== "string" ||
          typeof service.category !== "string"
        ) {
          continue;
        }

        if (typeof service.id === "number") {
          await tx.service.update({
            where: {
              id: service.id,
            },
            data: {
              category: service.category,
              name: service.name,
              price: service.price,
              description:
                typeof service.description === "string"
                  ? service.description
                  : null,
              position:
                typeof service.position === "number"
                  ? service.position
                  : 0,
              active: true,
            },
          });
        } else {
          await tx.service.create({
            data: {
              category: service.category,
              name: service.name,
              price: service.price,
              description:
                typeof service.description === "string"
                  ? service.description
                  : null,
              position:
                typeof service.position === "number"
                  ? service.position
                  : 0,
              active: true,
            },
          });
        }
      }

      // ------------------------------------------------------------
      // GALERIE
      // ------------------------------------------------------------

      for (const image of gallery) {
        if (
          typeof image.beforeUrl !== "string" ||
          typeof image.afterUrl !== "string"
        ) {
          continue;
        }

        if (typeof image.id === "number") {
          await tx.galleryImage.update({
            where: {
              id: image.id,
            },
            data: {
              beforeUrl: image.beforeUrl,
              afterUrl: image.afterUrl,
              position:
                typeof image.position === "number"
                  ? image.position
                  : 0,
              active: true,
            },
          });
        } else {
          await tx.galleryImage.create({
            data: {
              beforeUrl: image.beforeUrl,
              afterUrl: image.afterUrl,
              position:
                typeof image.position === "number"
                  ? image.position
                  : 0,
              active: true,
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Modifications enregistrées.",
    });
  } catch (error) {
    console.error("Erreur sauvegarde admin :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Impossible d'enregistrer les modifications.",
      },
      {
        status: 500,
      }
    );
  }
}