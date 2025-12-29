# Combined Pod & Deployment Manifest Summary

## File: sample-pod-clean.yaml
**Location:** `/Users/fci/Desktop/k8s-three-tier/End-to-End-Kubernetes-Three-Tier-DevSecOps-Project/Kubernetes-Manifests-file/sample-pod-clean.yaml`

**Total Lines:** 539 lines

---

## 📋 Contents Overview

### 1. **Pod - sample-app-pod**
   - Single pod manifest with full specifications
   - Includes ConfigMap, Secret, and EBS volume mounts
   - Complete container configuration with health checks
   - Security context and lifecycle hooks configured
   - **Status:** ✅ Included

### 2. **StorageClass - ebs-storage-class**
   - AWS EBS CSI provisioner (ebs.csi.aws.com)
   - gp3 volume type with 3000 IOPS and 125 MB/s throughput
   - Encryption enabled
   - Dynamic provisioning with WaitForFirstConsumer binding
   - **Status:** ✅ Included

### 3. **PersistentVolume (PV) - sample-app-pv**
   - Static EBS volume provisioning
   - 10Gi capacity with ReadWriteOnce access
   - Retain reclaim policy
   - EBS volume ID: `vol-xxxxxxxxx` (replace with actual ID)
   - **Status:** ✅ Included
   - **Note:** Update EBS volume ID before applying

### 4. **PersistentVolumeClaim (PVC) - sample-app-pvc**
   - Requests 10Gi from ebs-storage-class
   - Binds to available PV
   - ReadWriteOnce access mode
   - **Status:** ✅ Included

### 5. **Deployment - sample-app-deployment**
   - 3 replicas with RollingUpdate strategy
   - Full container specifications (matching Pod template)
   - All health checks (liveness & readiness probes)
   - Environment variables, resource limits
   - Security context and lifecycle hooks
   - Configuration volume mounts
   - **Status:** ✅ Included

### 6. **Service - sample-app-service**
   - ClusterIP type for internal access
   - Port 80 HTTP mapping
   - Selector: app: sample-app
   - **Status:** ✅ Included

### 7. **ConfigMap - app-config**
   - Database host: `mongodb://localhost:27017`
   - Database name: `sample_app_db`
   - App mode: `production`
   - **Status:** ✅ Included

### 8. **Secret - db-secret**
   - Base64 encoded credentials
   - Password: `cGFzc3dvcmQxMjM=` (password123)
   - Username: `YWRtaW4=` (admin)
   - **Status:** ✅ Included

### 9. **HorizontalPodAutoscaler (HPA) - sample-app-hpa**
   - Min replicas: 2, Max replicas: 10
   - CPU scaling at 70% utilization
   - Memory scaling at 80% utilization
   - Scale-up: 100% increase per 60 seconds
   - Scale-down: 50% decrease per 60 seconds
   - **Status:** ✅ Included

### 10. **NetworkPolicy - sample-app-network-policy**
   - Controls ingress/egress traffic
   - Allow from frontend pods on ports 80, 443
   - Allow from monitoring namespace on port 9090
   - Allow outbound to database pods on port 27017
   - Allow DNS traffic (port 53)
   - **Status:** ✅ Included

### 11. **NetworkPolicy - default-deny-all**
   - Restrictive baseline policy
   - Denies all ingress and egress by default
   - **Status:** ✅ Included

### 12. **NetworkPolicy - allow-from-ingress**
   - Allows traffic from ingress controllers
   - Allows traffic from nginx-ingress pods
   - **Status:** ✅ Included

---

## 🔄 Relationship Between Components

```
Pod (sample-app-pod)
├── Uses ConfigMap (app-config)
├── Uses Secret (db-secret)
├── Uses PVC (sample-app-pvc)
│   └── Bound to PV (sample-app-pv)
│       └── Uses StorageClass (ebs-storage-class)
│           └── EBS CSI Driver
└── Protected by NetworkPolicy

Deployment (sample-app-deployment)
├── 3 Replicas with same pod template
├── Uses ConfigMap (app-config)
├── Uses Secret (db-secret)
├── Scaled by HPA (sample-app-hpa)
├── Exposed by Service (sample-app-service)
└── Protected by NetworkPolicy
```

