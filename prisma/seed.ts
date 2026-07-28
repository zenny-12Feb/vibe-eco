import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Gau Bong Sieu Mem",
    description: "Chu gau bong long mem mai, ban dong hanh dang yeu cho be.",
    price: 149000,
    imageUrl: "https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=600",
    category: "Do choi",
    stock: 40,
  },
  {
    name: "Bo Xep Hinh Khung Long",
    description: "Bo lego 120 manh lap hinh khung long ba dau day mau sac.",
    price: 259000,
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600",
    category: "Do choi",
    stock: 30,
  },
  {
    name: "Bong Da Mini Ngoi Sao",
    description: "Qua bong nhua deo, size nho gon cho be choi trong nha.",
    price: 89000,
    imageUrl: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600",
    category: "The thao",
    stock: 60,
  },
  {
    name: "Bo But Chi Mau 24 Cay",
    description: "But chi mau sap khong doc hai, 24 mau sac ruc ro.",
    price: 65000,
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
    category: "Hoc tap",
    stock: 100,
  },
  {
    name: "Balo Hinh Khung Long Cute",
    description: "Balo di hoc chong tham nuoc, hoa tiet khung long ngo nghinh.",
    price: 189000,
    imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc935?w=600",
    category: "Thoi trang",
    stock: 25,
  },
  {
    name: "Xe Dua Dieu Khien Tu Xa",
    description: "Xe do choi dieu khien tu xa toc do cao, pin sac tien loi.",
    price: 349000,
    imageUrl: "https://images.unsplash.com/photo-1594787317612-e5b0a5f6e5f5?w=600",
    category: "Do choi",
    stock: 15,
  },
];

async function main() {
  console.log("Seeding database...");

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({ data: products });
    console.log(`Da them ${products.length} san pham mau.`);
  } else {
    console.log("Da co san pham trong DB, bo qua seed san pham.");
  }

  const username = process.env.ADMIN_DEFAULT_USERNAME || "admin";
  const password = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
  const existingAdmin = await prisma.admin.findUnique({ where: { username } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { username, passwordHash } });
    console.log(`Da tao tai khoan admin: ${username} / ${password}`);
  } else {
    console.log("Tai khoan admin da ton tai, bo qua.");
  }

  console.log("Seed xong!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
