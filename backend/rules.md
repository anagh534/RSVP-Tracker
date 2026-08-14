# RSVP Tracker Backend Rules and Guidelines

This file outlines the project structure and rules for the backend.

## Project Stack
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize

## Project Structure
- `config/` - Contains configuration files.
- `models/` - Contains Sequelize models. Each table should have its own model file. Secure, correct, and normalized MySQL schema with proper foreign keys and constraints.
- `services/` - Contains complex business logic, separating it from the controllers. Coordinate data transactions here.
- `controllers/` - Contains basic HTTP handling and delegates all logic to the `services/` layer.
- `routes/` - Contains Express route definitions.
- `middleware/` - Contains custom Express middleware (e.g., JWT authentication, error handling).
- `index.js` - The main entry point for the application.

## Development Rules
1. **Business Logic**: Working business logic with server-side enforcement (not just UI-level checks). Use the services folder for data transactions.
2. **Code Quality**: Clean, readable Node.js and Next.js code with sensible folder structure.
3. **Authentication**: Correct JWT auth implementation - hashing, token verification, protected routes.
4. **Docker**: Single-command Docker boot that works cold, with no manual setup steps (`docker compose up`).
5. **API Design**: Overall API design - REST conventions, proper status codes, error handling.
6. **Database Operations**: Always use Sequelize ORM. Use proper relationships. Wait for DB to be ready in Docker.
7. **Environment Variables**: Use `process.env`. Never hardcode sensitive information.
1. **Modular Routing**: Always use `express.Router()` in the `routes/` directory and mount them in `index.js`.
2. **Environment Variables**: Never hardcode sensitive information (DB credentials, API keys, secrets). Use `process.env` and the `.env` file. The start scripts use Node's built-in `--env-file=.env` flag.
3. **Database Operations**: Always use Sequelize ORM for database queries unless a raw query is strictly necessary for performance reasons.
4. **Error Handling**: Use `try...catch` blocks in controllers. Ensure proper HTTP status codes are returned (e.g., 200 for OK, 201 for Created, 400 for Bad Request, 404 for Not Found, 500 for Internal Server Error).
5. **JSON Responses**: Keep API responses consistent. They should ideally return JSON objects.
6. **Relationships**: Define database relationships (hasMany, belongsTo, etc.) clearly in the model definitions or in `models/index.js` after models are loaded.
