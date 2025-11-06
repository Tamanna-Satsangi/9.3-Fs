# 9.3-Fs - Full Stack AWS Deployment with Load Balancing

## Practice 3 - Cloud Deployment

### Overview
This project demonstrates deploying a full stack application (React frontend + Node.js/Express backend) to AWS with Application Load Balancer for scalability and high availability.

### Repository Structure
```
9.3-Fs/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   └── src/
│       └── App.js
└── README.md
```

## Quick Start - Local Development

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

## AWS Deployment Guide

### Prerequisites
- AWS Account
- AWS CLI installed and configured
- EC2 Key Pair created

### Step 1: Launch EC2 Instances

1. **Launch Backend Instances** (2 instances for load balancing)
   - AMI: Amazon Linux 2 or Ubuntu
   - Instance Type: t2.micro (free tier)
   - Security Group: Allow ports 22 (SSH), 5000 (Backend)
   - Tag instances: Backend-1, Backend-2

2. **Launch Frontend Instance**
   - Same configuration as backend
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 3000
   - Tag: Frontend

### Step 2: Setup Backend Instances

SSH into each backend instance and run:

```bash
# Update system
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
# OR for Ubuntu:
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository
git clone https://github.com/Tamanna-Satsangi/9.3-Fs.git
cd 9.3-Fs/backend

# Install dependencies
npm install

# Set environment variable (different for each instance)
echo "INSTANCE_ID=backend-1" | sudo tee /etc/environment
# For second instance: INSTANCE_ID=backend-2

# Start server (use PM2 for production)
sudo npm install -g pm2
PORT=5000 INSTANCE_ID=backend-1 pm2 start server.js
pm2 startup
pm2 save
```

### Step 3: Create Application Load Balancer

1. **Create Target Group**
   - Target type: Instances
   - Protocol: HTTP, Port: 5000
   - Health check path: `/api/health`
   - Register both backend instances

2. **Create Application Load Balancer**
   - Scheme: Internet-facing
   - IP address type: IPv4
   - Listeners: HTTP:80
   - Availability Zones: Select at least 2
   - Security Group: Allow HTTP (80) and HTTPS (443)
   - Default action: Forward to target group

3. **Note the ALB DNS name** (e.g., `my-alb-123456789.us-east-1.elb.amazonaws.com`)

### Step 4: Setup Frontend Instance

SSH into frontend instance:

```bash
# Install Node.js (same as backend)

# Clone repository
git clone https://github.com/Tamanna-Satsangi/9.3-Fs.git
cd 9.3-Fs/frontend

# Create .env file with ALB endpoint
echo "REACT_APP_API_URL=http://YOUR-ALB-DNS-NAME" > .env

# Install dependencies
npm install

# Build for production
npm run build

# Install and configure nginx
sudo yum install -y nginx
# OR
sudo apt install -y nginx

# Copy build files
sudo cp -r build/* /usr/share/nginx/html/

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 5: Configure Security Groups

1. **Backend Security Group**
   - Inbound: 
     - SSH (22) from your IP
     - Custom TCP (5000) from ALB security group

2. **ALB Security Group**
   - Inbound:
     - HTTP (80) from 0.0.0.0/0
     - HTTPS (443) from 0.0.0.0/0

3. **Frontend Security Group**
   - Inbound:
     - SSH (22) from your IP
     - HTTP (80) from 0.0.0.0/0

### Step 6: Test Deployment

1. Access frontend: `http://FRONTEND-EC2-PUBLIC-IP`
2. Verify load balancing: Refresh page multiple times, check "Instance" field alternates
3. Test health check: `http://ALB-DNS/api/health`

## Architecture

```
[Users] → [Frontend EC2] → [Application Load Balancer] → [Backend EC2-1]
                                                        → [Backend EC2-2]
```

## Features
- ✅ React frontend with real-time backend communication
- ✅ Express backend with health check and data endpoints
- ✅ Load balancing across multiple backend instances
- ✅ Instance identification to verify load distribution
- ✅ Production-ready deployment with PM2 and Nginx

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/data` - Sample data endpoint

## Monitoring

```bash
# Check PM2 processes
pm2 list
pm2 logs

# Check nginx status
sudo systemctl status nginx

# Check ALB target health in AWS Console
```

## Troubleshooting

1. **Backend not responding**: Check security groups allow traffic on port 5000
2. **Load balancer health checks failing**: Verify `/api/health` endpoint works
3. **Frontend can't connect to backend**: Verify REACT_APP_API_URL in .env
4. **CORS errors**: Ensure backend has CORS middleware configured

## Cost Considerations
- Use t2.micro instances (free tier eligible)
- ALB costs ~$16/month + data transfer
- Stop instances when not in use

## Cleanup
To avoid charges:
1. Delete Load Balancer
2. Delete Target Groups
3. Terminate EC2 instances
4. Delete Security Groups

## Author
Tamanna Satsangi

## License
MIT
