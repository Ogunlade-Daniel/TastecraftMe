// Slider Section 
  window.addEventListener("scroll", function(){
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled")
  }
  });
// End Slider Section


// for loader
  const loader = document.querySelector('.spinner-overlay');

  // Hide loader after 3 seconds
  setTimeout(() => {
    loader.classList.add('remove');
  }, 1000);

  loader.addEventListener('transitioned', function(){
    loader.classList.remove('spinner-overlay')
  });