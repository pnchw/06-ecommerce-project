import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      {
        name: "Admin Baifern",
        email: "admin1@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        role: "admin",
      },
      {
        name: "Baifern",
        email: "testuser1@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        role: "user",
      },
    ],
  });

  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      {
        name: "Yuta Okkotsu",
        description: "Yuta Okkotsu is the protagonist of Gege Akutami's manga Jujutsu Kaisen 0, originally known as Tokyo Metropolitan Curse Technical School",
        images: ["/assets/images/product1.jpg", "/assets/images/product1-2.jpg", "/assets/images/product1-3.jpg"],
        brand: "YUTA",
        stock: 20,
        price: 5,
      },
      {
        name: "Zenitsu Agatsuma",
        description: "Zenitsu Agatsuma is a demon slayer in the Demon Slayer Corps. His technique is Thunder Breathing, but it has given him the power to overcome demons with his sword.",
        images: ["/assets/images/product2.jpg", "/assets/images/product2-2.jpg", "/assets/images/product2-3.jpg"],
        brand: "ZENITSU",
        stock: 30,
        price: 10,
      },
      {
        name: "Kyojuro Rengoku",
        description: "One of the Hashiras of the Demon Slayer Corps, the Flame Hashira, who uses Flame Breathing. He's cheerful and eccentric, but never one to mince words.",
        images: ["/assets/images/product3.jpg", "/assets/images/product3-2.jpg", "/assets/images/product3-3.jpg"],
        brand: "RENGOKU",
        stock: 40,
        price: 15,
      },
      {
        name: "Muichiro Tokito",
        description: "Known as the Mist Hashira, recognized for his exceptional swordsmanship skills and unique fighting style.",
        images: ["/assets/images/product4.jpg", "/assets/images/product4-2.jpg"],
        brand: "MUICHIRO",
        stock: 50,
        price: 20,
      },
      {
        name: "Inosuke Hashibira",
        description: "Known for his wild and feral personality, often behaving like a savage beast. Inosuke is a skilled swordsman with a unique fighting style, utilizing dual-wielded swords and relying on his brute strength and agility. ",
        images: ["/assets/images/product5.jpg", "/assets/images/product5-2.jpg", "/assets/images/product5-3.jpg"],
        brand: "INOSUKE",
        stock: 60,
        price: 25,
      },
      {
        name: "Giyu Tomioka",
        description: "Recognized as the Water Hashira and known for his cold and stoic demeanor. He is skilled in the Water Breathing technique and wields a powerful Nichirin Blade in his fight against demons.",
        images: ["/assets/images/product6.jpg", "/assets/images/product6-2.jpg"],
        brand: "GIYU",
        stock: 10,
        price: 30,
      },
    ],
  });

  console.log("Database seeded successfully! 🌱");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());