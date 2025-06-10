// This script runs after the HTML page has fully loaded.
// It handles loading dynamic content, animations, and interactive features.

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JavaScript is running and DOM is loaded.");

  // --- FADE-IN ANIMATION HELPER FUNCTION ---
  // This function makes elements with the .fade-in class smoothly appear as you scroll.
  // It uses IntersectionObserver, which "watches" elements and tells us when they enter the visible part of the screen.
  // When an element is visible, we add the .visible class, which triggers a CSS animation.
  // We call this function after adding new content, so those elements will animate in too.
  function observeFadeInElements() {
    // Find all elements with .fade-in that don't already have .visible.
    const faders = document.querySelectorAll('.fade-in:not(.visible)');
    // Set up the observer to trigger when 10% of the element is visible.
    const options = { threshold: 0.10 };

    // Create the observer, which will check each element as we scroll.
    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
      entries.forEach(entry => {
        // If the element isn't visible yet, do nothing.
        if (!entry.isIntersecting) return;
        // If it is visible, add the .visible class to start the animation.
        entry.target.classList.add('visible');
        // Stop watching this element since it's already animated in.
        observer.unobserve(entry.target);
      });
    }, options);

    // Tell the observer to watch each .fade-in element we found.
    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  }

  // --- GOALS SECTION LOGIC (for goals.html) ---
  // This part loads the Sustainable Development Goal cards from app.json
  // and puts them into the correct columns on the goals page.

  // Try to find the containers for each goal card by their IDs.
  // These containers are where we want to put each goal card on the page.
  const climateContainer = document.getElementById('goal-climate');
  const energyContainer = document.getElementById('goal-energy');
  const hungerContainer = document.getElementById('goal-hunger');

  // Only run this code if all three containers exist (so it doesn't run on other pages).
  if (climateContainer && energyContainer && hungerContainer) {
    // Fetch the data from our app.json file.
    // This file contains all the information about our goals.
    fetch('json/app.json')
      .then(response => response.json())
      .then(data => {
        // Get the array of goals from the data.
        const goals = data.goals;

        // This function will create a goal card for us.
        // It takes a goal object and an id (for anchor links).
        function createGoalCard(goal, id) {
          // Create an <article> element to be the card.
          const article = document.createElement('article');
          // Add classes for styling and animation.
          article.classList.add('Goal_images', 'goal-card', 'fade-in');
          // Set the id so we can link to this card from the menu.
          article.id = id;

          // Now we build the inside of the card.
          // Create a <figure> to hold the image and caption.
          const figure = document.createElement('figure');

          // Create the image for the goal.
          const img = document.createElement('img');
          img.src = goal.url;      // Set the image source.
          img.alt = goal.alt;      // Set the alt text for accessibility.
          img.classList.add('goal-image');

          // Create a caption for the image.
          const figcaption = document.createElement('figcaption');
          figcaption.classList.add('goal-caption');

          // Create a link inside the caption.
          const link = document.createElement('a');
          link.href = goal.link;           // Where the link goes.
          link.textContent = goal.caption; // The text for the link.
          link.classList.add('goal-link');

          // Put the link inside the caption.
          figcaption.appendChild(link);
          // Put the image and caption inside the figure.
          figure.appendChild(img);
          figure.appendChild(figcaption);
          // Put the figure inside the article (the card).
          article.appendChild(figure);

          // Return the finished card.
          return article;
        }

        // Now we add each goal card to the correct container.
        // The order in app.json should match: [0]=Climate, [1]=Energy, [2]=Hunger.
        if (goals[0]) climateContainer.appendChild(createGoalCard(goals[0], 'goal-climate'));
        if (goals[1]) energyContainer.appendChild(createGoalCard(goals[1], 'goal-energy'));
        if (goals[2]) hungerContainer.appendChild(createGoalCard(goals[2], 'goal-hunger'));

        // After we've added the cards, we call our fade-in function.
        // This makes sure the new cards will animate in as you scroll.
        observeFadeInElements();
      })
      .catch(error => console.error("Goals loading failed:", error));
  }

  // --- CLIMATE SECTION LOGIC (for climate.html) ---
  // This part loads climate data from app.json and creates a card for each item.
  // It only runs if the page contains an element with id="ClimateSection".
  const climateSection = document.querySelector('#ClimateSection');
  if (climateSection) {
    // Fetch the climate data from app.json.
    fetch('json/app.json')
      .then(res => res.json())
      .then(data => {
        // For each climate item, create a card and add it to the page.
        data.climate.forEach(item => {
          // Create a section for each climate item.
          const article = document.createElement('section');
          article.classList.add('Individual_Containers', 'fade-in');

          // Create a figure to hold the image and caption.
          const figure = document.createElement('figure');
          figure.classList.add('Individual_Figures');

          // Create the image.
          const img = document.createElement('img');
          img.src = item.url;
          img.alt = item.alt;
          img.classList.add('Individual_Images');

          // Create the caption, which can have multiple lines.
          const figcaption = document.createElement('figcaption');
          item.caption.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            figcaption.appendChild(p);
          });

          // Put everything together.
          figure.appendChild(img);
          figure.appendChild(figcaption);
          article.appendChild(figure);
          climateSection.appendChild(article);
        });

        // After adding the cards, call the fade-in function.
        observeFadeInElements();
      })
      .catch(err => console.error('Climate section error:', err));
  }

  // --- WATER DEMANDS SECTION LOGIC (for WD.html) ---
  // This part loads water demand data from app.json and creates a card for each item.
  // It only runs if the page contains an element with id="WDSection".
  const wdSection = document.querySelector('#WDSection');
  if (wdSection) {
    // Fetch the water demand data from app.json.
    fetch('json/app.json')
      .then(res => res.json())
      .then(data => {
        // For each water demand item, create a card and add it to the page.
        data.WDSection.forEach(item => {
          // Create a section for each water demand item.
          const section = document.createElement('section');
          section.classList.add('Individual_Containers', 'fade-in');

          // Create a figure to hold the image and caption.
          const figure = document.createElement('figure');
          figure.classList.add('Individual_Figures');

          // Create the image.
          const img = document.createElement('img');
          img.src = item.url;
          img.alt = item.alt;
          img.classList.add('Individual_Images');

          // Create the caption, which can have multiple lines.
          const figcaption = document.createElement('figcaption');
          item.caption.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            figcaption.appendChild(p);
          });

          // Put everything together.
          figure.appendChild(img);
          figure.appendChild(figcaption);
          section.appendChild(figure);
          wdSection.appendChild(section);
        });

        // After adding the cards, call the fade-in function.
        observeFadeInElements();
      })
      .catch(err => console.error('Water Demands loading error:', err));
  }

  // --- TEAM PAGE LOGIC (for about.html) ---
  // This part loads team member data from app.json and creates a card for each member.
  // Clicking a card opens a popup with more info.
  // It only runs if the page contains a .team-section and popup elements.
  const popup = document.getElementById("popup");
  const popupImage = document.getElementById("popup-image");
  const popupName = document.getElementById("popup-name");
  const popupBio = document.getElementById("popup-bio");
  const closePopup = document.getElementById("close-popup");

  const teamSection = document.querySelector(".team-section");
  if (teamSection && popup) {
    // Fetch the team data from app.json.
    fetch("json/app.json")
      .then(res => res.json())
      .then(data => {
        // Remove any default HTML inside the team section.
        teamSection.innerHTML = "";

        // For each team member, create a card and add it to the page.
        data.team.forEach(member => {
          // Create a card for each team member.
          const card = document.createElement("div");
          card.classList.add("team-member", "fade-in");

          // Add the member's image.
          const img = document.createElement("img");
          img.src = member.image;
          img.alt = member.name;
          img.classList.add("team-image");

          // Add the member's name.
          const name = document.createElement("p");
          name.textContent = member.name;

          card.appendChild(img);
          card.appendChild(name);

          // When you click a card, show the popup with details.
          card.addEventListener("click", () => {
            popupImage.src = member.image;
            popupName.textContent = member.name;
            popupBio.innerHTML = `<strong>${member.role}</strong><br><br>${member.bio}`;
            popup.style.display = "flex";
          });

          teamSection.appendChild(card);
        });

        // After adding the cards, call the fade-in function.
        observeFadeInElements();
      })
      .catch(err => console.error("Team load error:", err));

    // When you click the close button or the background, close the popup.
    closePopup?.addEventListener("click", () => popup.style.display = "none");
    popup?.addEventListener("click", (e) => {
      if (e.target === popup) popup.style.display = "none";
    });
  }

  // --- HAMBURGER MENU (Mobile Nav Toggle) ---
  // This code makes the hamburger icon open/close the fullscreen overlay menu.
  // When you click the hamburger, it toggles the .open class on the icon
  // and the .active class on the .menu-overlay (which covers the whole page).