---

## 📦 Storage Architecture

```
StorageClass (ebs-storage-class)
    ↓
PV (sample-app-pv) ← 10Gi capacity
    ↓
PVC (sample-app-pvc) ← Requests 10Gi
    ↓
Pod/Deployment ← Mounts at /data
```

---

## 🚀 Deployment Instructions

### 1. **Update EBS Volume ID**
```bash
# Find your EBS volume in AWS EC2 console > Volumes
# Replace vol-xxxxxxxxx with actual volume ID in PV section
sed -i 's/vol-xxxxxxxxx/vol-YOUR_ACTUAL_ID/g' sample-pod-clean.yaml
```

### 2. **Apply Manifest**
```bash
kubectl apply -f sample-pod-clean.yaml
```

### 3. **Verify Resources**
```bash
# Check Pod
kubectl get pod sample-app-pod

# Check Deployment
kubectl get deployment sample-app-deployment

# Check PVC binding
kubectl get pvc sample-app-pvc

# Check Service
kubectl get svc sample-app-service

# Check HPA
kubectl get hpa sample-app-hpa

# Check NetworkPolicies
kubectl get networkpolicy
```

### 4. **Check Pod Details**
```bash
kubectl describe pod sample-app-pod
kubectl describe deployment sample-app-deployment
kubectl describe pvc sample-app-pvc
```

---

## ⚙️ Configuration Summary

| Component | Name | Type | Status |
|-----------|------|------|--------|
| Pod | sample-app-pod | v1/Pod | ✅ |
| Deployment | sample-app-deployment | apps/v1/Deployment | ✅ |
| Service | sample-app-service | v1/Service | ✅ |
| StorageClass | ebs-storage-class | storage.k8s.io/v1/StorageClass | ✅ |
| PersistentVolume | sample-app-pv | v1/PersistentVolume | ✅ |
| PersistentVolumeClaim | sample-app-pvc | v1/PersistentVolumeClaim | ✅ |
| ConfigMap | app-config | v1/ConfigMap | ✅ |
| Secret | db-secret | v1/Secret | ✅ |
| HPA | sample-app-hpa | autoscaling/v2/HorizontalPodAutoscaler | ✅ |
| NetworkPolicy 1 | sample-app-network-policy | networking.k8s.io/v1/NetworkPolicy | ✅ |
| NetworkPolicy 2 | default-deny-all | networking.k8s.io/v1/NetworkPolicy | ✅ |
| NetworkPolicy 3 | allow-from-ingress | networking.k8s.io/v1/NetworkPolicy | ✅ |

---

## 📝 Important Notes

1. **Pod vs Deployment:** The file contains BOTH:
   - `sample-app-pod`: Single standalone pod (for testing)
   - `sample-app-deployment`: Production-ready deployment (3 replicas)

2. **EBS Volume:**
   - Update `volumeID: vol-xxxxxxxxx` with your actual EBS volume ID
   - Volume must exist in AWS EC2
   - Must be in the same availability zone as your nodes

3. **Security:**
   - All containers run as non-root user (UID 1000)
   - Privilege escalation disabled
   - Network policies enforce zero-trust networking
   - Secrets are base64 encoded (update with production values)

4. **Scaling:**
   - HPA automatically scales deployment between 2-10 replicas
   - Based on CPU (70%) and memory (80%) utilization

5. **Health Checks:**
   - Liveness probe: checks `/health` endpoint every 20 seconds
   - Readiness probe: checks `/ready` endpoint every 10 seconds

6. **Storage:**
   - Persistent storage mounts at `/data`
   - Configuration mounts at `/etc/config`
   - Logs stored in `/var/log/app` (temporary, lost on pod restart)

---

## 🔒 Network Security

### Ingress Rules (Allowed incoming traffic):
- Frontend pods → ports 80, 443
- Monitoring namespace → port 9090
- IP range 10.0.0.0/8 → port 443

### Egress Rules (Allowed outgoing traffic):
- Database pods → port 27017 (MongoDB)
- All namespaces → port 53 (DNS)
- External services → ports 80, 443

---

This is a **production-ready** manifest combining Pod and Deployment with complete storage, networking, and scaling configurations! ✨
