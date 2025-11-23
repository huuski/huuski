export enum ProductCategory {
  Cosmetic = 0,
  Medication = 1,
  Supplement = 2,
  Equipment = 3,
  Other = 4,
}

export const ProductCategoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.Cosmetic]: "Cosmético",
  [ProductCategory.Medication]: "Medicamento",
  [ProductCategory.Supplement]: "Suplemento",
  [ProductCategory.Equipment]: "Equipamento",
  [ProductCategory.Other]: "Outro",
};

export function getProductCategoryLabel(category: number | string | undefined): string {
  if (category === undefined || category === null || category === "") {
    return "Não definido";
  }
  
  const categoryNum = typeof category === "string" ? parseInt(category, 10) : category;
  
  if (isNaN(categoryNum)) {
    return "Não definido";
  }
  
  return ProductCategoryLabels[categoryNum as ProductCategory] || "Outro";
}

export function getProductCategoryValue(category: string | number | undefined): ProductCategory {
  if (category === undefined || category === null || category === "") {
    return ProductCategory.Other;
  }
  
  const categoryNum = typeof category === "string" ? parseInt(category, 10) : category;
  
  if (isNaN(categoryNum)) {
    return ProductCategory.Other;
  }
  
  return categoryNum as ProductCategory;
}

