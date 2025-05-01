// This is a fallback script that redirects to the correct entry point
// It helps in case the main script fails to load

(function() {
  console.log('Fallback script loaded');
  
  // Check if the app has loaded
  setTimeout(function() {
    const root = document.getElementById('root');
    const appLoaded = root && root.children.length > 1; // More than just the loading spinner
    
    if (!appLoaded) {
      console.log('App failed to load, redirecting to hash router');
      
      // Force hash router mode
      if (!window.location.hash && window.location.pathname !== '/') {
        window.location.href = '/#' + window.location.pathname;
      }
    }
  }, 5000); // Wait 5 seconds before checking
})();
