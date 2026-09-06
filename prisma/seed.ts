import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL n'est pas définie.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.siteContent.deleteMany();
  await prisma.service.deleteMany();
  await prisma.galleryImage.deleteMany();

  await prisma.siteContent.createMany({
    data: [
      {
        key: "phone",
        value: "07 62 53 14 92",
      },
      {
        key: "email",
        value: "coupedewoof@gmail.com",
      },
      {
        key: "address",
        value: "30 Rue du Colonel Boutin, 44430 Le Loroux-Bottereau",
      },
      {
        key: "instagram",
        value: "@coupedewoof",
      },
      {
        key: "monday",
        value: "9h00–12h00 / 13h30–18h00",
      },
      {
        key: "tuesday",
        value: "9h00–12h00 / 13h30–18h00",
      },
      {
        key: "wednesday",
        value: "9h00–12h00 / 13h30–18h00",
      },
      {
        key: "thursday",
        value: "Fermé",
      },
      {
        key: "friday",
        value: "9h00–12h00 / 13h30–18h00",
      },
      {
        key: "saturday",
        value: "9h00–14h00",
      },
      {
        key: "sunday",
        value: "Fermé",
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        category: "Petit chien",
        name: "Tonte",
        price: "45 €",
        position: 1,
      },
      {
        category: "Petit chien",
        name: "Coupe ciseaux",
        price: "50 €",
        position: 2,
      },
      {
        category: "Petit chien",
        name: "Épilation",
        price: "55 €",
        position: 3,
      },

      {
        category: "Moyen chien",
        name: "Tonte",
        price: "50 €",
        position: 1,
      },
      {
        category: "Moyen chien",
        name: "Coupe ciseaux",
        price: "55 €",
        position: 2,
      },
      {
        category: "Moyen chien",
        name: "Épilation",
        price: "60 €",
        position: 3,
      },

      {
        category: "Grand chien",
        name: "Bain + Débourrage",
        price: "40 €/h",
        position: 1,
      },
      {
        category: "Grand chien",
        name: "Épilation",
        price: "70 €",
        position: 2,
      },

      {
        category: "Autres soins",
        name: "Bain",
        price: "25 €",
        position: 1,
      },
      {
        category: "Autres soins",
        name: "Débourrage / Démêlage",
        price: "30 €/h",
        position: 2,
      },
      {
        category: "Autres soins",
        name: "Griffes",
        price: "7 €",
        position: 3,
      },
      {
        category: "Autres soins",
        name: "Désensibilisation",
        price: "10 € la 1ère séance",
        position: 4,
      },
      {
        category: "Autres soins",
        name: "Chiot",
        price: "15 € — 30 min",
        position: 5,
      },

      {
        category: "Chat",
        name: "Démêlage",
        price: "30 €",
        position: 1,
      },
      {
        category: "Chat",
        name: "Démêlage + Bain",
        price: "40 €",
        position: 2,
      },
      {
        category: "Chat",
        name: "Tonte",
        price: "30 €",
        position: 3,
      },
      {
        category: "Chat",
        name: "Tonte + Bain",
        price: "40 €",
        position: 4,
      },

      {
        category: "NAC",
        name: "Démêlage",
        price: "30 €",
        position: 1,
      },
      {
        category: "NAC",
        name: "Tonte",
        price: "30 €",
        position: 2,
      },
    ],
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        beforeUrl: "/images/avant1.jpeg",
        afterUrl: "/images/apres1.jpeg",
        position: 1,
      },
      {
        beforeUrl: "/images/avant2.jpeg",
        afterUrl: "/images/apres2.jpeg",
        position: 2,
      },
      {
        beforeUrl: "/images/avant3.jpeg",
        afterUrl: "/images/apres3.jpeg",
        position: 3,
      },
      {
        beforeUrl: "/images/avant4.jpeg",
        afterUrl: "/images/apres4.jpeg",
        position: 4,
      },
    ],
  });

  console.log("✓ Données Coupe de Woof ajoutées.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });