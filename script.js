document.addEventListener("DOMContentLoaded", function () {
    // Typing effect for "About Me" section
    const typingTextElement = document.getElementById("typing-text");
    const aboutText = "My skill set includes HTML, CSS, Bootstrap, JavaScript, and Dart, enabling me to bring creative designs to life. I am excited to contribute to innovative projects in web and mobile development and look forward to growing and learning in a dynamic team environment.";
    let typingIndex = 0;
    let isTyping = true;
    let isPaused = false;

    function typeCharacter() {
        if (isPaused) return;

        if (typingIndex < aboutText.length) {
            // Typing phase
            typingTextElement.textContent += aboutText.charAt(typingIndex);
            typingIndex++;
            setTimeout(typeCharacter, 20); // Typing speed (adjust as needed)
        } else {
            // Hold for 5 seconds after finishing typing
            setTimeout(() => {
                typingTextElement.textContent = ""; // Clear text after holding
                typingIndex = 0; // Reset typing index for retyping
                isPaused = true;
            }, 5000); // Delay before retyping starts
        }
    }

    // Observer to trigger typing effect when the section is in view
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the element is in view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isPaused = false; // Resume typing effect when in view
                typeCharacter();
            } else {
                isPaused = true; // Pause typing effect when out of view
            }
        });
    }, observerOptions);

    // Observe the typing text element
    observer.observe(typingTextElement);

    // Fade-in and fade-out animations for all sections and help cards
    const sections = document.querySelectorAll(".fade-in-section, .help-card");
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.classList.remove("fade-out");
            } else {
                entry.target.classList.remove("visible");
                entry.target.classList.add("fade-out");
            }
        });
    }, { threshold: 0.1 });

    // Observe each section for fade-in/out effect
    sections.forEach(section => sectionObserver.observe(section));
});
