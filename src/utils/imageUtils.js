/**
 * Transforme une URL Cloudinary pour optimiser la taille, le format et la qualité.
 * Paramètres Cloudinary :
 * - c_fill : Remplit le rectangle demandé en recadrant.
 * - w_600/h_400 : Dimensions fixes.
 * - f_auto : Choix automatique du format (WebP, etc.).
 * - q_auto : Compression automatique pour une qualité optimale.
 */
export const getOptimizedUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }
  
  return url.replace('/upload/', '/upload/c_fill,w_600,h_400,f_auto,q_auto/');
};