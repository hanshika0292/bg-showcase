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
            <p class="game-description">${game.shortDescription}</p>
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
async function loadGameDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id');
        if (!gameId) {
            console.error('No game ID provided');
            return;
        }

        const response = await fetch('games.json');
        const data = await response.json();
        const game = data.games.find(g => g.id === gameId);
        
        if (game) {
            populateGameDetails(game);
        } else {
            console.error('Game not found');
        }
    } catch (error) {
        console.error('Error loading game details:', error);
    }
}

function populateGameDetails(game) {
    document.getElementById('gameTitle').textContent = game.title;
    document.getElementById('gameSubtitle').textContent = game.title;
    document.getElementById('gameDescription').textContent = game.fullDescription;
    document.getElementById('mainGameImage').src = game.image;
    document.getElementById('mainGameImage').alt = game.title;

    document.getElementById('playerCount').textContent = `Players: ${game.playerCount}`;
    document.getElementById('playTime').textContent = `Duration: ${game.playTime}`;
    document.getElementById('ageRange').textContent = `Age: ${game.ageRange}`;

    const playButton = document.getElementById('playButton');
    if (game.playLink) {
        playButton.href = game.playLink;
        playButton.style.display = 'inline-block';
    } else {
        playButton.style.display = 'none';
    }

    const rulebookContent = document.getElementById('rulebookContent');
    if (game.rulebook) {
        if (typeof game.rulebook === 'string' && game.rulebook.endsWith('.html')) {
            rulebookContent.innerHTML = `<iframe src="${game.rulebook}" width="100%" height="400px" frameborder="0"></iframe>`;
        } else if (Array.isArray(game.rulebook) && game.rulebook.length > 0) {
            rulebookContent.innerHTML = game.rulebook.map(rule => `
                <h4>${rule.section}</h4>
                <p>${rule.content}</p>
            `).join('');
        }
    } else {
        rulebookContent.innerHTML = '<p>Rulebook not available</p>';
    }

    createImageCarousel(game.imageGallery);
}

function createImageCarousel(images) {
    const carousel = document.querySelector('.carousel');
    if (!carousel || !images || images.length === 0) {
        return;
    }
    
    carousel.innerHTML = images.map(img => `<img src="${img}" alt="Game screenshot">`).join('');
    
    let currentIndex = 0;
    const carouselImages = carousel.querySelectorAll('img');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    function showImage(index) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
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
    setupMobileMenu();
    
    if (document.getElementById('gamesGrid')) {
        await loadGames();
    }
    
    if (document.getElementById('blogGrid')) {
        await loadBlogPosts();
    }
    
    if (document.querySelector('.game-details-grid')) {
        await loadGameDetails();
    }
}

// Call the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);