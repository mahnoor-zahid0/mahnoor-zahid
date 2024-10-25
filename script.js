// JavaScript to handle fade-in animation and responsive navbar

document.addEventListener("DOMContentLoaded", function() {
    // Handle fade-in effect for sections
    const sections = document.querySelectorAll(".fade-in-section");

    const options = {
        threshold: 0.1 // When 10% of the section is visible
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible"); // Fade-out effect when scrolling away
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle responsive mobile navbar toggle
    const drawerToggle = document.querySelector(".drawer-toggle");
    const drawerNav = document.querySelector(".drawer-nav");

    // Toggle the drawer visibility when the drawer toggle (hamburger icon) is clicked
    drawerToggle.addEventListener("click", function() {
        drawerNav.classList.toggle("open");
    });

    // Optional: Close the drawer when a link inside it is clicked (for usability)
    const drawerLinks = document.querySelectorAll(".drawer-nav ul li a");
    drawerLinks.forEach(link => {
        link.addEventListener("click", function() {
            drawerNav.classList.remove("open");
        });
    });
});