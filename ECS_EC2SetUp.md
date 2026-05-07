# Backend Deployment Guide

This guide documents how the CloudComputingProject FastAPI backend is deployed to AWS using two independent architectures: **ECS (Fargate)** and **EC2**.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [ECS Deployment (Fargate + ALB)](#ecs-deployment-fargate--alb)
4. [EC2 Deployment (Ubuntu + nginx + systemd)](#ec2-deployment-ubuntu--nginx--systemd)
5. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The backend is a FastAPI application packaged as a Docker container. It exposes RESTful endpoints for login, music browsing, and subscription management. Data is stored in DynamoDB (`ap-southeast-2`) and artist images in S3.

Two deployment targets are supported:

- **ECS (Fargate)** — Serverless containers behind an Application Load Balancer
- **EC2** — Ubuntu virtual machine running gunicorn behind nginx, accessed via an Elastic IP

Both deployments serve the same FastAPI image/codebase and connect to the same backend AWS resources.

---

## Prerequisites

- AWS Academy lab session active
- AWS CLI installed and configured (`aws configure`)
- Docker Desktop installed (for ECS only)
- Project repo cloned locally

Add your AWS Academy session token after running `aws configure`:

```bash
aws configure set aws_session_token <YOUR_SESSION_TOKEN>
```

Verify access:

```bash
aws sts get-caller-identity --query Account --output text
```

---

## ECS Deployment (Fargate + ALB)

### Step 1: Build the Docker Image

From the project root:

```bash
docker build --platform linux/amd64 -t cloudcomputing-app .
```

> **Note:** `--platform linux/amd64` is required for Apple Silicon Macs to ensure compatibility with Fargate (which runs on x86_64).

### Step 2: Push the Image to Amazon ECR

```bash
# Create the ECR repository
aws ecr create-repository --repository-name cloudcomputing-app --region us-east-1

# Authenticate Docker with ECR
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag cloudcomputing-app:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/cloudcomputing-app:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/cloudcomputing-app:latest
```

### Step 3: Create the ECS Cluster

In the AWS Console:

1. Navigate to **ECS** → **Clusters** → **Create Cluster**
2. Cluster name: `cloudcomputing-cluster`
3. Infrastructure: **AWS Fargate** (serverless)
4. Click **Create**

### Step 4: Create the Task Definition

1. Go to **Task Definitions** → **Create new task definition**
2. Family name: `cloudcomputing-task`
3. Launch type: **AWS Fargate**
4. Operating system: **Linux/X86_64**
5. CPU: `1 vCPU`, Memory: `3 GB`
6. Task Role: `LabRole`
7. Task Execution Role: `LabRole`
8. Container details:
   - Name: `cloudcomputing-app`
   - Image URI: `<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/cloudcomputing-app:latest`
   - Container port: `8000`
   - Protocol: `TCP`
9. Click **Create**

### Step 5: Create the Application Load Balancer

In the EC2 console:

1. **Load Balancers** → **Create Load Balancer** → **Application Load Balancer**
2. Name: `cloudcomputing-alb`
3. Scheme: **Internet-facing**
4. Availability Zones: select at least 2 (`us-east-1a`, `us-east-1b`, `us-east-1e`)
5. Security group: create `cloudcomputing-alb-sg`
   - Inbound: HTTP (80) from `0.0.0.0/0`
   - Outbound: All traffic to `0.0.0.0/0`
6. Target Group:
   - Type: **IP addresses**
   - Name: `cloudcomputing-tg`
   - Protocol/Port: HTTP / `8000`
   - Health check path: `/`
7. Listener: HTTP on port 80, forwarding to `cloudcomputing-tg`

### Step 6: Create the ECS Service

1. Open the cluster → **Create Service**
2. Launch type: **Fargate**
3. Task definition: `cloudcomputing-task`
4. Service name: `cloudcomputing-service`
5. Desired tasks: `1`
6. Networking:
   - Use the **same subnets** as the ALB (`us-east-1a`, `us-east-1b`, `us-east-1e`)
   - Security group: default VPC security group
   - Auto-assign public IP: **enabled**
7. Load balancing:
   - Type: Application Load Balancer
   - Choose `cloudcomputing-alb`
   - Container: `cloudcomputing-app:8000`
   - Target group: `cloudcomputing-tg`
   - Health check grace period: `60` seconds
8. Click **Create**

### Step 7: Configure the Default VPC Security Group

The ECS task uses the default VPC security group. Add this inbound rule so the ALB can reach the container:

- Type: **Custom TCP**
- Port: `8000`
- Source: `0.0.0.0/0`

### Step 8: Verify

Wait 2–5 minutes for the task to start and pass health checks. Then access:

```
http://cloudcomputing-alb-<id>.us-east-1.elb.amazonaws.com
```

Expected response:

```json
{"message": "FastAPI server is running!"}
```

---

## EC2 Deployment (Ubuntu + nginx + systemd)

### Step 1: Launch the EC2 Instance

1. **EC2** → **Launch Instance**
2. Name: `cloudcomputing-ec2`
3. AMI: **Ubuntu Server 22.04 LTS**
4. Instance type: `t2.micro`
5. Key pair: create or select an existing one (download the `.pem` file)
6. Security group:
   - SSH (22) from your IP
   - HTTP (80) from `0.0.0.0/0`
7. Click **Launch instance**

### Step 2: Allocate and Associate an Elastic IP

1. **EC2** → **Elastic IPs** → **Allocate Elastic IP address**
2. Select the new EIP → **Actions** → **Associate Elastic IP address**
3. Choose your EC2 instance and associate

The EIP gives the instance a fixed public IP that survives restarts.

### Step 3: SSH and Install Dependencies

```bash
ssh -i your-key.pem ubuntu@<ELASTIC_IP>

sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv nginx -y
```

### Step 4: Set Up the Application

```bash
mkdir app && cd app
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn gunicorn boto3 loguru requests
```

Copy the project files into `~/app` (via `scp` or `git clone`).

### Step 5: Create the systemd Service

```bash
sudo nano /etc/systemd/system/fastapi.service
```

Paste:

```ini
[Unit]
Description=FastAPI app
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/app
Environment="PATH=/home/ubuntu/app/venv/bin"
ExecStart=/home/ubuntu/app/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker server.app:app

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl start fastapi
sudo systemctl enable fastapi
```

### Step 6: Configure nginx as a Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/fastapi
```

Paste:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/fastapi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Verify

Access:

```
http://<ELASTIC_IP>
```

Expected response:

```json
{"message": "FastAPI server is running!"}
```

---

## Troubleshooting

**ECS task stuck in restart loop / 503 from ALB**
- Check the ECS task **Logs** tab in CloudWatch
- Verify the ECS service uses the **same subnets** as the ALB
- Ensure the default VPC security group allows inbound TCP 8000

**EC2 returns 502 Bad Gateway**
- Check `sudo systemctl status fastapi` — make sure the service is active
- Check `sudo journalctl -u fastapi -n 50` for Python errors
- Verify nginx config with `sudo nginx -t`

**Docker build fails on requirements.txt**
- Ensure `requirements.txt` is encoded as **UTF-8** (not UTF-16)
- Remove any Windows-only packages (`pyreadline3`, `win32_setctime`)