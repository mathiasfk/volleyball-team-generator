// Initialize Google Analytics
const GA_MEASUREMENT_ID = 'G-VCDCC5PG64';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

window.gtag = function() {
  window.dataLayer.push(arguments);
}

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];

// Analytics wrapper function
export const gtag = (...args) => {
  if (isLocalhost) {
    console.log('[debug]:', ...args);
  }
  
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
  } else {
    console.warn('Google Analytics not loaded yet');
    window.dataLayer.push(...args);
  }
};


// Load GA script
const script = document.createElement('script');
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
script.async = true;

// Add onload handler to ensure GA is ready
script.onload = () => {
  // Initialize GA
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { 'debug_mode': isLocalhost });
};

document.head.appendChild(script);