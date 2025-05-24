document.addEventListener('DOMContentLoaded', () => {
    const sidebarCategoriesElement = document.getElementById('sidebar-categories');
    const mainContentElement = document.getElementById('main-content');
    const navbarBrandLink = document.querySelector('.navbar-brand');
    const navHomeLink = document.querySelector('#navbarNav .nav-item:nth-child(1) .nav-link');
    const navAboutLink = document.querySelector('#navbarNav .nav-item:nth-child(2) .nav-link');
    const navContactLink = document.querySelector('#navbarNav .nav-item:nth-child(3) .nav-link');
    const mainNavLinks = document.querySelectorAll('#navbarNav .nav-link');

    let allArticlesData = [];

    async function fetchNewsData() {
        try {
            const response = await fetch('news_updated.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allArticlesData = data.articles;
            displayCategories(allArticlesData);
            if (navHomeLink) {
                displayArticles(allArticlesData);
                updateActiveNavLink(navHomeLink);
            } else {
                console.error("Home link not found. Check selector.");
                displayArticles(allArticlesData);
            }

        } catch (error) {
            console.error("Could not fetch news data:", error);
            mainContentElement.innerHTML = "<p class='text-danger'>Failed to load news articles. Please try again later.</p>";
        }
    }

    function displayCategories(articles) {
        sidebarCategoriesElement.innerHTML = '';
        
        const categories = [...new Set(articles.map(article => article.category))];
        
        const categoriesHeader = document.createElement('h5');
        categoriesHeader.textContent = 'Categories';
        sidebarCategoriesElement.appendChild(categoriesHeader);

        const ul = document.createElement('ul');
        ul.className = 'nav flex-column';

        const allArticlesLi = document.createElement('li');
        allArticlesLi.className = 'nav-item';
        const allArticlesLink = document.createElement('a');
        allArticlesLink.className = 'nav-link';
        allArticlesLink.href = '#';
        allArticlesLink.textContent = 'All Articles';
        allArticlesLink.addEventListener('click', (e) => {
            e.preventDefault();
            displayArticles(allArticlesData);
            updateActiveCategoryLink(allArticlesLink);
            if (navHomeLink) updateActiveNavLink(navHomeLink);
        });
        allArticlesLi.appendChild(allArticlesLink);
        ul.appendChild(allArticlesLi);

        categories.sort().forEach(category => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            const link = document.createElement('a');
            link.className = 'nav-link';
            link.href = '#';
            link.textContent = category;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                displayArticlesByCategory(category);
                updateActiveCategoryLink(link);
                if (navHomeLink) updateActiveNavLink(navHomeLink);
            });
            li.appendChild(link);
            ul.appendChild(li);
        });
        sidebarCategoriesElement.appendChild(ul);
        
        // 默认激活 "All Articles" 分类链接
        if (ul.firstChild && ul.firstChild.firstChild) { 
             updateActiveCategoryLink(ul.firstChild.firstChild);
        }
    }
    
    function updateActiveCategoryLink(activeLink) {
        const allCategoryLinks = sidebarCategoriesElement.querySelectorAll('.nav-link');
        allCategoryLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function updateActiveNavLink(activeLink) {
        mainNavLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        if (activeLink !== navHomeLink) { 
             updateActiveCategoryLink(null);
        } else if (sidebarCategoriesElement.querySelector('.nav-link.active') === null && allArticlesData.length > 0) {
            const allArticlesCatLink = sidebarCategoriesElement.querySelector('.nav-item:first-child .nav-link'); 
            if (allArticlesCatLink) updateActiveCategoryLink(allArticlesCatLink);
        }
    }

    function formatDate(dateString) { 
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    function displayArticles(articlesToDisplay) {
        mainContentElement.innerHTML = ''; 
        const row = document.createElement('div');
        row.className = 'row g-4';

        if (!articlesToDisplay || articlesToDisplay.length === 0) { // 添加 !articlesToDisplay 检查
            mainContentElement.innerHTML = "<p>No articles found.</p>";
            return;
        }

        articlesToDisplay.forEach(article => {
            const col = document.createElement('div');
            col.className = 'col-12'; 

            const card = document.createElement('div');
            card.className = 'card h-100';

            let imageHtml = '';
            if (article.image) { 
                imageHtml = `<img src="${article.image}" class="card-img-top" alt="${article.title}" style="max-height: 200px; object-fit: cover;">`;
            }

            card.innerHTML = `
                ${imageHtml}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text"><small class="text-muted">${formatDate(article.date_posted)}</small></p>
                    <p class="card-text">${article.excerpt}</p> 
                    <a href="#" class="btn btn-primary mt-auto view-article-btn" data-article-id="${article.id}">Read More</a>
                </div>
            `;
            col.appendChild(card);
            row.appendChild(col);
        });
        mainContentElement.appendChild(row);

        document.querySelectorAll('.view-article-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const articleId = e.target.dataset.articleId;
                displaySingleArticle(parseInt(articleId));
                if (navHomeLink) updateActiveNavLink(navHomeLink);
            });
        });
    }

    function displayArticlesByCategory(category) {
        const filteredArticles = allArticlesData.filter(article => article.category === category);
        displayArticles(filteredArticles);
    }

    function displaySingleArticle(articleId) {
        const article = allArticlesData.find(art => art.id === articleId);
        if (!article) {
            mainContentElement.innerHTML = "<p>Article not found.</p>";
            return;
        }

        mainContentElement.innerHTML = '';                                                              
        const articleWrapper = document.createElement('div');
        articleWrapper.innerHTML = `
            <h2 class="mt-3">${article.title}</h2>
            <p><small class="text-muted">By ${article.author} on ${formatDate(article.date_posted)}</small></p>
            ${article.image ? `<img src="${article.image}" class="img-fluid mb-3" alt="${article.title}">` : ''}
            <div>${article.full_article.replace(/\n/g, '<br>')}</div> 
            <hr>
            <button class="btn btn-secondary mb-3" id="back-to-articles">Back to Articles</button>
        `;
        mainContentElement.appendChild(articleWrapper);
        
        document.getElementById('back-to-articles').addEventListener('click', () => {
            const activeCategoryLink = sidebarCategoriesElement.querySelector('.nav-link.active');
            if (activeCategoryLink && activeCategoryLink.textContent !== 'All Articles') {
                displayArticlesByCategory(activeCategoryLink.textContent);
            } else {
                displayArticles(allArticlesData);
            }
            if (navHomeLink) updateActiveNavLink(navHomeLink); 
        });
    }

