# RSVP Tracker

A full-stack, production-ready web application for managing and RSVPing to local meetups. Built with modern web technologies and completely containerized for a zero-setup local development experience.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens) with secure password hashing (bcrypt)
- **Infrastructure:** Docker & Docker Compose (Multi-stage builds, non-root users, health checks)
- **Logging:** Winston & Morgan (Laravel-style formatting with daily log rotation)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running (or Colima if on macOS).
- **Note for Mac users using Colima:** Ensure Colima is allocated enough memory to compile Next.js:
  ```bash
  colima stop
  colima start --memory 4
  ```

## How to Run

Because this project is fully Dockerized, there is no manual setup, `npm install`, or database configuration required.

1. **Start the Application:**
   Run the following command in the root directory to build the images and start the cluster:
   ```bash
   docker-compose up --build -d
   ```
   *The backend will automatically wait for MySQL to become healthy, create the schema, and seed test data. The frontend will then boot up.*

2. **Access the App:**
   - **Frontend UI:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:3001](http://localhost:3001)

3. **Stop the Application:**
   To gracefully shut down the containers:
   ```bash
   docker-compose down
   ```

## Using the Application

### Seed Users
The database automatically seeds 3 test users when it boots for the first time. You can log into any of them on the frontend:
- `alice@example.com`
- `bob@example.com`
- `charlie@example.com`

**Password for all seed users:** `password123`

### Features
- **Browse:** View all upcoming meetups on the homepage.
- **Authenticate:** Securely log in to manage your events.
- **Create:** Publish new meetup events (requires authentication).
- **RSVP:** Click "View Details" on any event to submit your attendance status (Going, Maybe, Declined) and see who else is attending.

## Database Access

If you want to manually inspect the MySQL database while the application is running:

1. Open an interactive MySQL shell inside the container:
   ```bash
   docker exec -it rsvp_db mysql -u root -proot
   ```
2. Run standard SQL commands:
   ```sql
   USE rsvp_tracker;
   SHOW TABLES;
   SELECT * FROM Users;
   ```
3. Type `exit;` to leave the shell.

## Architecture & Engineering Decisions
- **Security:** Containers drop privileges and run as non-root users (`nextjs` and `expressjs`). JWT handles stateless auth, and routes verify resource ownership server-side.
- **Optimization:** The Next.js frontend uses `output: 'standalone'` alongside multi-stage Docker builds to dramatically reduce image sizes and compilation overhead.
- **Reliability:** Strict `service_healthy` conditions in `docker-compose.yml` prevent race conditions during cold boots. 
