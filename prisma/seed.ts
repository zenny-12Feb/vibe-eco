import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Gấu Bông Siêu Mềm",
    description: "Chú gấu bông lông mềm mại, bạn đồng hành đáng yêu cho bé.",
    price: 149000,
    imageUrl: "https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=600",
    category: "Đồ chơi",
    stock: 40,
  },
  {
    name: "Bộ Xếp Hình Khủng Long",
    description: "Bộ lego 120 mảnh lắp hình khủng long ba đầu đầy màu sắc.",
    price: 259000,
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600",
    category: "Đồ chơi",
    stock: 30,
  },
  {
    name: "Bóng Đá Mini Ngôi Sao",
    description: "Quả bóng nhựa dẻo, size nhỏ gọn cho bé chơi trong nhà.",
    price: 89000,
    imageUrl: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600",
    category: "Thể thao",
    stock: 60,
  },
  {
    name: "Bộ Bút Chì Màu 24 Cây",
    description: "Bút chì màu sáp không độc hại, 24 màu sắc rực rỡ.",
    price: 65000,
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
    category: "Học tập",
    stock: 100,
  },
  {
    name: "Balo Hình Khủng Long Cute",
    description: "Balo đi học chống thấm nước, hoạ tiết khủng long ngộ nghĩnh.",
    price: 189000,
    imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc935?w=600",
    category: "Thời trang",
    stock: 25,
  },
  {
    name: "Xe Đua Điều Khiển Từ Xa",
    description: "Xe đồ chơi điều khiển từ xa tốc độ cao, pin sạc tiện lợi.",
    price: 349000,
    imageUrl: "https://images.unsplash.com/photo-1594787317612-e5b0a5f6e5f5?w=600",
    category: "Đồ chơi",
    stock: 15,
  },
];

async function main() {
  console.log("Seeding database...");

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({ data: products });
    console.log(`Đã thêm ${products.length} sản phẩm mẫu.`);
  } else {
    console.log("Đã có sản phẩm trong DB, bỏ qua seed sản phẩm.");
  }

  const username = process.env.ADMIN_DEFAULT_USERNAME || "admin";
  const password = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
  const existingAdmin = await prisma.admin.findUnique({ where: { username } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { username, passwordHash } });
    console.log(`Đã tạo tài khoản admin: ${username} / ${password}`);
  } else {
    console.log("Tài khoản admin đã tồn tại, bỏ qua.");
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
