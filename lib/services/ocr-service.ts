"use client";

class OcrService {
  async extractText(image: File): Promise<string> {
    // In a real implementation, this would call a Python backend with Tesseract or a cloud OCR API
    // For demo purposes, we'll simulate OCR processing
    
    return new Promise((resolve, reject) => {
      // Simulate processing delay
      setTimeout(() => {
        // Check if it's a valid image
        if (!image.type.startsWith('image/')) {
          reject(new Error('The provided file is not an image'));
          return;
        }
        
        // Mock OCR response
        const mockText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. 
Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.`;
        
        resolve(mockText);
      }, 1500);
    });
  }
}

export const ocrService = new OcrService();