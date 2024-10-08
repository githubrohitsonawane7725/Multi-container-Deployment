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
version: "3.8"
services:
    mongodb:
      container_name: mongo
      image: mongo:latest
      ports:
        - "27017:27017"

    backend:
      container_name: backend
      image: backend:v1
      build: ./techdome-backend
      environment:
          - DB=mongodb+srv://rohit:rohit123@rohit.cskvl.mongodb.net/findjob_DB
          - JWT_SECRET=saptsagare2020
          - PORT=5000
      ports:
        - "5000:5000"
      depends_on:
        - mongodb      

    frontend:
      container_name: frontend
      image: frontend:v1
      build: ./frontend
      ports:
        - "3000:3000"
      depends_on:
        - backend      


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

frontend-deployment.yml:
```
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: multi-container-app-deploymeny-frontend
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: NodePort
  ports:
    - port: 3000
      nodePort: 30001
  selector:
    app: frontend
```

Backend-deployment.yml:
```
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
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
          image: multi-container-app-deploymeny-backend
          ports:
            - containerPort: 5000
          env:
            - name: DB
              value: "mongodb+srv://saptsagare2020:Shubham2579@cluster0.vaitvxh.mongodb.net/jobfinde_DB"
            - name: JWT_SECRET
              value: "saptsagare2020"
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  ports:
    - port: 5000
  selector:
    app: backend
  type: ClusterIP

```
Backend-deployment.yml:
```
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
spec:
  selector:
    matchLabels:
      app: mongo
  replicas: 1
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongo
          image: mongo:6.0.17
          ports:
            - containerPort: 27017
          env:
            - name: MONGO_INITDB_ROOT_USERNAME
              value: "root"
            - name: MONGO_INITDB_ROOT_PASSWORD
              value: "password"
---
apiVersion: v1
kind: Service
metadata:
  name: mongo
spec:
  ports:
    - port: 27017
  selector:
    app: mongo
  type: ClusterIP

```
### Apply the manifests using kubectl:

```
kubectl apply -f frontend-deployment.yml

kubectl apply -f backend-deployment.yml

kubectl apply -f mongo-deployment.yml
```

### Expose the services:
```
kubectl expose deployment frontend --type=NodePort --port=3000

kubectl expose deployment backend --type=NodePort --port=5000

kubectl expose deployment mongo --type=NodePort --port=27071
```

### Verify the Deployments and Services
 Check  the pods are up and running:
```
 kubectl get pods
```
### Verify the services:
```
kubectl get svc

```

### Expose Frontend via NodePort or LoadBalancer (if needed):
For NodePort
```
kind: Service
apiVersion: v1
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  type: NodePort
  ports:
    - port: 80              # The port exposed to external users
      targetPort: 3000       # The port your frontend container listens on
      nodePort: 30001        # NodePort (between 30000-32767)
```
Apply the service using

kubectl apply -f frontend-service.yml
Access the frontend
minikube service frontend-service



## 7. Screenshots:

### 1. Frontend running in the browser (http://localhost:3000):

![image](https://github.com/user-attachments/assets/9a598f0d-feaf-4b75-bbdd-7a605784c517)


### 2. Dockercompose output running :

![image](https://github.com/user-attachments/assets/56dcfee0-9acd-4ccb-a29a-3bab796bdca9))

### 3. Docker Compose Successfully build the Docker images and container:
![image](https://github.com/user-attachments/assets/ee9aee30-0357-4aa1-a381-f0a15fa2d6e2)

### 3. Successfully created Kubernetes:

![image](https://github.com/user-attachments/assets/08d8628a-0c0a-463c-9fc5-b4b1f7e48bb2)


