# DevOps Assignment: End-to-End CI/CD Pipeline with Monitoring

## Overview

This assignment demonstrates a **complete DevOps workflow** for deploying a containerized web application using:

* **CI/CD pipelines**
* **Docker containerization**
* **Infrastructure as Code (Terraform)**
* **Monitoring with Prometheus & Grafana**

* **I have attached screenshots of the live demo**

---

# Architecture

```
User → EC2 (Elastic IP)
          ├── App Container (Node.js)
          ├── Prometheus (Metrics Collection)
          └── Grafana (Visualization)
```

---

# Repository Structure

```
repo/
├── node-app/              # Application source code
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── index.js
│   └── package.json
│
├── terraform/             # Infrastructure as Code
│   ├── main.tf
│   ├── backend.tf
│   └── outputs.tf
|   └── providers.tf
│
├── .github/workflows/     # CI/CD Pipelines
│   ├── infra.yml
│   └── app.yml
│
└── README.md
```

---

# 1. Infrastructure as Code (Terraform)

## Objective

Provision a cloud environment to host the application.

## Resources Created

* EC2 instance (Ubuntu)
* Security Group:

  * Port 22 (SSH)
  * Port 80 (App)
  * Port 9090 (Prometheus)
  * Port 3001 (Grafana)
* Elastic IP (static public IP)

## Key Design Decisions

* **Elastic IP** ensures stable endpoint for CI/CD deployment
* **User data script** installs Docker automatically
* **Security groups** explicitly expose required ports

## How to Run

```bash
need to configure AWS Credentials
cd terraform
terraform init (used an S3 as a remote backend to store state file securely)
terraform plan
terraform apply
```

## Output

```bash
terraform output public_ip
```

---

# 2. CI/CD Pipelines

## Design Approach

Separated pipelines into:

| Pipeline       | Purpose                    |
| -------------- | -------------------------- |
| Infra Pipeline | Provision infrastructure   |
| App Pipeline   | Build & deploy application |

This ensures:

* Independent lifecycle management
* Faster deployments
* Reduced risk

---

## App Pipeline Flow

```
Code Push →
  Build Docker Image →
  Push to DockerHub →
  SSH into EC2 →
  Deploy Containers
```

---

## Steps Included

1. **Build Docker Image**
2. **Push to DockerHub**
3. **SSH into EC2**
   - You need a key pair, which you need to create before creating the instance
5. **Run containers**
   <img width="1174" height="76" alt="image" src="https://github.com/user-attachments/assets/64465a2c-878f-4221-bd3c-e724e48170a4" />


---

## Required Secrets(need to be created as Repo Secrets)

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DOCKER_USERNAME
DOCKER_PASSWORD
EC2_IP
EC2_SSH_KEY
```

---

#  3. Docker Setup

## Multi-stage Dockerfile

* Uses lightweight base image (`node:20-slim`)
* Installs only production dependencies
* Runs app as non-root user

## Best Practices Used

* `.dockerignore` to reduce build context
* `npm ci` for reproducible builds
* Minimal image size

---

# 4. Application Deployment

## Deployment Strategy

* SSH-based deployment from the pipeline

### Key Commands:

```bash
docker pull <image>
docker stop app || true
docker rm app || true
docker run -d -p 80:3000 --name app <image>
```

---

# 5. Monitoring Setup

## Architecture

```
App (/metrics) → Prometheus → Grafana
```

---

## Application Metrics

* Integrated using `prom-client`
* Exposed endpoint:

```
/metrics
```

---

## Prometheus Configuration

Prometheus is configured dynamically during deployment:

```yaml
scrape_configs:
  - job_name: "app"
    static_configs:
      - targets: ["localhost:80"]
```

## Important Note

Prometheus runs with **host networking** to access the application:

```
--network host
```

---

## Grafana Setup

* Runs as a container
* Connected to Prometheus as data source

### Default Credentials

```
Username: admin
Password: admin
```

---

# Access URLs

Application: http://<EC2-IP>
<img width="985" height="481" alt="4→@ANutsecue 52-207 19R544crolda1Afromanow-@htosnowtimezcneabrowser" src="https://github.com/user-attachments/assets/dc6214b6-26fd-449d-864e-499adfdf5b94" />

Prometheus: http://<EC2-IP>:9090
<img width="1438" height="617" alt="Prometheus" src="https://github.com/user-attachments/assets/78809e26-5b78-4ff7-8f2e-5d50fadb564d" />

Grafana: http://<EC2-IP>:3001
<img width="1419" height="710" alt="Pasted Graphic 1" src="https://github.com/user-attachments/assets/77c4d8bd-e231-46d2-8eaf-e11e257d0da8" />

---

# Key Design Decisions

### 1. Separation of Pipelines

Infra and application pipelines are independent for better maintainability.

### 2. Elastic IP

Ensures a stable endpoint for CI/CD and user access.

### 3. Idempotent Deployment

Containers are safely recreated without breaking the system.

### 4. Monitoring Integration

Application metrics are exposed and scraped, enabling real observability.

---

# Limitations

* No HTTPS (HTTP only)
* No persistent storage for Prometheus
* No auto-scaling
* Uses SSH instead of more secure alternatives

---

# Future Improvements

* Replace SSH with SSM (no key management)
* Add Load Balancer + HTTPS
* Use Docker Compose or Kubernetes
* Add alerting in Prometheus
* Persist monitoring data using volumes
* Implement CI/CD approvals and environments

---

# Conclusion

This project demonstrates:

* End-to-end DevOps workflow
* Infrastructure provisioning using Terraform
* Automated CI/CD pipelines
* Containerized application deployment
* Real monitoring with Prometheus and Grafana
