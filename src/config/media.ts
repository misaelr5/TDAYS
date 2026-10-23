export type TravelPhoto = {
  src: string;
  alt: string;
};

// TODO: register locally supplied photographs only after publication approval.
// Key convention: destination:brasil, destination:caribe, etc.
// Illustrations remain the fallback; they are never described as destination photos.
export const approvedPhotos: Partial<Record<string, TravelPhoto>> = {};
