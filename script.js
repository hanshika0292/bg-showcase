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

// Existing functions (loadGames, loadBlogPosts, etc.) go here...

// Call loadCommonElements first, then other functions
document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonElements();
    
    if (document.getElementById('gamesGrid')) {
        loadGames();
    }
    
    if (document.getElementById('blogGrid')) {
        loadBlogPosts();
    }
    
    if (document.getElementById('gameDetails')) {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id');
        if (gameId) {
            loadGameDetails(gameId);
        }
    }
});

// Fetch and populate games
async function loadGames() {
    const response = await fetch('games.json');
    const games = await response.json();
    const gamesGrid = document.getElementById('gamesGrid');
    
    games.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

function createGameCard(game) {
    // Create and return a game card element
}

// Fetch and populate blog posts
async function loadBlogPosts() {
    const response = await fetch('blog.json');
    const posts = await response.json();
    const blogGrid = document.getElementById('blogGrid');
    
    posts.forEach(post => {
        const blogCard = createBlogCard(post);
        blogGrid.appendChild(blogCard);
    });
}

function createBlogCard(post) {
    // Create and return a blog card element
}

// Load game details
async function loadGameDetails(gameId) {
    const response = await fetch('games.json');
    const games = await response.json();
    const game = games.find(g => g.id === gameId);
    
    if (game) {
        populateGameDetails(game);
        createImageCarousel(game.images);
    }
}

function populateGameDetails(game) {
    // Populate game details in the game-details.html page
}

function createImageCarousel(images) {
    // Create and populate the image carousel
}

// Call the appropriate function based on the current page
if (document.getElementById('gamesGrid')) {
    loadGames();
}

if (document.getElementById('blogGrid')) {
    loadBlogPosts();
}

if (document.getElementById('gameDetails')) {
    // Extract gameId from URL and load game details
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    if (gameId) {
        loadGameDetails(gameId);
    }
}