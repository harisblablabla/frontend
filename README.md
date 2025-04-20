# Zypsy Frontend Exercise

## Description

This project is a web application built with Next.js that allows users to browse posts dynamically filtered by categories. It features a responsive layout with a persistent category sidebar and a main content area displaying the relevant posts based on the user's selection. This application including state management, API interaction, and responsive design.

## Features

* **Category Sidebar:**
    * Displays a list of categories fetched from an API (`/categories`).
    * Allows filtering between "All Categories" and "Favorite Categories".
    * Supports marking/unmarking categories as favorites with **Optimistic UI Updates** for immediate feedback.
    * Favorite status changes are persisted to the backend (`PUT /category/{id}`).
    * **Responsive Design:** Sidebar collapses into a slide-in menu on smaller screens.
    * Handles loading (skeleton UI) and error states during initial category fetch.
* **Post List:**
    * Displays posts dynamically based on the selected category (`GET /category/{id}/posts`).
    * Shows post details including date, description, and associated category tags.
    * Category tags display name and favorite status (looked up from shared category data).
    * Handles loading (skeleton UI) and error states during post fetching.
    * Matches the provided visual design (same with the sidebar).
* **State Persistence:**
    * The currently selected category is persisted across page reloads using **URL Search Parameters** (`?category=...`).
* **Routing:**
    * Utilizes the Next.js App Router for layout and page management.

## Tech Stack

* **Framework:** Next.js 15+ (App Router, with turbopack dev)
* **Language:** TypeScript
* **UI Library:** React 18+
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **API Interaction:** Fetch API via helper functions in `lib/api.ts`
* **Icons:** Heroicons

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/harisblablabla/frontend.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables (if any):**
    * Add any necessary environment variables (e.g., API base URL):
        ```env
        NEXT_PUBLIC_API_BASE_URL=[http://your-backend-api-url.com]
        ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) (or the specified port) in your browser.

## Starting the backend

The project requires **node >=18.19**, so check if you have the correct version. 

Run `npm install` in backend folder to install dependencies. Run the server with `npm run start`. The API is served at [http://localhost:9000](http://localhost:9000/), and you can go to `/docs` to explore the API documentation.

## API Endpoints Used

The frontend interacts with the backend API endpoints (provided from zypsy team):

* `GET /categories`: Fetches the list of all categories (`[{id, name, favorite}]`).
* `PUT /category/{id}`: Updates the favorite status of a category (expects `{id, name, favorite}` in body).
* `GET /category/{id}/posts`: Fetches posts belonging to a specific category (returns `[{id, date, description, categories: []`).



