// Ham tinh gia von / gia ban / loi nhuan cho cong cu "Dinh gia nguon hang"

export function costPerUnitFromPackage(packageCost: number, quantity: number): number {
  if (!quantity || quantity <= 0) return 0;
  return packageCost / quantity;
}

export function sellPriceFromMargin(cost: number, marginPercent: number): number {
  return cost * (1 + marginPercent / 100);
}

export function profitPerUnit(cost: number, sellPrice: number): number {
  return sellPrice - cost;
}
