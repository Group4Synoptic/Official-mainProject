// Form validation and submission handling
document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const firstName = document.querySelector("input[name='first-name']").value;
    const lastName = document.querySelector("input[name='last-name']").value;
    const email = document.querySelector("input[name='email']").value;
    const message = document.querySelector("textarea[name='message']").value;
    const contactReason = document.querySelector("select[name='contact-reason']").value;

    // Basic form validation
    if (!firstName || !lastName || !email || !message || !contactReason) {
        alert("Please fill in all required fields.");
        return;
    }

    // Construct data object to send in POST request
    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        message: message,
        contactReason: contactReason,
        timestamp: new Date().toISOString()  // Add the submission time
    };

 // Send form data to server (GET NEDAS TO HELP WITH THIS)
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle server response
        if (data.success) {
            // Show confirmation message
            document.getElementById('signup-section').innerHTML = `
                <h2>Thank you for contacting us, ${firstName}!</h2>
                <p>Your message has been received and we'll get back to you within 48 hours.</p>
            `;
        } else {
            alert('Sorry, something went wrong. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Sorry, an error occurred while submitting the request.');
    });
});

// Fetch and load the Map and location content dynamically
document.addEventListener("DOMContentLoaded", function () {
    const infoSection = document.querySelector(".info-section");

    fetch("json/info.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load info.json");
            }
            return response.json();
        })
        .then(data => {
            // Populate the info-section with JSON data
            infoSection.innerHTML = `
                <h2>${data.title}</h2>
                <p>${data.description}</p>
                <section id="map-container">
                    <iframe class="iframe" src="${data.mapIframe}" 
                            title="Google Maps" width="100%" height="300" allowfullscreen="yes" loading="lazy">
                    </iframe>
                    <p>${data.address}</p>
                </section>
            `;
        })
        .catch(error => {
            console.error("Error loading info-section:", error);
            infoSection.innerHTML = `<p>Unable to load location information at this time. Please try again later.</p>`;
        });
});
