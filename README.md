# News Feed Web App

This is a simple, responsive single-page News Feed application. It dynamically loads and displays news articles from a provided JSON file (`news.json` or `news_updated.json`).

## Features

* Displays a main news article page.
* Includes category pages showing lists of articles belonging to that category.
* Dynamically loads news data from a JSON file using the `fetch()` API.
* Uses Bootstrap Cards to display articles on category pages.
* Features a responsive layout suitable for various screen sizes.
* Includes basic navigation (Home, About, Contact) and a header with a site title.
* Clicking on the site title or "Home" link displays all articles.
* Clicking on a category link in the sidebar filters articles by that category.
* Clicking "Read More" on an article card displays the full article content.
* "About" and "Contact" pages display static informational content.
* Active navigation links (both main navigation and category sidebar) are visually highlighted.

## Technologies Used

* HTML5
* CSS3
* Bootstrap 5.3
* Vanilla JavaScript (ES6+)

## How to Run

This application **must be run using a local web server**. This is because it uses the `fetch()` API to load the `news_updated.json` file, and most browsers block `fetch()` requests for local files (`file://`) due to security restrictions (CORS policy).

Here are the steps to run the application:

1.  **preparations:**
    Download the file and navigate the the directory
3.  **Start a Local Web Server:**
    You can use any local web server. Here are a few common options:

    * **Using VS Code's Live Server Extension:**
        If you are using Visual Studio Code, install the "Live Server" extension from the Extensions marketplace. Then, right-click on your main HTML file (e.g., `index.html`) in the VS Code explorer and select "Open with Live Server". This will usually open the page at an address like `http://127.0.0.1:5500`.

    * **Using Node.js `http-server`:**
        If you have Node.js installed, you can install and run `http-server`:
        ```bash
        npm install -g http-server
        http-server
        ```
        Then, open your browser to `http://localhost:8080` (or the address it provides).

4.  **View the App:**
    Once the server is running, navigate to the local address (like `http://localhost:8000`) in your web browser to view and interact with the News Feed Web App.


![image](https://github.com/user-attachments/assets/66327f50-c042-4ed1-a63a-605fbb57ffa3)

