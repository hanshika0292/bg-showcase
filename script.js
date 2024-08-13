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
async function loadGames() {
    try {
        const response = await fetch('games.json');
        const games = await response.json();
        console.log('Fetched data:', games);
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
        const posts = await response.json();
        const blogGrid = document.getElementById('blogGrid');
        
        if (!blogGrid) {
            console.error('Blog grid element not found');
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
        <img src="${post.image}" alt="${post.title}" class="blog-image">
        <div class="blog-content">
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-description">${post.excerpt}</p>
            <p class="blog-meta">By ${post.author} on ${post.date}</p>
        </div>
    `;
    return card;
}

// Load game details
async function loadGameDetails(gameId) {
    try {
        const response = await fetch('games.json');
        const games = await response.json();
        const game = games.find(g => g.id === gameId);
        
        if (game) {
            populateGameDetails(game);
            createImageCarousel(game.images);
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
        <h1>${game.title}</h1>
        <p>${game.description}</p>
        <div class="game-stats">
            <div class="game-stat">Players: ${game.players}</div>
            <div class="game-stat">Duration: ${game.duration}</div>
            <div class="game-stat">Age: ${game.age}+</div>
        </div>
        <a href="${game.playLink}" class="play-button">Play Now</a>
    `;
}

function createImageCarousel(images) {
    const carousel = document.getElementById('imageCarousel');
    if (!carousel) {
        console.error('Carousel element not found');
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