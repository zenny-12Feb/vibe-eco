import { customAlphabet } from "nanoid";

// Bo qua ky tu de nham lan (0/O, 1/I) de khach de doc / go lai ma don
const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export function generateOrderCode(): string {
  return `DH${nanoid()}`;
}
