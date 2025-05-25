document.addEventListener('DOMContentLoaded', () => {
    // sidebar for categories
    // only show when screen size is large
    const sidebarCategoriesElement = document.getElementById('sidebar-categories');

    // main content
    const mainContentElement = document.getElementById('main-content');

    //brand
    const navbarBrandLink = document.querySelector('.navbar-brand');

    // navbar
    const navHomeLink = document.getElementById('nav-home');
    const navAboutLink = document.getElementById('nav-about');
    const navContactLink = document.getElementById('nav-contact');
    const mainNavLinks = document.querySelectorAll('#navbarNav .nav-link'); // for all links in navbar

    // sidebar
    const navbarCategoriesElement = document.getElementById('navbar-categories');

    //welcome section
    const welcomeSection = document.getElementById('welcome-section');
    const startButton = document.getElementById('start-button');

    // all articles data
    let allArticlesData = [];

    // fetch news data from JSON file
    async function fetchNewsData() {
        try {
            const response = await fetch('news_updated.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allArticlesData = data.articles;
            displayCategories(allArticlesData); // display categories
            showAllArticlesAndActivateHome(); // default to show home

        } catch (error) {
            console.error("Could not fetch news data:", error);
            mainContentElement.innerHTML = "<p class='text-danger'>Failed to load news articles. Please try again later.</p>";
        }
    }

    // --- Nav bar and side bar ---

    // close navbar
    function closeNavbar() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    }

    // active link in navbar(home contact about)
    function updateActiveNavLink(activeLink) {
        mainNavLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
        // check if the active link is not the home link
        // if not, remove active class from all category links
        if (activeLink !== navHomeLink) {
            updateActiveCategoryLink(null);
        }
    }

    // update active link in sidebar and navbar
    function updateActiveCategoryLink(activeLink) {
        const allCategoryLinks = document.querySelectorAll('#sidebar-categories .nav-link, #navbar-categories .nav-link');
        allCategoryLinks.forEach(link => link.classList.remove('active'));

        if (activeLink) {
            const linkText = activeLink.textContent;
            allCategoryLinks.forEach(link => {
                if (link.textContent === linkText) {
                    link.classList.add('active');
                }
            });
        }
    }

    // show category (both sidebar and navbar)
    function displayCategories(articles) {
        sidebarCategoriesElement.innerHTML = '';
        navbarCategoriesElement.innerHTML = ''; // clear previous content

        const categories = [...new Set(articles.map(article => article.category))];

        function createListContent(parentElement, isNavbar) {
            const categoriesHeader = document.createElement('h5');
            categoriesHeader.textContent = 'Categories';
            if (isNavbar) {
                categoriesHeader.classList.add('text-white', 'mt-2', 'ms-3');
            }
            parentElement.appendChild(categoriesHeader);

            const ul = document.createElement('ul');
            ul.className = isNavbar ? 'nav flex-column ms-3' : 'nav flex-column';

            const allArticlesLi = document.createElement('li');
            allArticlesLi.className = 'nav-item';
            const allArticlesLink = document.createElement('a');
            allArticlesLink.className = isNavbar ? 'nav-link text-white-50' : 'nav-link';
            allArticlesLink.href = '#';
            allArticlesLink.textContent = 'All Articles';
            allArticlesLink.addEventListener('click', (e) => {
                e.preventDefault();
                displayArticles(allArticlesData);
                updateActiveCategoryLink(allArticlesLink);
                updateActiveNavLink(navHomeLink);
                if (isNavbar) closeNavbar();
            });
            allArticlesLi.appendChild(allArticlesLink);
            ul.appendChild(allArticlesLi);

            categories.sort().forEach(category => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                const link = document.createElement('a');
                link.className = isNavbar ? 'nav-link text-white-50' : 'nav-link';
                link.href = '#';
                link.textContent = category;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    displayArticlesByCategory(category);
                    updateActiveCategoryLink(link);
                    updateActiveNavLink(navHomeLink);
                    if (isNavbar) closeNavbar();
                });
                li.appendChild(link);
                ul.appendChild(li);
            });
            parentElement.appendChild(ul);
        }

        createListContent(sidebarCategoriesElement, false);
        createListContent(navbarCategoriesElement, true);
        // default to show all articles which is managed by showAllArticlesAndActivateHome
    }

    // --- content ---

    // format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    // show articles list
    function displayArticles(articlesToDisplay) {
        mainContentElement.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'row g-4';

        if (!articlesToDisplay || articlesToDisplay.length === 0) {
            mainContentElement.innerHTML = "<p>No articles found.</p>";
            return;
        }

        articlesToDisplay.forEach(article => {
            const col = document.createElement('div');
            col.className = 'col-12';

            const card = document.createElement('div');
            card.className = 'card h-100';

            let imageHtml = article.image ? `<img src="${article.image}" class="card-img-top" alt="${article.title}" style="max-height: 200px; object-fit: cover;">` : '';

            let tagsHtml = '';
            if (article.tags && article.tags.length > 0) {
                tagsHtml = '<div class="mb-3">' + article.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('') + '</div>';
            }

            card.innerHTML = `
                ${imageHtml}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text"><small class="text-muted">${formatDate(article.date_posted)}</small></p>
                    <p class="card-text">${article.excerpt}</p>
                    ${tagsHtml}
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
                updateActiveNavLink(navHomeLink); // when click article, make sure Home is active
            });
        });
    }

    // show articles by category
    function displayArticlesByCategory(category) {
        const filteredArticles = allArticlesData.filter(article => article.category === category);
        displayArticles(filteredArticles);
    }

    // show single article
    function displaySingleArticle(articleId) {
        const article = allArticlesData.find(art => art.id === articleId);
        if (!article) {
            mainContentElement.innerHTML = "<p>Article not found.</p>";
            return;
        }

        let tagsHtml = '';
        if (article.tags && article.tags.length > 0) {
            tagsHtml = '<div class="my-3"><strong>Tags:</strong> ' + article.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('') + '</div>';
        }

        let sourceHtml = '';
        if (article.source) {
            sourceHtml = `<p><small class="text-muted">Source: ${article.source}</small></p>`;
        }

        mainContentElement.innerHTML = `
            <h2 class="mt-3">${article.title}</h2>
            <p><small class="text-muted">By ${article.author} on ${formatDate(article.date_posted)}</small></p>
            ${article.image ? `<img src="${article.image}" class="img-fluid mb-3" alt="${article.title}">` : ''}
            <div>${article.full_article.replace(/\n/g, '<br>')}</div>
            ${tagsHtml}
            ${sourceHtml}
            <hr>
            <button class="btn btn-secondary mb-3" id="back-to-articles">Back to Articles</button>
        `;

        document.getElementById('back-to-articles').addEventListener('click', () => {
            // find the active category link
            const activeCategoryLink = document.querySelector('#sidebar-categories .nav-link.active, #navbar-categories .nav-link.active');
            if (activeCategoryLink && activeCategoryLink.textContent !== 'All Articles') {
                displayArticlesByCategory(activeCategoryLink.textContent);
            } else {
                displayArticles(allArticlesData);
            }
             updateActiveNavLink(navHomeLink); // make sure Home is active
        });
    }

    // --- Lisener for nav bar ---

    // About
    if (navAboutLink) {
        navAboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContentElement.innerHTML = `
                <div class="container mt-4">
                    <h2>About This Project</h2>
                    <p>This is a single-page news feed application built with HTML, Bootstrap 5, and Vanilla JavaScript.</p>
                    </div>
            `;
            updateActiveNavLink(navAboutLink);
            closeNavbar();
        });
    }

    // Contact
    if (navContactLink) {
        navContactLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContentElement.innerHTML = `
                <div class="container mt-4">
                    <h2>Contact Us</h2>
                    <p>Email: jeffreyjr@vt.edu</p>
                    <p>Phone: 540-321-9708</p>
                </div>
            `;
            updateActiveNavLink(navContactLink);
            closeNavbar();
        });
    }

    // 1. show all articles
    // 2. activate navbar
    // 3. activate category
    function showAllArticlesAndActivateHome() {
        // show content
        displayArticles(allArticlesData);

        // update navbar
        updateActiveNavLink(navHomeLink); // set Home as active


        // update category
        const allCategoryLinks = document.querySelectorAll('#sidebar-categories .nav-link, #navbar-categories .nav-link');
        let allArticlesLinkToActivate = null;
        // find the "All Articles" link in both sidebar and navbar
        allCategoryLinks.forEach(link => {
            if (link.textContent === 'All Articles') {
                allArticlesLinkToActivate = link;
                return;
            }
        });

        // if find use updateActiveCategoryLink
        if (allArticlesLinkToActivate) {
            updateActiveCategoryLink(allArticlesLinkToActivate);
        }
    }

    // brand
    if (navbarBrandLink) {
        navbarBrandLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllArticlesAndActivateHome();
            closeNavbar();
        });
    }

    // Home 
    if (navHomeLink) {
        navHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllArticlesAndActivateHome();
            closeNavbar();
        });
    }

    // --- Welcome Section Hiding ---
    if (startButton && welcomeSection) {
        startButton.addEventListener('click', () => {
            welcomeSection.style.display = 'none';
        });
    }

    // --- start ---
    fetchNewsData();
});