# Container Image Pull Configuration Guide

## 📦 Current Configuration in Your Manifest

### **Image Location:**
```yaml
containers:
  - name: app-container
    image: nginx:latest
    imagePullPolicy: IfNotPresent
```

---

## 🔍 How Image Pull Works

### **Image Format Breakdown:**
```
image: [REGISTRY/]REPOSITORY[:TAG]
       └─ nginx:latest
          ├── REGISTRY: (omitted - defaults to Docker Hub)
          ├── REPOSITORY: nginx
          └── TAG: latest
```

### **Current Setup - Docker Hub Public Registry**
```
Full path would be: docker.io/library/nginx:latest
Simplified (what you have): nginx:latest

Registry: docker.io (Docker Hub)
Repository: library/nginx (official nginx image)
Tag: latest (most recent version)
```

---

## 📍 Image Pull Locations

### **1. Docker Hub (Current - Public Images)**
✅ **What you're using now**
- Free public registry
- Official images available
- Example: `nginx:latest`
- Pull path: `docker.io/library/nginx:latest`

### **2. Docker Hub (Private Images)**
- Requires Docker credentials
- Add `imagePullSecrets` to manifest

### **3. AWS ECR (Elastic Container Registry)**
- Private AWS registry
- Format: `123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0`

### **4. Google Container Registry (GCR)**
- Private GCP registry
- Format: `gcr.io/my-project/my-app:v1.0`

### **5. Azure Container Registry (ACR)**
- Private Azure registry
- Format: `myregistry.azurecr.io/my-app:v1.0`

### **6. Self-Hosted Registry**
- Private on-premises registry
- Format: `registry.company.com:5000/my-app:v1.0`

---

## 🎯 Image Pull Policy Explained

Your manifest uses:
```yaml
imagePullPolicy: IfNotPresent
```

### **Available Policies:**

| Policy | Behavior | Use Case |
|--------|----------|----------|
| **IfNotPresent** (current) | Pull only if not on node | Development/stable images |
| **Always** | Always pull latest | Production (ensures latest) |
| **Never** | Never pull (use local) | Offline/air-gapped clusters |

### **With `nginx:latest`:**
- Policy: `IfNotPresent`
- Behavior: If nginx:latest is NOT on the node, pull it from Docker Hub
- If already exists on node: Use existing copy

---

## 🔐 Pulling from Private Registries

### **To Pull from Private Registry, Add:**

```yaml
# Step 1: Create a Secret with registry credentials
apiVersion: v1
kind: Secret
metadata:
  name: registry-credentials
  namespace: default
type: kubernetes.io/dockercfg
data:
  .dockercfg: <base64-encoded-docker-config>

---
# Step 2: Reference in Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-app-deployment
spec:
  template:
    spec:
      # Add imagePullSecrets
      imagePullSecrets:
        - name: registry-credentials
      
      containers:
        - name: app-container
          image: my-registry.com/my-app:v1.0
          imagePullPolicy: Always
```

### **Create Credentials Secret (Example for ECR):**
```bash
# For AWS ECR
kubectl create secret docker-registry ecr-secret \
  --docker-server=123456789.dkr.ecr.us-east-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region us-east-1) \
  --docker-email=not@used.com
```

---

## 📋 Common Image Registry Examples

### **Public Images (No Credentials Needed)**
```yaml
# Docker Hub Official Images
image: nginx:latest
image: postgres:15
image: redis:7
image: python:3.11

# GitHub Container Registry
image: ghcr.io/owner/repo:latest

# Kubernetes Community Images
image: registry.k8s.io/kube-apiserver:v1.28.0
```

### **Private Images (Credentials Needed)**
```yaml
# AWS ECR
image: 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0

# GCP GCR
image: gcr.io/my-project/my-app:latest

# Azure ACR
image: myregistry.azurecr.io/my-app:v1.0

# Docker Hub Private
image: docker.io/myusername/my-private-app:v1.0

# Self-hosted
image: registry.company.com:5000/my-app:v1.0
```

---

## 🚀 How to Change Image Source

### **Option 1: Use Different Public Image (No Changes Needed)**
```yaml
# From nginx
image: nginx:latest

# To Apache
image: httpd:latest

# To Custom Public Image
image: ghcr.io/owner/my-app:v1.0
```

### **Option 2: Use Private Registry (AWS ECR Example)**

**Step 1:** Create AWS ECR repository
```bash
aws ecr create-repository --repository-name my-app --region us-east-1
```

**Step 2:** Push image to ECR
```bash
docker tag my-app:v1.0 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0
```

**Step 3:** Update manifest
```yaml
# Create secret
imagePullSecrets:
  - name: ecr-credentials

# Update image
image: 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0
imagePullPolicy: Always
```

---

## 📊 Image Pull Flow Diagram

```
┌─────────────────────────────────────────┐
│  Kubernetes Pod Starts                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Check imagePullPolicy                  │
│  (Always/IfNotPresent/Never)            │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌─────────────┐
        │ Is image on │
        │   node?     │
        └────┬────┬───┘
             │    │
        Yes  │    │  No
             │    │
             ▼    ▼
     ┌──────────┐ ┌─────────────────────────┐
     │Use Local │ │Need Registry Credentials?
     │  Copy    │ └──────┬──────────┬───────┘
     └──────────┘        │          │
                    Yes  │          │  No
                         │          │
                    ┌────▼────┐  ┌──▼────────┐
                    │Pull with │  │Pull from  │
                    │imagePull-│  │Public     │
                    │Secrets   │  │Registry   │
                    └────┬─────┘  └──┬────────┘
                         │           │
                         └─────┬─────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Container Created    │
                    │ with Image           │
                    └──────────────────────┘
```

---

## ⚙️ Your Current Setup Summary

| Configuration | Value | Details |
|---------------|-------|---------|
| **Image** | nginx:latest | Official nginx from Docker Hub |
| **Registry** | docker.io | Docker Hub (public) |
| **Image Pull Policy** | IfNotPresent | Only pull if not on node |
| **Credentials** | None | Public image, no auth needed |
| **Full Path** | docker.io/library/nginx:latest | Explicit full path |

---

## ✅ Next Steps

### **If Using Docker Hub Public Images:**
- ✅ Your current setup works fine
- No changes needed
- Images pulled automatically from Docker Hub

### **If Using Private Registry:**
1. Create image pull secret with credentials
2. Add `imagePullSecrets` to deployment template
3. Update image path to your registry
4. Change `imagePullPolicy` to `Always`

### **If Using AWS/GCP/Azure:**
1. Push image to your cloud registry (ECR/GCR/ACR)
2. Create authentication secret
3. Update image path
4. Deploy manifest

---

## 🔗 Related Resources

- **Docker Hub:** https://hub.docker.com (search for images)
- **Image Pull Secrets:** https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
- **AWS ECR:** https://docs.aws.amazon.com/ecr/
- **GCP GCR:** https://cloud.google.com/container-registry
- **Azure ACR:** https://azure.microsoft.com/services/container-registry/

---

**TL;DR:** Your image (`nginx:latest`) is pulled from **Docker Hub's public registry** automatically when the pod starts. No credentials needed!
