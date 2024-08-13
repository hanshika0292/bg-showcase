// Function to load common elements
async function loadCommonElements() {
    const response = await fetch('common-elements.html');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const header = doc.getElementById('header');
    const footer = doc.getElementById('footer');
    
    document.body.insertBefore(header, document.body.firstChild);
    document.body.appendChild(footer);
}

// Fetch and populate games
// Fetch and populate games
async function loadGames() {
    try {
        const response = await fetch('games.json');
        const data = await response.json();
        console.log('Fetched data:', data);
        
        const gamesGrid = document.getElementById('gamesGrid');
        if (!gamesGrid) {
            console.error('Games grid element not found');
            return;
        }
        
        let games = data;
        
        // Check if the data is wrapped in an object
        if (typeof data === 'object' && !Array.isArray(data)) {
            // Try to find an array in the object
            const arrayProperty = Object.values(data).find(prop => Array.isArray(prop));
            if (arrayProperty) {
                games = arrayProperty;
            } else {
                console.error('Unable to find games array in the JSON data');
                return;
            }
        }
        
        // Ensure games is an array
        if (!Array.isArray(games)) {
            console.error('Games data is not an array');
            return;
        }

        games.forEach(game => {
            const gameCard = createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <img src="${game.image}" alt="${game.title}" class="game-image">
        <div class="game-info">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-description">${game.description}</p>
            <a href="game-details.html?id=${game.id}" class="view-more">View More</a>
        </div>
    `;
    return card;
}

// Fetch and populate blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('blog.json');
        const data = await response.json();
        console.log('Fetched blog data:', data);
        
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) {
            console.error('Blog grid element not found');
            return;
        }
        
        const posts = data.articles;
        
        if (!Array.isArray(posts)) {
            console.error('Blog posts data is not an array');
            return;
        }

        posts.forEach(post => {
            const blogCard = createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}


function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
        <img src="${post.image || ''}" alt="${post.title || 'Blog post'}" class="blog-image">
        <div class="blog-content">
            <h3 class="blog-title">${post.title || 'Untitled'}</h3>
            <p class="blog-description">${post.description || 'No description available'}</p>
            <p class="blog-meta">By ${post.createdBy || 'Unknown'}</p>
            <a href="${post.link}" class="read-more-button" target="_blank" rel="noopener noreferrer">Read More</a>
        </div>
    `;
    return card;
}

function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const header = document.querySelector('header');

    if (mobileMenuToggle && header) {
        mobileMenuToggle.addEventListener('click', () => {
            header.classList.toggle('mobile-menu-open');
        });
    }
}

// Load game details
async function loadGameDetails(gameId) {
    try {
        const response = await fetch('games.json');
        const data = await response.json();
        const game = data.games.find(g => g.id === gameId);
        
        if (game) {
            document.getElementById('gameTitle').textContent = game.title;
            populateGameDetails(game);
            createImageCarousel(game.imageGallery);
        } else {
            console.error('Game not found');
        }
    } catch (error) {
        console.error('Error loading game details:', error);
    }
}

function populateGameDetails(game) {
    const gameDetails = document.getElementById('gameDetails');
    if (!gameDetails) {
        console.error('Game details element not found');
        return;
    }
    
    gameDetails.innerHTML = `
        <img src="${game.image}" alt="${game.title}" class="game-image">
        <div class="game-info">
            <p>${game.fullDescription}</p>
            <div class="game-stats">
                <div class="game-stat">Players: ${game.playerCount}</div>
                <div class="game-stat">Duration: ${game.playTime}</div>
                <div class="game-stat">Age: ${game.ageRange}</div>
            </div>
            ${game.playLink ? `<a href="${game.playLink}" class="play-button" target="_blank">Play Now</a>` : ''}
        </div>
    `;

    if (game.rulebook && game.rulebook.length > 0) {
        const rulebookHtml = `
            <div class="rulebook">
                <h3>Rulebook</h3>
                ${game.rulebook.map(rule => `
                    <h4>${rule.section}</h4>
                    <p>${rule.content}</p>
                `).join('')}
            </div>
        `;
        gameDetails.innerHTML += rulebookHtml;
    }
}

function createImageCarousel(images) {
    const carousel = document.getElementById('imageCarousel');
    if (!carousel || !images || images.length === 0) {
        return;
    }
    
    carousel.innerHTML = `
        <div class="carousel">
            ${images.map(img => `<img src="${img}" alt="Game screenshot">`).join('')}
        </div>
        <button class="carousel-button prev">Previous</button>
        <button class="carousel-button next">Next</button>
    `;
    
    // Add carousel functionality here
    let currentIndex = 0;
    const carouselImages = carousel.querySelectorAll('.carousel img');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');

    function showImage(index) {
        carouselImages.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
        showImage(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % carouselImages.length;
        showImage(currentIndex);
    });

    showImage(currentIndex);
}

// Main function to initialize the page
async function initializePage() {
    await loadCommonElements();
    
    if (document.getElementById('gamesGrid')) {
        await loadGames();
    }
    
    if (document.getElementById('blogGrid')) {
        await loadBlogPosts();
    }
    
    if (document.getElementById('gameDetails')) {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id');
        if (gameId) {
            await loadGameDetails(gameId);
        }
    }
}

// Call the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);