export interface ColoringImage {
  id: string;
  title: string;
  description: string;
  originalImageUrl: string;
  outlineImageUrl: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: Date;
  isAI: boolean;
}

export interface UserArtwork {
  id: string;
  coloringImageId: string;
  coloredImageUrl: string;
  title: string;
  description: string;
  colors: string[];
  createdAt: Date;
  isPublic: boolean;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  category: string;
}

export interface AIStory {
  id: string;
  artworkId: string;
  title: string;
  content: string;
  characters: string[];
  theme: string;
  createdAt: Date;
}

export interface UploadedImage {
  id: string;
  originalUrl: string;
  outlineUrl: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface ColoringSession {
  id: string;
  imageId: string;
  colors: { [areaId: string]: string };
  brushSize: number;
  currentTool: 'brush' | 'fill' | 'eraser';
  lastSaved: Date;
}

export interface User {
  id: string;
  name: string;
  age: number;
  parentEmail?: string;
  preferences: {
    favoriteColors: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    categories: string[];
  };
} 