export enum ServiceCategory {
  Medical = 0,
  Aesthetical = 1,
  Wellness = 2,
  Other = 3,
}

export const ServiceCategoryLabels: Record<ServiceCategory, string> = {
  [ServiceCategory.Medical]: "Médico",
  [ServiceCategory.Aesthetical]: "Estético",
  [ServiceCategory.Wellness]: "Bem-estar",
  [ServiceCategory.Other]: "Outro",
};

export function getServiceCategoryLabel(category: number | string | undefined): string {
  if (category === undefined || category === null || category === "") {
    return "Não definido";
  }
  
  const categoryNum = typeof category === "string" ? parseInt(category, 10) : category;
  
  if (isNaN(categoryNum)) {
    return "Não definido";
  }
  
  return ServiceCategoryLabels[categoryNum as ServiceCategory] || "Outro";
}

export function getServiceCategoryValue(category: string | number | undefined): ServiceCategory {
  if (category === undefined || category === null || category === "") {
    return ServiceCategory.Other;
  }
  
  const categoryNum = typeof category === "string" ? parseInt(category, 10) : category;
  
  if (isNaN(categoryNum)) {
    return ServiceCategory.Other;
  }
  
  return categoryNum as ServiceCategory;
}