if (navAboutLink) {
        navAboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContentElement.innerHTML = `
                <div class="container mt-4">
                    <h2>About This Project - Technical Overview</h2>
                    <p>This news feed application is designed as a single-page application (SPA) to demonstrate front-end development skills.</p>
                    
                    <h4 class="mt-4">Core Technologies & Approaches:</h4>
                    <ul>
                        <li><strong>HTML5:</strong> Semantic structure for the web page.</li>
                        <li><strong>Bootstrap 5.3:</strong> Used for responsive layout, styling, and UI components like the navigation bar, cards, and grid system. Custom CSS is kept озеро (minimal) to leverage Bootstrap's capabilities.</li>
                        <li><strong>Vanilla JavaScript (ES6+):</strong> All dynamic functionalities are implemented using plain JavaScript without any external frontend frameworks (like React, Angular, or Vue) or jQuery, as per project requirements.</li>
                        <li><strong>JSON Data Handling:</strong>
                            <ul>
                                <li>News articles are loaded dynamically from a local <code>news_updated.json</code> file.</li>
                                <li>The <code>fetch()</code> API is used for asynchronous data retrieval.</li>
                                <li>A Python script (<code>update_json_images.py</code>) was provided and utilized to preprocess the initial <code>news_feed.json</code>, ensuring image URLs are standardized and include dimensions, outputting to <code>news_updated.json</code>.</li>
                            </ul>
                        </li>
                        <li><strong>Dynamic Content Rendering:</strong> JavaScript is used to:
                            <ul>
                                <li>Parse the fetched JSON data.</li>
                                <li>Dynamically create and display category links in the sidebar.</li>
                                <li>Render news articles as Bootstrap cards in the main content area. Each card includes a title, formatted date, excerpt, and image.</li>
                                <li>Display a full article view when a card or "Read More" button is clicked.</li>
                            </ul>
                        </li>
                        <li><strong>Single-Page Application (SPA) Behavior:</strong>
                            <ul>
                                <li>Navigation (to different categories, individual articles, About/Contact pages) is handled without full page reloads.</li>
                                <li>Content in the main area is updated dynamically using JavaScript DOM manipulation.</li>
                                <li>Event listeners manage user interactions.</li>
                            </ul>
                        </li>
                        <li><strong>Responsive Design:</strong> The application layout adapts to different screen sizes, primarily leveraging Bootstrap's responsive grid and components.</li>
                    </ul>

                    <h4 class="mt-4">Key JavaScript Functions:</h4>
                    <ul>
                        <li><code>fetchNewsData()</code>: Loads and processes the initial news data.</li>
                        <li><code>displayCategories()</code>: Populates the category sidebar.</li>
                        <li><code>displayArticles()</code>: Renders a list of article cards.</li>
                        <li><code>displaySingleArticle()</code>: Shows the detailed view of an article.</li>
                        <li><code>formatDate()</code>: A utility function for date formatting.</li>
                        <li><code>updateActiveNavLink()</code> & <code>updateActiveCategoryLink()</code>: Manage the active state of navigation links.</li>
                    </ul>
                    
                    <p class="mt-4">The project structure includes <code>test.html</code> (main page), <code>script.js</code> (core logic), and <code>news_updated.json</code> (data source). Development was done using a local web server.</p>
                </div>
            `;
            updateActiveNavLink(navAboutLink); //确保About链接被设为激活状态
        });
    } else {
        console.error("About link not found. Check selector.");
    }

    if (navContactLink) {
        navContactLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContentElement.innerHTML = `
                <div class="container mt-4">
                    <h2>Contact Us</h2>
                    <p>If you have any questions or feedback, please feel free to reach out to me.</p>
                    <p>Email: jeffreyjr@vt.edu</p>
                    <p>Phone: 540-321-9708</p>
                </div>
            `;
            updateActiveNavLink(navContactLink);
        });
    } else {
        console.error("Contact link not found. Check selector.");
    }
    
    function showAllArticlesAndActivateHome() {
        displayArticles(allArticlesData);
        if (navHomeLink) updateActiveNavLink(navHomeLink);
        const allArticlesCatLink = sidebarCategoriesElement.querySelector('.nav-item:first-child .nav-link'); 
        if(allArticlesCatLink) updateActiveCategoryLink(allArticlesCatLink);
    }

    if (navbarBrandLink) {
        navbarBrandLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllArticlesAndActivateHome();
        });
    }

    if (navHomeLink) {
        navHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllArticlesAndActivateHome();
        });
    } else {
        console.error("Home link not found for event listener. Check selector.");
    }

    fetchNewsData();
});