# News Feed Web App

![图片1](https://github.com/user-attachments/assets/d4295914-e1fa-4ef8-86fb-f4fd1401965b)

This is a simple, responsive single-page News Feed application. It dynamically loads and displays news articles from a provided JSON file (`news.json` or `news_updated.json`).

## Live Demo

You can view the live version of this News Feed Web App here:

**[https://jeffreyjiaruiyang.github.io/news_feed_demo/](https://jeffreyjiaruiyang.github.io/news_feed_demo/)**

## Technologies Used

* HTML5
* CSS3
* Bootstrap 5.3
* Vanilla JavaScript (ES6+)

## How to Run

This application **must be run using a local web server**. This is because it uses the `fetch()` API to load the `news_updated.json` file, and most browsers block `fetch()` requests for local files (`file://`) due to security restrictions (CORS policy).

If you want see the demo directly, use https://jeffreyjiaruiyang.github.io/news_feed_demo/

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


## Features

A concise overview of the News Feed Web App's capabilities:

### Data & Display

* **Dynamic Loading:** Asynchronously loads news data from `news_updated.json` using the `Workspace()` API.
* **Article Cards:** Renders news items as Bootstrap cards, featuring images, titles, formatted dates, and excerpts.
* **Full Article View:** Displays the complete article content upon clicking "Read More", including author, source, full text, and tags.

### Navigation & Interaction

* **Responsive Categories:** Features a category list that acts as a sidebar on desktops and collapses into the top navbar menu on smaller screens.
* **Category Filtering:** Enables users to view articles belonging to a specific category by clicking its link.
* **Main Navigation:** Provides standard "Home", "About", and "Contact" links.
* **Active State Highlighting:** Visually indicates the current active main navigation link and category with a border.
* **Back Button:** Allows easy navigation from a single article back to the article list.
* **Auto-Close Navbar:** The mobile (hamburger) menu automatically closes after a selection.

### UI & Experience

* **Welcome Section:** Greets users with an introductory section that can be dismissed.
* **Responsive Design:** Leverages Bootstrap 5.3 for a layout that adapts seamlessly to various screen sizes.
* **Favicon:** Includes a site icon for the browser tab.
* **Custom Font:** Utilizes the 'Share' Google Font for a distinct visual style.





