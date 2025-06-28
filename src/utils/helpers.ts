// Utility functions for AI Coloring Books

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file!' };
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File is too large! Please select an image smaller than 10MB.' };
  }

  return { valid: true };
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return '#4CAF50';
    case 'medium':
      return '#FF9800';
    case 'hard':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'animals':
      return '🐾';
    case 'fantasy':
      return '🐉';
    case 'nature':
      return '🌸';
    case 'vehicles':
      return '🚗';
    case 'food':
      return '🍕';
    default:
      return '🎨';
  }
};

export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const getRandomColor = (): string => {
  const colors = [
    '#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
    '#A8E6CF', '#DCEDC8', '#FFD3B6', '#FFAAA5', '#FF8B94',
    '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FF9800',
    '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getAgeAppropriateMessage = (age: number): string => {
  if (age < 6) {
    return "Great job, little artist! 🌟";
  } else if (age < 10) {
    return "Amazing work, creative friend! 🎨";
  } else {
    return "Fantastic artwork! Keep creating! ✨";
  }
}; 