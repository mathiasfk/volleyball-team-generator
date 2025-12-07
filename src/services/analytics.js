import i18n from '@/i18n.js'

// Initialize Google Analytics
const GA_MEASUREMENT_ID = 'G-VCDCC5PG64';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

window.gtag = function() {
  window.dataLayer.push(arguments);
}

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];

// Helper function to get current language
const getCurrentLanguage = () => {
  try {
    return i18n.language || 'en';
  } catch {
    // Fallback if i18n is not initialized yet
    return localStorage.getItem('i18nextLng') || 'en';
  }
};

// Analytics wrapper function
export const gtag = (...args) => {
  // Check if this is an event call (first arg is 'event')
  if (args[0] === 'event' && args[1] && typeof args[1] === 'string' && args[2] && typeof args[2] === 'object') {
    // Add current language to event parameters
    const eventParams = { ...args[2] };
    eventParams.language = getCurrentLanguage();
    args[2] = eventParams;
  }
  
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