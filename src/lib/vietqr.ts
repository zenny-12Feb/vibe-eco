/**
 * Sinh URL anh QR VietQR (dich vu mien phi cua vietqr.io) de khach
 * chuyen khoan ngan hang dung so tien va noi dung don hang.
 * Doc them: https://www.vietqr.io/
 */
export function buildVietQrUrl(params: {
  amount: number;
  orderCode: string;
}): string {
  const bankId = process.env.VIETQR_BANK_ID || "970436";
  const accountNo = process.env.VIETQR_ACCOUNT_NO || "0000000000";
  const accountName = process.env.VIETQR_ACCOUNT_NAME || "BOP";
  const template = process.env.VIETQR_TEMPLATE || "compact2";

  const addInfo = encodeURIComponent(`Thanh toan don ${params.orderCode}`);
  const encodedName = encodeURIComponent(accountName);

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${params.amount}&addInfo=${addInfo}&accountName=${encodedName}`;
}

export function getBankAccountInfo() {
  return {
    bankId: process.env.VIETQR_BANK_ID || "970436",
    accountNo: process.env.VIETQR_ACCOUNT_NO || "0000000000",
    accountName: process.env.VIETQR_ACCOUNT_NAME || "BOP",
  };
}
