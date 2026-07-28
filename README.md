# 🛍️ Vibe Eco — Website ban hang don gian, than thien voi tre em

Website thuong mai dien tu co ban voi **2 che do tren cung 1 site**:
- **Guest (khach)**: xem san pham, chon so luong, tinh tien, thanh toan bang **VietQR**, tra cuu trang thai don hang
- **Admin**: dang nhap rieng, quan ly san pham (CRUD), xem & cap nhat trang thai don hang

Giao dien don gian, mau sac tuoi vui, bo tron — huong toi trai nghiem than thien voi tre em.

---

## 🧱 Cong nghe su dung

| Thanh phan | Cong nghe |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Giao dien | TailwindCSS (theme mau sac tuy chinh) |
| Co so du lieu | PostgreSQL + Prisma ORM |
| Xac thuc Admin | Session cookie ky bang JWT (thu vien `jose`) + `bcryptjs` |
| Thanh toan | VietQR (sinh anh QR dong qua `img.vietqr.io`, khong can API key) |

---

## 🚀 Cai dat & Chay du an

### 1. Yeu cau
- Node.js **18+**
- PostgreSQL dang chay (local hoac Docker)

Neu chua co Postgres, co the chay nhanh bang Docker:
```bash
docker run --name vibe-eco-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vibe_eco -p 5432:5432 -d postgres:16
```

### 2. Cai dependencies
```bash
cd Vibe-eco
npm install
```

### 3. Cau hinh bien moi truong
```bash
cp .env.example .env
```
Mo file `.env` va chinh sua:
- `DATABASE_URL`: chuoi ket noi PostgreSQL cua ban
- `SESSION_SECRET`: doi thanh mot chuoi ngau nhien, bao mat
- `ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD`: tai khoan admin mac dinh (duoc tao khi seed)
- `VIETQR_BANK_ID`, `VIETQR_ACCOUNT_NO`, `VIETQR_ACCOUNT_NAME`: thong tin tai khoan ngan hang **nhan tien** cua ban

> 📌 Danh sach ma BIN ngan hang (VIETQR_BANK_ID) tham khao tai: https://www.vietqr.io/danh-sach-api

### 4. Khoi tao database
```bash
npm run prisma:migrate
npm run prisma:seed
```
Lenh seed se tao san 6 san pham mau va 1 tai khoan admin (theo `.env`).

### 5. Chay ung dung
```bash
npm run dev
```
Mo trinh duyet:
- Trang khach: http://localhost:3000
- Trang quan tri: http://localhost:3000/admin/login

---

## 📂 Cau truc thu muc chinh

```
src/
  app/
    page.tsx                  # Trang chu (danh sach san pham)
    product/[id]/page.tsx     # Chi tiet san pham
    cart/page.tsx             # Gio hang
    checkout/page.tsx         # Nhap thong tin & tao don
    order/[code]/page.tsx     # Trang thai don hang + QR thanh toan
    order/lookup/page.tsx     # Tra cuu don hang bang ma
    admin/
      login/page.tsx
      page.tsx                 # Dashboard
      products/page.tsx        # Quan ly san pham (CRUD)
      orders/page.tsx          # Quan ly don hang & cap nhat trang thai
    api/                       # Cac API route (products, orders, admin auth)
  components/                  # Cac component tai su dung (ProductCard, StatusBadge,...)
  lib/                         # prisma client, auth, vietqr, cart context, utils
  middleware.ts                # Bao ve cac trang /admin/*
prisma/
  schema.prisma                # Dinh nghia bang du lieu
  seed.ts                      # Du lieu mau
```

---

## 🔄 Luong trang thai don hang

```
Cho thanh toan -> Da thanh toan -> Dang chuan bi hang -> Dang giao hang -> Hoan thanh
                                                                 (hoac Da huy o bat ky buoc nao)
```

Admin cap nhat trang thai thu cong tai `/admin/orders` (vi la ban co ban, chua tich hop webhook xac nhan thanh toan tu ngan hang).

---

## 💡 Ghi chu & huong mo rong tiep theo

- **Xac nhan thanh toan tu dong**: hien tai VietQR chi sinh anh QR, admin can tu kiem tra bien dong so du va bam cap nhat trang thai "Da thanh toan". Neu muon tu dong, co the tich hop them Casso, SePay, hoac API ngan hang ho tro webhook.
- **Upload hinh anh san pham**: hien dang dung URL anh (dan link). Co the mo rong them upload file that (vd: dung Cloudinary, S3, hoac luu local).
- **Bao mat**: doi `SESSION_SECRET` va mat khau admin mac dinh truoc khi dua len production.
- **Nhieu tai khoan admin**: bang `Admin` da ho tro nhieu tai khoan — chi can insert them ban ghi (co the lam qua Prisma Studio: `npm run prisma:studio`).

Chuc ban ban hang that vui va thanh cong! 🎈
