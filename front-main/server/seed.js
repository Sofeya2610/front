const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = [
    {
      question: "У якому році було проголошено незалежність України?",
      options: JSON.stringify(["1989", "1990", "1991", "1996"]),
      correctAnswer: "1991"
    },
    {
      question: "Хто був першим президентом України?",
      options: JSON.stringify(["Кравчук", "Кучма", "Ющенко", "Порошенко"]),
      correctAnswer: "Кравчук"
    },
    {
      question: "Коли була прийнята Конституція України?",
      options: JSON.stringify(["1991", "1994", "1996", "2004"]),
      correctAnswer: "1996"
    }
  ];

  for (const q of questions) {
    await prisma.item.create({ data: q });
  }
  console.log("База заповнена тестами!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());