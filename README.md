# Multi-Container-Application-Deployment with Docker Compose and Kubernetes

## 1. Overview

This document provides an overview of the architecture, deployment strategy, and step-by-step instructions for building, deploying, and managing a multi-container application. The application includes a frontend service, a backend service, and a database, all deployed using Docker Compose and Kubernetes on a local Kubernetes cluster (Minikube or Docker).

- **Frontend**: React application
- **Backend**:  Node.js API
- **Database**: MongoDB 

The deployment is managed using Docker Compose for local development. The application demonstrates container orchestration, container networking, and dependency management across services.


## 2.Architecture Overview

The architecture is based on a multi-container application consisting of the following services:

1. **Frontend** (React app): This container serves the UI and interacts with the backend via RESTful APIs.
                              served via port 3000.

2. **Backend** (Node.js app): The backend container handles the application logic and communicates with the database to serve the required data.
                              served via port 5000.

3. **Database** (MongoDB): The database container stores persistent data for the application, such as user information and transactions
                             running on port 27017.


## Architecture Diagram:

![image](https://github.com/user-attachments/assets/bdfa6c1e-0a9c-4a15-af3c-243489eeee5b)


## 3. Deployment Strategy

### Local Development: Docker Compose

For local development, we use Docker Compose to run all the containers on a single network, enabling communication between the frontend, backend, and database.

- Frontend connects to the backend API.
- Backend interacts with the database.

### Production: Kubernetes

In a production environment, the application is deployed to a Kubernetes cluster (Minikube) with services managed via Kubernetes deployment manifests.

## 4. Docker Compose Configuration

In the root directory of the project, create a `docker-compose.yml` file. This file defines the services for Frontend, Backend, and Database, ensuring they are networked together.

### Directory Structure:
```bash
multi-container-app/
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   └── ...
├── frontend/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
```


docker-compose.yml file

```
version: '3'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app-network
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB=mongodb+srv://saptsagare2020:Shubham2579@cluster0.vaitvxh.mongodb.net/jobfinde_DB
      - JWT_SECRET=saptsagare2020
    depends_on:
      - db
    networks:
      - app-network
  
  db:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: mydatabase
    ports:
      - "27017:27017"
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 5

networks:
  app-network:
    driver: bridge

volumes:
  mongo-data:


```

## 5. Building and Deploying

### Step-by-Step Instructions

### 1. Clone the Repositories:

Clone both the frontend and backend repositories into the appropriate directories.

``` git clone https://github.com/Anand-1432/Techdome-frontend ```

``` git clone https://github.com/Anand-1432/Techdome-backend ```

### 2. Create a Dockerfile for each frontend as well as for backend here`s dockerfiles for each frontend and backend

Dockerfile for Frontend:
```
# Official node image 
FROM node:16-alpine

# working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install


# Copy the rest of the application code
COPY . .


#start the application
CMD ["npm", "start"]


# Expose the frontend port
EXPOSE 3000
```

Dockerfile for Backend:

```
#Official Node.js image
FROM node:16-alpine


# Working directory  
WORKDIR /app


# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend application
COPY . .


# Start the application
CMD ["npm", "start"]

# Expose the backend port
EXPOSE 5000
```

Database Container (MOngoDB Atlas):

* I used MongoDB Atlas, which I defined in the docker-compose.yml file.
  
### 2. Build and Run Containers:

Run the following command to build and start all services using Docker Compose:

``` docker-compose up --build ```

This command will:

* Build the Docker images for the frontend and backend from their respective Dockerfiles.
* Start the MongoDB database.
* Run the containers on a single network.

  ### 3. Access the Application:

* Frontend: Visit ```http://localhost:3000``` in your browser to access the React frontend.
* Backend: Visit ```http://localhost:5000``` for the backend API.
* Database: The MongoDB database will run internally and is accessible via the backend.

### 4. Stopping the Application:
To stop all services, use:

```docker-compose down```

## 6. Kubernetes Deployment 

To deploy the application to a local Kubernetes cluster using Minikube, follow these steps:

### 1. Start Minikube:

``` minikube start ```

### 2. Apply Kubernetes Manifests:

backend-deployment.yml:
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: backend-image
        ports:
        - containerPort: 5000
```

### Apply the manifests using kubectl:

```
kubectl apply -f backend-deployment.yml

kubectl apply -f frontend-deployment.yml

kubectl apply -f db-deployment.yml
```

### Expose the services:
```
kubectl expose deployment frontend --type=NodePort --port=3000

kubectl expose deployment backend --type=NodePort --port=5000
```


## 7. Screenshots:

### 1. Frontend running in the browser (http://localhost:3000):

![image](https://github.com/user-attachments/assets/4f020633-fa1b-49eb-8cef-c4465b04b891)


### 2. Database connection with health checkup:

![image](https://github.com/user-attachments/assets/e702dc57-cc25-43ac-9667-daf008554fb9)

### 3. Docker Compose Output:
![image](https://github.com/user-attachments/assets/1e054408-3a69-4a72-8f16-feb396c305e1)






