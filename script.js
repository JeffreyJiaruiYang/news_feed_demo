document.addEventListener('DOMContentLoaded', () => {
    // 获取 DOM 元素
    const sidebarCategoriesElement = document.getElementById('sidebar-categories');
    const mainContentElement = document.getElementById('main-content');
    const navbarBrandLink = document.querySelector('.navbar-brand');
    const navHomeLink = document.getElementById('nav-home');
    const navAboutLink = document.getElementById('nav-about');
    const navContactLink = document.getElementById('nav-contact');
    const mainNavLinks = document.querySelectorAll('#navbarNav .nav-link'); // 获取所有主导航链接
    const navbarCategoriesElement = document.getElementById('navbar-categories');

    //welcome section
    const welcomeSection = document.getElementById('welcome-section');
    const startButton = document.getElementById('start-button');

    // 存储文章数据
    let allArticlesData = [];

    // --- 数据获取 ---
    async function fetchNewsData() {
        try {
            const response = await fetch('news_updated.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allArticlesData = data.articles;
            displayCategories(allArticlesData); // 显示分类
            showAllArticlesAndActivateHome(); // 默认显示主页内容

        } catch (error) {
            console.error("Could not fetch news data:", error);
            mainContentElement.innerHTML = "<p class='text-danger'>Failed to load news articles. Please try again later.</p>";
        }
    }

    // --- 导航栏与侧边栏 ---

    // 关闭导航栏 (汉堡菜单)
    function closeNavbar() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    }

    // 更新主导航链接激活状态
    function updateActiveNavLink(activeLink) {
        mainNavLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }

        if (activeLink !== navHomeLink) {
            updateActiveCategoryLink(null);
        } else {
            const isAnyCategoryActive = document.querySelector('#sidebar-categories .nav-link.active, #navbar-categories .nav-link.active');
            if (isAnyCategoryActive === null && allArticlesData.length > 0) {
                const allArticlesCatLink = document.querySelector('#sidebar-categories .nav-item:first-child .nav-link');
                if (allArticlesCatLink) {
                    updateActiveCategoryLink(allArticlesCatLink);
                }
            }
        }
    }

    // 更新分类链接激活状态 (处理两个位置)
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

    // 显示分类列表 (在侧边栏和导航栏)
    function displayCategories(articles) {
        sidebarCategoriesElement.innerHTML = '';
        navbarCategoriesElement.innerHTML = ''; // 清空两个区域

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
                updateActiveNavLink(navHomeLink); // 确保Home激活
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
                    updateActiveNavLink(navHomeLink); // 确保Home激活
                    if (isNavbar) closeNavbar();
                });
                li.appendChild(link);
                ul.appendChild(li);
            });
            parentElement.appendChild(ul);
        }

        createListContent(sidebarCategoriesElement, false);
        createListContent(navbarCategoriesElement, true);

        // 默认激活 "All Articles" - 由 showAllArticlesAndActivateHome 统一处理
    }

    // --- 内容显示 ---

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    // 显示文章列表
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
                updateActiveNavLink(navHomeLink); // 查看文章详情时，保持Home激活
            });
        });
    }

    // 按分类显示文章
    function displayArticlesByCategory(category) {
        const filteredArticles = allArticlesData.filter(article => article.category === category);
        displayArticles(filteredArticles);
    }

    // 显示单篇文章
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

        mainContentElement.innerHTML = `
            <h2 class="mt-3">${article.title}</h2>
            <p><small class="text-muted">By ${article.author} on ${formatDate(article.date_posted)}</small></p>
            ${article.image ? `<img src="${article.image}" class="img-fluid mb-3" alt="${article.title}">` : ''}
            <div>${article.full_article.replace(/\n/g, '<br>')}</div>
            ${tagsHtml}
            <hr>
            <button class="btn btn-secondary mb-3" id="back-to-articles">Back to Articles</button>
        `;

        document.getElementById('back-to-articles').addEventListener('click', () => {
            // 查找当前激活的分类链接文本
            const activeCategoryLink = document.querySelector('#sidebar-categories .nav-link.active, #navbar-categories .nav-link.active');
            if (activeCategoryLink && activeCategoryLink.textContent !== 'All Articles') {
                displayArticlesByCategory(activeCategoryLink.textContent);
            } else {
                displayArticles(allArticlesData);
            }
            updateActiveNavLink(navHomeLink); // 确保Home激活
        });
    }

    // --- 事件监听器 ---

    // About 页面
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

    // Contact 页面
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

    // 显示主页 (所有文章) 并激活 Home & All Articles
    function showAllArticlesAndActivateHome() {
        displayArticles(allArticlesData);
        updateActiveNavLink(navHomeLink); // 这会调用 updateActiveCategoryLink 设置默认
    }

    // 点击 Brand Logo
    if (navbarBrandLink) {
        navbarBrandLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllArticlesAndActivateHome();
            closeNavbar(); // <-- 添加关闭
        });
    }

    // 点击 Home 链接
    if (navHomeLink) {
        navHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllArticlesAndActivateHome();
            closeNavbar(); // <-- 添加关闭
        });
    }

    // --- Welcome Section Hiding ---
    if (startButton && welcomeSection) {
        startButton.addEventListener('click', () => {
            console.log("Start button clicked, hiding welcome section."); // 可以加一行输出来确认
            welcomeSection.style.display = 'none';
        });
    }

    // --- 启动 ---
    fetchNewsData();
});