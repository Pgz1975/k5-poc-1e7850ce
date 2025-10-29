export interface CategoryAnalytic {
  category: string;
  categoryEn: string;
  completed: number;
  colorClass: string;
}

export const mockCategoryAnalytics: CategoryAnalytic[] = [
  { 
    category: "Ciencia", 
    categoryEn: "Science", 
    completed: 18, 
    colorClass: "hsl(125, 100%, 55%)" 
  },
  { 
    category: "Ficción", 
    categoryEn: "Fiction", 
    completed: 25, 
    colorClass: "hsl(329, 100%, 65%)" 
  },
  { 
    category: "Historia", 
    categoryEn: "History", 
    completed: 15, 
    colorClass: "hsl(190, 100%, 65%)" 
  },
  { 
    category: "Matemáticas", 
    categoryEn: "Math", 
    completed: 8, 
    colorClass: "hsl(11, 100%, 65%)" 
  },
  { 
    category: "Cultura PR", 
    categoryEn: "PR Culture", 
    completed: 12, 
    colorClass: "hsl(270, 100%, 65%)" 
  }
];
