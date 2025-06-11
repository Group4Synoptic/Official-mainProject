
// Carousel for 3 goals, fetching data from app.json and showing images

document.addEventListener('DOMContentLoaded', () => {
    // Fetch goals data from app.json
    fetch('json/app.json')
      .then(res => res.json())
      .then(data => {
        const goals = data.goals;
        let mainIndex = 0;
  
        // Helper to get the correct index with wrap-around
        function getIndex(offset) {
          return (mainIndex + offset + goals.length) % goals.length;
        }
  
        // Renders the 3 cards: left, main, right
        function renderCarousel() {
          const carousel = document.getElementById('goals-carousel');
          carousel.innerHTML = ''; // Clear previous
  
          // Left, Main, Right
          [-1, 0, 1].forEach(offset => {
            const idx = getIndex(offset);
            const goal = goals[idx];
            const card = document.createElement('div');
            card.className = 'carousel-goal-card' + (offset === 0 ? ' main' : '');
            card.tabIndex = 0; // Make focusable for accessibility
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', goal.title + ' - ' + goal.desc);
  
            // Card content: title, description and image
            card.innerHTML = `
              <h2>${goal.title}</h2>
              <p>${goal.desc}</p>
              <img src="${goal.image}" alt="${goal.title} image" class="goal-img" />
            `;
  
            // Click or keyboard navigation to goal page
            card.addEventListener('click', () => {
              window.location.href = goal.link;
            });
            card.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = goal.link;
              }
            });
            carousel.appendChild(card);
          });
        }
  
        // Arrow navigation on both sides
        document.querySelector('.carousel-arrow.left').addEventListener('click', () => {
          mainIndex = (mainIndex - 1 + goals.length) % goals.length;
          renderCarousel();
        });
        document.querySelector('.carousel-arrow.right').addEventListener('click', () => {
          mainIndex = (mainIndex + 1) % goals.length;
          renderCarousel();
        });
  
        // Initial render
        renderCarousel();
      })
      .catch(err => {
        // Show a message if loading fails
        const carousel = document.getElementById('goals-carousel');
        if (carousel) {
          carousel.innerHTML = "<p>Could not load goals data. Please refresh</p>";
        }
        console.error("Failed to load goals:", err);
      });
  });
