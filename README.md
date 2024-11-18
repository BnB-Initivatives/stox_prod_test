# DOCKER NOTES:

## Building and running your application

When you're ready, start your application by running:
`docker compose up --build`

The build of docker containers is based on `docker-compose.yml`, hence, this will create 3 containers for 3 services of our web app

- stoX-frontend
- stoX-backend
- stoX-database

If you want to delete the existing images
`docker-compose down -v `

Check out stoX-backend at http://localhost:8000/docs and stoX-frontend at http://localhost:3000 (If the React page loads with a message like **REACT TEST BACKEND CONNECTION: Healthy** then frontend and backend is connected successfully).

## Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

# TODO:

### React Frontend

- [ ]
- [ ]

### FastAPI Backend

- [x] Configure FastAPI project
- [x] Set up database models for RBAC
- [x] Implement CRUD operations, routers for RBAC
- [x] Integrate authentication and authorization (JWT)
- [ ] Integrate authorization (RBAC)
- [ ] Check how to update password for user
- [ ] Create all data models
- [ ] Design all API routes
- [ ] Write unit tests for endpoints
- [x] Set up database connection

### Deployment

- [x] Set up repository structure
- [x] Set up Docker files and connection between 3 containers (backend, frontend, database)
- [x] Set up VPS
- [x] Set up HTTPS
- [x] Set up SSH hardning
- [ ] Set up traefick
- [x] Set up CI/CD
- [ ] Set up watchtower
- [ ] Configure production environment
- [ ] Test deployment process

---

### Additional Notes

- [ ] Review and refine project documentation.

## RBAC IDEAS

1. User Router: Manages user-related operations, such as creating, reading, updating, and deleting users, as well as assigning roles and permissions to users.
2. Role Router: Handles CRUD operations for roles, allowing you to create, view, update, and delete roles within the system.
3. Permission Router: Manages CRUD operations for permissions, enabling the creation, reading, updating, and deletion of permissions associated with various roles.
4. Role-Permission Router: Manages the relationships between roles and permissions, allowing you to assign and revoke permissions from roles.
5. User-Role Router: Manages the relationships between users and roles, enabling you to assign or remove roles from users.
6. Authentication Router: Handles user authentication tasks, such as logging in and logging out, and managing authentication tokens (e.g., JWT).
7. Authorization Router: Manages checks and validations to ensure users have the necessary permissions to perform certain actions or access specific resources.
8. Audit Router: Tracks and logs user activities related to RBAC, allowing you to monitor changes made to users, roles, and permissions.
9. Settings Router: Manages global settings for the RBAC system, such as default roles and permissions, password policies, and user account settings.