// ...existing code...

const hamburger = document.getElementById("hamburger");
const menuOverlay = document.querySelector(".menu-overlay");
const closeMenuBtn = document.getElementById("close-menu");

hamburger?.addEventListener("click", () => {
  hamburger.classList.add("open");
  menuOverlay.classList.add("active");
  closeMenuBtn.classList.add("open");
});
closeMenuBtn?.addEventListener("click", () => {
  hamburger.classList.remove("open");
  menuOverlay.classList.remove("active");
  closeMenuBtn.classList.remove("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOverlay.classList.contains("active")) {
    hamburger.classList.remove("open");
    menuOverlay.classList.remove("active");
    closeMenuBtn.classList.remove("open");
  }
});


// --- ACCESSIBILITY: DARK MODE & FONT SIZE TOGGLE ---
// Get the dark mode toggle switch
const darkSwitch = document.getElementById("toggle-dark");

// Helper: Apply dark mode class to body and update the toggle switch
function setDarkMode(enabled) {
  document.body.classList.toggle("dark-mode", enabled);
  if (darkSwitch) darkSwitch.checked = enabled;
}

// On page load, check if the user has a saved dark mode preference
const darkPref = localStorage.getItem("darkMode");
if (darkPref === "enabled") {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

// When the user toggles dark mode, update the setting and save it
darkSwitch?.addEventListener("change", () => {
  const enabled = darkSwitch.checked;
  setDarkMode(enabled);
  // Save the user's preference in localStorage
  localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
});

// Font size controls
const increaseFontBtn = document.getElementById("increase-font"); // Button to increase font size
const decreaseFontBtn = document.getElementById("decrease-font"); // Button to decrease font size
let fontSizeLevel = 0; // 0=normal, 1=large, 2=xlarge

// Helper: Apply font size class
function updateFontSize() {
  document.body.classList.remove("font-large", "font-xlarge"); // Remove any existing font size classes
  if (fontSizeLevel === 1) document.body.classList.add("font-large"); // Add large font size class
  if (fontSizeLevel === 2) document.body.classList.add("font-xlarge"); // Add extra large font size class
  // Save the user's font size preference
  localStorage.setItem("fontSizeLevel", fontSizeLevel); // Save the current font size level to localStorage
}

// Helper: Apply font size class to body and all content (including dynamic)
function updateFontSize() {
  document.body.classList.remove("font-large", "font-xlarge");
  if (fontSizeLevel === 1) document.body.classList.add("font-large");
  if (fontSizeLevel === 2) document.body.classList.add("font-xlarge");
  // Save the user's font size preference
  localStorage.setItem("fontSizeLevel", fontSizeLevel);
}

// On page load, check for saved font size
const savedFontSize = localStorage.getItem("fontSizeLevel"); // Get the saved font size level from localStorage
// If there's a saved font size, apply it
// If the user has a saved font size preference, apply it
// If the saved font size is not null, parse it and set the fontSizeLevel
if (savedFontSize !== null) {
  fontSizeLevel = parseInt(savedFontSize, 10);
  updateFontSize();
}


// Font size controls
increaseFontBtn?.addEventListener("click", () => { // Button to increase font size
  if (fontSizeLevel < 2) fontSizeLevel++; // Increase font size level, max is 2 (xlarge)
  updateFontSize();
});
decreaseFontBtn?.addEventListener("click", () => { // Button to decrease font size
  if (fontSizeLevel > 0) fontSizeLevel--; // Decrease font size level, min is 0 (normal)
  updateFontSize();
});

// localStorage is a built-in browser feature that lets you save small pieces of data 
// that persist even after the user closes the browser or reloads the page.
// It's useful for saving user preferences or settings that should remain across sessions.
// In this case, we use it to save the user's dark mode preference and font size level.
// This way, when the user comes back to the site, their preferences are remembered.
// The script uses localStorage to save user preferences for dark mode and font size.
// This allows the user to customize their experience, and these settings persist across page loads.
// The dark mode toggle switch allows users to switch between light and dark themes.
// The font size controls let users increase or decrease the text size
// When the page loads, the script checks if the user has a saved preference for dark mode or font size.
// If the user has a saved dark mode preference, it applies that setting to the page.
// If the user has a saved font size preference, it applies that too.
// The user can toggle dark mode using a switch, and the script saves that preference



  // --- SEARCH BUTTON (For Desktop search) ---
// --- SITE-WIDE SEARCH FUNCTIONALITY ---

const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

// Create a popup for search results
let searchPopup = document.getElementById('search-popup');
if (!searchPopup) {
  searchPopup = document.createElement('div');
  searchPopup.id = 'search-popup';
  searchPopup.style.position = 'fixed';
  searchPopup.style.top = '60px';
  searchPopup.style.left = '50%';
  searchPopup.style.transform = 'translateX(-50%)';
  searchPopup.style.background = '#fff';
  searchPopup.style.border = '2px solid #003087';
  searchPopup.style.borderRadius = '10px';
  searchPopup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
  searchPopup.style.zIndex = '9999';
  searchPopup.style.maxWidth = '90vw';
  searchPopup.style.minWidth = '320px';
  searchPopup.style.display = 'none';
  searchPopup.style.padding = '1.5rem 2rem';
  document.body.appendChild(searchPopup);
}

// Helper to close popup
function closeSearchPopup() {
  searchPopup.style.display = 'none';
  searchPopup.innerHTML = '';
}
searchPopup.addEventListener('click', (e) => {
  if (e.target === searchPopup) closeSearchPopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearchPopup();
});

// Main search function
const searchWebsite = () => {
  const query = searchBar?.value?.trim().toLowerCase();
  closeSearchPopup();
  if (!query) return;

  // Fetch the search index
  fetch('json/search-index.json')
    .then(res => res.json())
    .then(pages => {
      // Find matches in title or content
      const results = pages.filter(page =>
        page.title.toLowerCase().includes(query) ||
        page.content.toLowerCase().includes(query)
      );

      // Build popup content
      let html = `<h2 style="color:#003087;font-family:Michroma,sans-serif;font-size:1.3rem;margin-bottom:1rem;">Search Results</h2>`;
      if (results.length > 0) {
        html += `<ul style="list-style:none;padding:0;">`;
        results.forEach(page => {
          // Highlight the search term in title/content
          const re = new RegExp(`(${query})`, 'gi');
          const title = page.title.replace(re, '<mark>$1</mark>');
          const snippet = page.content.length > 120 ? page.content.slice(0,120) + '...' : page.content;
          const snippetHighlighted = snippet.replace(re, '<mark>$1</mark>');
          html += `<li style="margin-bottom:1.2em;">
            <a href="${page.url}" style="font-weight:bold;color:#003087;font-size:1.1rem;text-decoration:underline;">${title}</a>
            <div style="color:#222;font-size:0.98rem;margin-top:0.2em;">${snippetHighlighted}</div>
          </li>`;
        });
        html += `</ul>`;
      } else {
        html += `<div style="color:#b00;font-size:1.1rem;">No matching results found for "<b>${query}</b>".</div>`;
      }
      html += `<button id="close-search-popup" style="margin-top:1.5em;background:#003087;color:#fff;border:none;padding:0.5em 1.2em;border-radius:5px;cursor:pointer;">Close</button>`;
      searchPopup.innerHTML = html;
      searchPopup.style.display = 'block';

      // Close button
      document.getElementById('close-search-popup').onclick = closeSearchPopup;
    })
    .catch(() => {
      searchPopup.innerHTML = `<div style="color:#b00;">Error loading search index.</div>`;
      searchPopup.style.display = 'block';
    });
};

searchButton?.addEventListener("click", searchWebsite);
searchBar?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchWebsite();
  }
});


  

  // --- MOBILE SEARCH OVERLAY ---
  // This code makes the search overlay work on mobile.
  // When you click the search link, it opens a full-screen search box.
  // Clicking outside the box closes it.
  const searchLink = document.querySelector(".search-link");
  const searchOverlay = document.querySelector(".search-overlay");

  searchLink?.addEventListener("click", () => searchOverlay.classList.add("active"));
  searchOverlay?.addEventListener("click", (e) => {
    if (e.target === searchOverlay) searchOverlay.classList.remove("active");
  });

  // --- HERO IMAGE ZOOM ON SCROLL ---
  // This script makes the hero image zoom in as you scroll down the page.
  // It adds the .zoomed class to the .hero section when you scroll down,
  // and removes it when you scroll back up.
  document.addEventListener("scroll", function () {
    // Find the hero section on the page.
    const hero = document.querySelector('.hero');
    if (!hero) return; // If there's no hero section, stop.

    // Get how far the user has scrolled down.
    const scrollY = window.scrollY;

    // If the user has scrolled more than 15px but less than 400px, zoom in.
    if (scrollY > 15 && scrollY < 400) {
      hero.classList.add('zoomed');
    } else {
      // Otherwise, remove the zoom effect.
      hero.classList.remove('zoomed');
    }
  });

  // --- INITIAL FADE-IN FOR STATIC CONTENT ---
  // Run the fade-in observer for any .fade-in elements already on the page.
  // This makes sure that even elements that are present when the page loads
  // will animate in as you scroll.
  observeFadeInElements();

  // --- DROPDOWN SLIDE-IN LOGIC FOR MOBILE MENU ---
  // This lets dropdown menus slide in as panels when their arrow is clicked in the overlay menu.

  // Find all dropdown toggles (arrows/buttons) inside the overlay menu
  const dropdownToggles = document.querySelectorAll('.menu-overlay .dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent link navigation
      // Find the related dropdown-content (submenu)
      const dropdownContent = toggle.nextElementSibling;
      if (dropdownContent) {
        dropdownContent.classList.add('active'); // Slide in the submenu
      }
    });
  });

  // Add logic for "Back" buttons inside dropdown-content to return to main menu
  const dropdownBacks = document.querySelectorAll('.menu-overlay .dropdown-back');

  dropdownBacks.forEach(backBtn => {
    backBtn.addEventListener('click', () => {
      // Find the parent dropdown-content and hide it
      const dropdownContent = backBtn.closest('.dropdown-content');
      if (dropdownContent) {
        dropdownContent.classList.remove('active');
      }
    });
  });
});