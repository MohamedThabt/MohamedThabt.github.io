// Visitor Counter using GitHub as backend storage
(function() {
  const REPO = 'MohamedThabt/MohamedThabt.github.io';
  const COUNTER_KEY = 'visitor_count';
  
  // Function to get visitor count from localStorage
  function getVisitorCount() {
    const stored = localStorage.getItem(COUNTER_KEY);
    return stored ? parseInt(stored) : 0;
  }
  
  // Function to increment and save visitor count
  function incrementVisitorCount() {
    const current = getVisitorCount();
    const newCount = current + 1;
    localStorage.setItem(COUNTER_KEY, newCount);
    return newCount;
  }
  
  // Function to display visitor counter
  function displayVisitorCounter() {
    const count = incrementVisitorCount();
    
    // Find the element with id 'visitor-counter' or create one
    let counterElement = document.getElementById('visitor-counter');
    
    if (counterElement) {
      counterElement.textContent = count;
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayVisitorCounter);
  } else {
    displayVisitorCounter();
  }
})();
