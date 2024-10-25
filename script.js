document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll(".fade-in-section, .help-card");  // Include help cards

    const options = {
        threshold: 0.1  // Trigger when 10% of the section is in view
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.classList.remove("fade-out");  // Remove fade-out when entering
            } else {
                entry.target.classList.remove("visible");
                entry.target.classList.add("fade-out");  // Add fade-out when leaving
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
});
