// Initialize Google Analytics
const GA_MEASUREMENT_ID = 'G-VCDCC5PG64';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];

// Analytics wrapper function
export const gtag = (...args) => {
  if (isLocalhost) {
    console.log('📊 Analytics (debug):', ...args);
    return;
  }
  window.dataLayer.push(...args);
};

// Initialize analytics only in production
if (!isLocalhost) {
  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize GA
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}