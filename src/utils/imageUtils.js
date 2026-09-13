export const getOptimizedUrl = (url, w = 1200, h = null) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  // 🎬 GIF animé : on ne touche à RIEN (crop/transfo = animation cassée)
  if (url.includes('.gif')) {
    return url;
  }

  const transform = h
    ? `/upload/c_fill,w_${w},h_${h},f_auto,q_auto/`   // recadré (mêmes proportions)
    : `/upload/w_${w},f_auto,q_auto/`;                // redimensionné (garde le ratio)

  return url.replace('/upload/', transform);
};