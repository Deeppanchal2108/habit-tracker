# HabitTracker

A modern, full-stack habit tracking application built with Next.js and TypeScript. This project serves as a robust foundation for users to create, track, and manage their daily/weekly habits while connecting with a community.

## ✨ Features

-   **User Authentication:** Secure user sign-up, login, and logout functionalities.
-   **Dynamic Navigation:** The navigation bar intelligently updates based on the user's authentication status.
-   **Personalized User Profiles:** View detailed profiles, including user information and a list of their recent habits.
-   **Habit Creation:** A simple and intuitive form for creating new habits with customizable details like frequency.
-   **User-to-User Interaction:** Functionality to follow and unfollow other users to build a supportive community.
-   **Real-time Feedback:** Toast notifications powered by `sonner` provide instant feedback on user actions.
-   **Efficient Data Management:** The application uses Server Components for optimal performance and Client Components for interactivity.

## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Data Fetching:** [Axios](https://axios-http.com/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Toasts:** [sonner](https://sonner.emilkowalski.pl/)
-   **Icons:** [Lucide React](https://lucide.dev/)

---

## 📸 Screenshots

### **Habit Creation Page**

_A clean, minimalist form for creating a new habit. The form includes fields for the habit name, description, frequency (daily/weekly), and category._

![Habit Creation Page](/public/habit.png)

### **Dashboard & Recent Activity**

_The user's dashboard view, displaying a list of their recent habits and a section for a community feed or "suggested to follow" list._

![Dashboard showing recent habits](/public/a.png)

### **User Profile**

_A public-facing user profile showing their name, email, follower/following counts, and a list of their recently created habits._

![User Profile showing recent habits and stats](/public/image.png)

---

## 💻 Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.x or later)
-   [pnpm](https://pnpm.io/installation) (recommended) or npm/yarn
-   [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  Clone the repository:
    ```bash
    git clone url 
    cd HabitTracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a `.env` file in the root directory and add your database connection string:
    ```env
    DATABASE_URL="postgresql://[USER]:[PASSWORD]@localhost:5432/[DATABASE_NAME]?schema=public"
    ```

4.  Run Prisma migrations to create the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be running at `http://localhost:3000`.
