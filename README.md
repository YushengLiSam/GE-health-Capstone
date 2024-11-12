# GE-health-Capstone
This project sets up a full-stack application with a React frontend, a Flask API backend, and a MySQL database, all managed using Docker. The project is pre-configured with sample data, and each part can be accessed via mapped ports on your local machine.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Setup and Running the Project

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Ensure Port 3306 is Available

The project uses port `3306` for MySQL. If you already have MySQL running locally on this port, you need to stop it to avoid conflicts.

You can do this by running:

```bash
sudo pkill mysqld
```

This will stop the local MySQL service, freeing up port `3306` for Docker.

### 3. Build and Run the Project with Docker

To build and run the project, use Docker Compose with the following command:

```bash
docker-compose up --build
```

This command will:

- Build the Docker images for the frontend, backend, and MySQL database.
- Start the containers for the React frontend, Flask API, and MySQL database.
- Map the React frontend to port `3000`, Flask API to port `5002`, and MySQL to port `3306` on your localhost.

### 4. Stopping and Restarting the Project

To stop the project, run:

```bash
docker-compose down
```

If you need to rebuild and restart the project, repeat the `docker-compose up --build` command.

### Accessing the Application

- **React Frontend**: After starting the project, the React frontend will be accessible at `http://localhost:3000`.
- **Flask API**: The backend API will be accessible at `http://localhost:5002`.
- **MySQL Database**: MySQL will be available on port `3306`. You can connect to it with a MySQL client using the following credentials:

  - **Host**: `localhost`
  - **Port**: `3306`
  - **Username**: `annotation_user`
  - **Password**: `password`
  - **Database**: `annotations`

### Troubleshooting

- If you encounter issues with port conflicts, ensure that no other services are using ports `3000`, `5002`, or `3306`. You can stop the local MySQL service with:

  ```bash
  sudo pkill mysqld
  ```

- To reset the containers and remove any cached data, use:

  ```bash
  docker-compose down -v
  ```

  This will stop the containers and remove associated volumes, clearing out all stored data.

### Project Structure

- **ge-health/**: Contains the React frontend code.
- **backend/**: Contains the Flask API code.
- **docker-compose.yml**: Configuration file to define and run multi-container Docker applications.
- **README.md**: Project instructions and documentation.

---

With this setup, your project should be easy to deploy and manage in a Docker environment.