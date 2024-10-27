document.addEventListener("DOMContentLoaded", function() {
    // Typing effect for "About Me" section
    const typingTextElement = document.getElementById("typing-text");
    const aboutText = "My skill set includes HTML, CSS, Bootstrap, JavaScript, and Dart, enabling me to bring creative designs to life. I am excited to contribute to innovative projects in web and mobile development and look forward to growing and learning in a dynamic team environment.";
    let typingIndex = 0;
    let isTyping = true;

    function typeAndBackspace() {
        if (isTyping) {
            // Typing phase
            if (typingIndex < aboutText.length) {
                typingTextElement.textContent += aboutText.charAt(typingIndex);
                typingIndex++;
                setTimeout(typeAndBackspace, 20); // Speed of typing (adjust as needed)
            } else {
                // Hold for 5 seconds after finishing typing
                isTyping = false;
                setTimeout(typeAndBackspace, 5000); // Delay before backspacing starts
            }
        } else {
            // Backspacing phase
            if (typingIndex > 0) {
                typingTextElement.textContent = aboutText.substring(0, typingIndex - 1);
                typingIndex--;
                setTimeout(typeAndBackspace, 20); // Speed of backspacing (adjust as needed)
            } else {
                // Switch back to typing after backspacing is complete
                isTyping = true;
                setTimeout(typeAndBackspace, 1000); // Small delay before retyping starts
            }
        }
    }

    // Start the typing effect
    typeAndBackspace();

    // Fade-in and fade-out animations for all sections and help cards
    const sections = document.querySelectorAll(".fade-in-section, .help-card");

    const observerOptions = {
        threshold: 0.1 // Trigger animation when 10% of the element is in view
    };

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
    }, observerOptions);

    // Observe each section for fade-in/out effect
    sections.forEach(section => sectionObserver.observe(section));
});
