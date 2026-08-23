
export const getOptimizedUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }
  
  return url.replace('/upload/', '/upload/c_fill,w_600,h_400,f_auto,q_auto/');
};