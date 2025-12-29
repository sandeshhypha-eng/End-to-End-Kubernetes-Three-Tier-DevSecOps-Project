# 🚀 Complete Kubernetes YAML & Manifest Training Guide

> **Master Kubernetes Configuration from Absolute Beginner to Advanced**

---

## 📋 Quick Navigation

- [Part 1: YAML Fundamentals](#part-1-yaml-fundamentals)
- [Part 2: Manifest Basics](#part-2-manifest-basics)
- [Part 3: Workload Resources](#part-3-workload-resources)
- [Part 4: Networking Resources](#part-4-networking-resources)
- [Part 5: Configuration & Storage](#part-5-configuration-storage)
- [Part 6: Advanced Concepts](#part-6-advanced-concepts)
- [Part 7: Interview Guide](#part-7-interview-guide)
- [Quick Reference](#quick-reference)

---

# PART 1: YAML FUNDAMENTALS

## What is YAML?

**YAML** = "YAML Ain't Markup Language"

A human-friendly data format that Kubernetes uses for all configurations.

### Why Kubernetes Chose YAML

| Reason | Benefit |
|--------|---------|
| **Human-readable** | Easy to understand at a glance |
| **Minimal syntax** | Less clutter than JSON/XML |
| **Hierarchical** | Supports nested structures perfectly |
| **Version-control friendly** | Easy to track changes in Git |
| **Language-agnostic** | Works with any programming language |

---

## YAML Syntax Rules

### ✅ Rule 1: Indentation (CRITICAL!)

YAML uses **spaces** (not tabs) to show structure. Standard is **2 spaces** per level.

```yaml
# ✅ CORRECT - 2 spaces per level
root:
  level1:
    level2: value
    another: data
    
# ❌ WRONG - Tabs will break!
root:
	level1: value  # This tab character will cause error

# ❌ WRONG - Inconsistent spacing
root:
 child1: value   # 1 space
  child2: value  # 2 spaces - MIXING BREAKS IT!
```

**Golden Rule:** Always use 2 spaces. Set your editor to convert tabs to spaces!

---

### ✅ Rule 2: Key-Value Pairs

Basic format: `key: value` (colon, then space)

```yaml
# ✅ CORRECT
name: Alice
age: 30
email: alice@example.com
is_active: true

# ❌ WRONG - Missing space after colon
name:"Alice"
age:30

# ❌ WRONG - No colon
name Alice
```

---

### ✅ Rule 3: Comments

Anything after `#` is ignored.

```yaml
# This is a comment
name: Alice     # Inline comment
# Comments are great for documentation!
port: 8080      # Application port
```

---

### ✅ Rule 4: Lists (Arrays)

Use dashes (`-`) for list items, aligned at same indentation.

```yaml
# ✅ Simple list
fruits:
  - apple
  - banana
  - orange

# ✅ List of objects
students:
  - name: Alice
    age: 25
    grade: A
  - name: Bob
    age: 26
    grade: B

# ✅ Inline list (compact)
colors: [red, green, blue]
```

---

### ✅ Rule 5: Nested Objects

Objects contain other objects through indentation.

```yaml
company:
  name: "TechCorp"
  headquarters:
    city: "San Francisco"
    country: "USA"
    zip: "94105"
  departments:
    - name: "Engineering"
      budget: 5000000
    - name: "Sales"
      budget: 3000000
```

---

### ✅ Rule 6: Data Types

YAML auto-detects types. Use quotes when needed.

```yaml
# String (no quotes needed for simple values)
name: Alice
city: San Francisco

# String with spaces (quotes recommended)
company: "Acme Corporation"

# Numbers
age: 30                    # Integer
height: 5.9               # Float
port: 8080                # Port number

# Booleans
is_active: true           # Boolean
debug_mode: false         # Boolean

# Null/Empty
description: null         # Null value
# or use tilde:
notes: ~                  # Same as null

# Special values need quotes!
version: "1.0"            # Without quotes: treated as float
port: "8080"              # Without quotes: treated as number
enabled: "true"           # Without quotes: boolean true
```

---

### ✅ Rule 7: Multi-line Strings

```yaml
# Literal (preserves newlines exactly)
description: |
  This is line 1
  This is line 2
  This is line 3

# Folded (converts newlines to spaces)
summary: >
  This text spans
  multiple lines
  but becomes one line

# Result: "This text spans multiple lines but becomes one line"
```

---

## Common YAML Mistakes & How to Fix Them

| ❌ Mistake | 🔴 Problem | ✅ Solution |
|-----------|-----------|-----------|
| Using tabs | Invalid syntax, breaks parsing | Use spaces only (2 per level) |
| No space after `:` | `key:value` invalid | Always add space: `key: value` |
| Wrong list format | `items: apple, banana` | Use dashes: `items:\n  - apple\n  - banana` |
| Inconsistent indent | Mixing 1 and 2 spaces | Use consistent 2-space indentation |
| Quotes confusion | `"true"` vs `true` | Unquoted true/false are booleans; quoted are strings |
| Unquoted numbers | Port `8080` treated as number | Quote if needed: `port: "8080"` |

---

## YAML Validation Tools

```bash
# Validate YAML syntax
yamllint filename.yaml

# Install yamllint
npm install -g yamllint
# or
pip install yamllint

# Online validator
# https://www.yamllint.com/
```

---

# PART 2: MANIFEST BASICS

## What is a Kubernetes Manifest?

A **manifest** is a YAML file that describes what you want Kubernetes to create and manage.

### Manifest = Blueprint

```
Manifest (YAML)
    ↓
"I want 3 copies of an app running"
    ↓
Kubernetes reads it
    ↓
Creates actual resources in cluster
```

### Every Manifest Has 4 Sections

```yaml
apiVersion: v1              # ① Which API to use
kind: Pod                   # ② What resource type
metadata:                   # ③ Name, labels, etc.
  name: my-pod
  labels:
    app: myapp
spec:                       # ④ Detailed configuration
  containers:
    - name: app
      image: nginx:latest
```

---

## Section 1️⃣: apiVersion

**Tells Kubernetes which API version to use**

Different resource types use different APIs:

```yaml
# Core Kubernetes objects
apiVersion: v1
kind: Pod
kind: Service
kind: ConfigMap
kind: Secret

# Apps/Deployments
apiVersion: apps/v1
kind: Deployment
kind: StatefulSet
kind: DaemonSet

# Batch jobs
apiVersion: batch/v1
kind: Job
kind: CronJob

# Networking
apiVersion: networking.k8s.io/v1
kind: Service
kind: Ingress
kind: NetworkPolicy

# RBAC/Security
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
kind: RoleBinding
kind: ClusterRole
```

**Quick Tips:**
- `apps/v1` is for Deployments (most common)
- `v1` is for core objects
- Use `kubectl api-resources` to see all available

---

## Section 2️⃣: kind

**The type of Kubernetes resource**

```yaml
kind: Pod              # Single container wrapper
kind: Deployment       # Manage multiple pod replicas
kind: Service          # Network endpoint for pods
kind: ConfigMap        # Non-sensitive configuration
kind: Secret           # Sensitive data (passwords, tokens)
kind: PersistentVolume # Storage resource
kind: Ingress          # HTTP routing
```

---

## Section 3️⃣: metadata

**Information ABOUT the resource** (name, labels, etc.)

```yaml
metadata:
  # Required: Unique name in the namespace
  name: my-application
  
  # Optional: Namespace (default is "default")
  namespace: production
  
  # Optional: Labels for grouping/selecting
  labels:
    app: myapp
    version: v1
    environment: production
    team: backend
  
  # Optional: Annotations (non-identifying metadata)
  annotations:
    description: "Production API server"
    team: "platform"
    cost-center: "engineering-123"
    deployed-by: "jenkins"
```

### Labels vs Annotations

| Feature | Labels | Annotations |
|---------|--------|------------|
| Purpose | Select/group resources | Store metadata |
| Queryable | Yes (`-l app=web`) | No |
| Used by K8s | Yes (selectors) | No |
| Size limit | 63 characters each | Larger |
| Example | `app: web` | `description: "Production server"` |

---

## Section 4️⃣: spec

**The actual desired state** (varies by resource type)

```yaml
# For Pod
spec:
  containers:
    - name: nginx
      image: nginx:latest

# For Deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    # Pod spec goes here

# For Service
spec:
  type: ClusterIP
  selector:
    app: myapp
  ports:
    - port: 80
```

---

# PART 3: WORKLOAD RESOURCES

## 🐳 POD: The Basic Building Block

### What is a Pod?

The **smallest deployable unit** in Kubernetes. Think of it as a lightweight wrapper around one (or more) containers.

```
┌─────────────────────────┐
│   Pod (pod-name)        │
│ ┌──────────────────────┐│
│ │ Container 1          ││
│ │ (your application)   ││
│ └──────────────────────┘│
│ ┌──────────────────────┐│
│ │ Container 2 (optional)││
│ │ (logging sidecar)    ││
│ └──────────────────────┘│
└─────────────────────────┘
All containers share: Network, Storage, Config
```

### When to Use Pods

✅ Learning/experimenting with Kubernetes
✅ Debugging/testing
✅ Temporary workloads

❌ Production (use Deployments instead!)
❌ Long-running apps
❌ Anything that needs reliability

### Simple Pod Example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: default
  labels:
    app: web
    tier: frontend
spec:
  containers:
  - name: nginx
    image: nginx:1.21       # Docker image
    ports:
    - containerPort: 80     # Container listens on 80
  
  # Pod restarts if container crashes
  restartPolicy: Always
```

### Pod with Resource Limits

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-aware-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    
    # How much resources it needs
    resources:
      requests:
        memory: "64Mi"      # Minimum memory
        cpu: "100m"         # 100 milliCPU = 0.1 CPU core
      limits:
        memory: "128Mi"     # Maximum memory
        cpu: "200m"         # Maximum CPU
```

### Multi-Container Pod (Advanced)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-logging
spec:
  containers:
  # Main application
  - name: app
    image: myapp:latest
    ports:
    - containerPort: 8080
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  
  # Logging sidecar (runs alongside)
  - name: logger
    image: fluent-bit:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  
  # Shared volume between containers
  volumes:
  - name: logs
    emptyDir: {}
```

### Pod kubectl Commands

```bash
# Create pod
kubectl apply -f pod.yaml

# List all pods
kubectl get pods

# Get specific pod details
kubectl describe pod nginx-pod

# View container logs
kubectl logs nginx-pod

# Execute command in pod
kubectl exec -it nginx-pod -- /bin/bash

# Port forward (test pod locally)
kubectl port-forward nginx-pod 8080:80
# Then visit: http://localhost:8080

# Delete pod
kubectl delete pod nginx-pod
```

---

## 📦 DEPLOYMENT: The Workhorse

### What is a Deployment?

Manages multiple Pod replicas automatically. The **#1 resource** you'll use in Kubernetes.

```
┌──────────────────────────────────┐
│ Deployment (nginx-deployment)    │
│ ┌──────────────────────────────┐ │
│ │ ReplicaSet-v1 (nginx-abc123) │ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐  │ │
│ │ │Pod-1 │ │Pod-2 │ │Pod-3 │  │ │
│ │ └──────┘ └──────┘ └──────┘  │ │
│ │ (3 replicas running)         │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

### Why Use Deployments?

| Feature | Benefit |
|---------|---------|
| **Auto-restart** | Pod dies → Deployment creates new one |
| **Scaling** | Change replicas: `kubectl scale deploy/app --replicas=5` |
| **Rolling updates** | Update without downtime |
| **Rollback** | `kubectl rollout undo` to previous version |
| **Load balancing** | Multiple replicas share traffic |

### Basic Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: web
spec:
  # How many copies to run
  replicas: 3
  
  # Which pods to manage
  selector:
    matchLabels:
      app: web
  
  # Template for creating pods
  template:
    metadata:
      labels:
        app: web      # Must match selector!
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### Production-Ready Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: production
  labels:
    app: api
    version: v1
spec:
  # Start with 3 replicas
  replicas: 3
  
  # Identify pods to manage
  selector:
    matchLabels:
      app: api
      tier: backend
  
  # Update strategy (rolling update)
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1              # Max extra pods during update
      maxUnavailable: 0        # Always keep all pods running
  
  # Pod template
  template:
    metadata:
      labels:
        app: api
        tier: backend
    spec:
      # Container restart policy
      restartPolicy: Always
      
      containers:
      - name: api
        image: api:1.5         # Specific version (NOT latest!)
        imagePullPolicy: IfNotPresent
        
        ports:
        - name: http
          containerPort: 8080
        
        # Environment variables
        env:
        - name: LOG_LEVEL
          value: "info"
        - name: ENVIRONMENT
          value: "production"
        
        # Request resources (for scheduling)
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        
        # Health check: is app alive?
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        # Health check: ready to serve traffic?
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
```

### Deployment Lifecycle

```
Deployment created
    ↓
Creates ReplicaSet (RS-v1)
    ↓
RS creates 3 Pods
    ↓
Pods start running
    ↓
Image updated → new RS created (RS-v2)
    ↓
Old RS scaled down (0 pods)
    ↓
New RS has all 3 pods
    ↓
Old RS kept for rollback
```

### Deployment Update Commands

```bash
# Apply new version
kubectl set image deployment/nginx-deployment \
  nginx=nginx:1.20

# Edit directly
kubectl edit deployment nginx-deployment

# View update history
kubectl rollout history deployment/nginx-deployment
kubectl rollout history deployment/nginx-deployment --revision=2

# Rollback to previous version
kubectl rollout undo deployment/nginx-deployment

# Rollback to specific version
kubectl rollout undo deployment/nginx-deployment --to-revision=2

# Pause update (if things go wrong)
kubectl rollout pause deployment/nginx-deployment

# Resume update
kubectl rollout resume deployment/nginx-deployment

# Check rollout status
kubectl rollout status deployment/nginx-deployment
```

### Deployment Best Practices

```yaml
# ✅ DO: Use specific image versions
image: myapp:1.2.3      # Good
image: myapp:latest     # ❌ BAD - unpredictable

# ✅ DO: Always set resource requests/limits
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"

# ✅ DO: Use health checks
livenessProbe:
  httpGet:
    path: /health
    port: 8080

readinessProbe:
  httpGet:
    path: /ready
    port: 8080

# ✅ DO: Use multiple replicas
replicas: 3    # Never 1 in production

# ✅ DO: Use RollingUpdate strategy
strategy:
  type: RollingUpdate
```

---

## 🗄️ STATEFULSET: For Databases

### What is a StatefulSet?

Like Deployment, but for **stateful apps** with persistent identity.

```
StatefulSet: mysql

Pod Names:       mysql-0     mysql-1     mysql-2
Storage:         disk-0      disk-1      disk-2
DNS Names:       mysql-0.mysql-service
                 mysql-1.mysql-service
                 mysql-2.mysql-service

Key: Each pod keeps same name, storage, and DNS name!
```

### When to Use StatefulSet

✅ Databases (MySQL, PostgreSQL, MongoDB)
✅ Message queues (Kafka, RabbitMQ)
✅ Caches (Redis, Memcached)
✅ Anything that needs persistent identity

❌ Web servers, APIs (use Deployment)
❌ Stateless apps

### StatefulSet Example

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  # Required: Service for DNS names
  serviceName: mysql-service
  
  # Number of replicas
  replicas: 3
  
  # Pod selector
  selector:
    matchLabels:
      app: mysql
  
  # Pod template
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
          name: mysql
        
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
        
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
  
  # Each pod gets its own storage
  volumeClaimTemplates:
  - metadata:
      name: mysql-data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 10Gi
```

### StatefulSet Naming

```
Pod names are predictable:
- mysql-0 (always mysql-0)
- mysql-1 (always mysql-1)
- mysql-2 (always mysql-2)

DNS names are stable:
- mysql-0.mysql-service (in default namespace)
- mysql-1.mysql-service.default.svc.cluster.local
- mysql-2.mysql-service.default.svc.cluster.local

If mysql-1 restarts:
- It gets the same name (mysql-1)
- It reconnects to same storage
- Same DNS name works
```

---

## 🌙 DAEMONSET: Node-Level Services

### What is a DaemonSet?

Runs one Pod on **every Node** in the cluster.

```
Node 1: [Pod: monitoring-agent]
Node 2: [Pod: monitoring-agent]
Node 3: [Pod: monitoring-agent]

When new Node added:
Node 4: [Pod: monitoring-agent] ← Auto added!

When node deleted:
Pod on that node also deleted
```

### When to Use DaemonSet

✅ Monitoring agents (Prometheus Node Exporter)
✅ Logging agents (Fluentd, Logstash, Datadog agent)
✅ Network plugins (Flannel, Weave)
✅ Security scanners (Falco)
✅ Storage drivers

### DaemonSet Example

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: log-collector
  
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      # Allow on master nodes
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
      
      # Access node's logs
      containers:
      - name: fluentd
        image: fluent/fluentd:v1.14
        
        volumeMounts:
        # Read from node's log directory
        - name: varlog
          mountPath: /var/log
          readOnly: true
        
        # Read from container logs
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      
      # Host volumes
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
```

---

## ⏰ JOB: Run Tasks to Completion

### What is a Job?

Creates Pod(s) that run to completion, then stop. Perfect for batch jobs.

```
Job: backup-database

Pod created
    ↓
Runs backup script
    ↓
Completes successfully
    ↓
Pod stops
```

### When to Use Job

✅ Data backups
✅ Batch processing
✅ One-time migrations
✅ Data exports
✅ Running tests

### Job Example

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-backup
spec:
  # Retry 3 times if fails
  backoffLimit: 3
  
  # Delete job after 1 hour
  ttlSecondsAfterFinished: 3600
  
  template:
    spec:
      # Don't restart pod on failure (job will retry)
      restartPolicy: Never
      
      containers:
      - name: backup
        image: backup-tool:latest
        command:
          - /bin/sh
          - -c
          - |
            echo "Starting backup..."
            mysqldump -u root -p$MYSQL_ROOT_PASSWORD mydb > backup.sql
            echo "Backup complete!"
        
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
```

### Parallel Job Example

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-processing
spec:
  # Run 10 pods total
  completions: 10
  
  # Run 2 pods in parallel
  parallelism: 2
  
  # Retry each pod 3 times
  backoffLimit: 3
  
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: processor
        image: data-processor:v1
```

---

## 📅 CRONJOB: Scheduled Jobs

### What is a CronJob?

Runs a Job on a schedule (like Linux cron).

```
CronJob: daily-backup
    ↓
Every day at 2 AM
    ↓
Creates Job
    ↓
Job creates Pod
    ↓
Pod runs backup
    ↓
Pod completes
```

### CronJob Example

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  # Schedule: "0 2 * * *" = 2 AM every day
  schedule: "0 2 * * *"
  
  # Keep last 3 successful jobs
  successfulJobsHistoryLimit: 3
  
  # Keep last 1 failed job
  failedJobsHistoryLimit: 1
  
  # The job to run
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: backup-tool:latest
            command:
              - /bin/sh
              - -c
              - mysqldump -u root -p$MYSQL_ROOT_PASSWORD mydb > /backups/backup-$(date +%Y%m%d-%H%M%S).sql
            
            env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: password
```

### Cron Schedule Format

```
  ┌─────── minute (0 - 59)
  │ ┌─────── hour (0 - 23)
  │ │ ┌─────── day of month (1 - 31)
  │ │ │ ┌─────── month (1 - 12)
  │ │ │ │ ┌─────── day of week (0 - 6, Sunday=0)
  │ │ │ │ │
  * * * * *

Examples:
"0 2 * * *"      # 2 AM every day
"0 0 * * 0"      # Midnight every Sunday
"*/15 * * * *"   # Every 15 minutes
"0 9 1 * *"      # 9 AM on 1st of every month
"0 */4 * * *"    # Every 4 hours
"0 0 * * MON"    # Midnight every Monday
"0 0 1 * *"      # Midnight on 1st of every month
```

---

# PART 4: NETWORKING RESOURCES

## 🔌 SERVICE: How Pods Talk

### Why Services?

Pods get new IPs when they restart. Services provide stable endpoints.

```
Without Service:          With Service:
Pods change IPs           Service (stable IP)
Client can't find them    Client uses Service DNS
❌ Chaos                  ✅ Reliable
```

### How Service Works

```
Client → Service (stable DNS) → Load balances → Pod 1
                                             ↓ Pod 2
                                             ↓ Pod 3
```

### Three Types of Services

---

### Type 1: ClusterIP (Internal Only)

**Access from inside cluster only**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: database-service
spec:
  type: ClusterIP      # Default type
  
  selector:
    app: database      # Route to pods with this label
  
  ports:
  - port: 5432         # Service port (what you connect to)
    targetPort: 5432   # Pod port (where app listens)
    protocol: TCP
```

**Access inside cluster:**
```bash
# In another pod:
psql -h database-service -p 5432 -U postgres

# Full DNS name:
psql -h database-service.default.svc.cluster.local -p 5432
```

---

### Type 2: NodePort (External Access)

**Access from outside cluster via node IP + port**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app
spec:
  type: NodePort
  
  selector:
    app: web
  
  ports:
  - port: 80           # Service port (internal)
    targetPort: 8080   # Pod port
    nodePort: 30080    # Node port (30000-32767)
```

**Access from outside:**
```bash
# Get node IP
kubectl get nodes -o wide

# Access service
curl http://<NODE-IP>:30080
# Example: curl http://192.168.1.100:30080
```

---

### Type 3: LoadBalancer (Cloud Load Balancer)

**Automatic external IP from cloud provider**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-external
spec:
  type: LoadBalancer
  
  selector:
    app: api
  
  ports:
  - port: 80
    targetPort: 8080
```

**Access:**
```bash
# Get external IP (might take a minute)
kubectl get svc api-external
# EXTERNAL-IP: 203.0.113.45

# Access
curl http://203.0.113.45
```

---

## 🛣️ INGRESS: HTTP-Level Routing

### What is Ingress?

Routes HTTP/HTTPS traffic to Services based on **hostname** and **URL path**.

```
Client
   ↓
api.example.com/users  ──→ api-service:8080
api.example.com/orders ──→ orders-service:8080
web.example.com        ──→ web-service:80
```

### Why Ingress vs LoadBalancer?

| Feature | LoadBalancer | Ingress |
|---------|--------------|---------|
| Type | Layer 4 (TCP) | Layer 7 (HTTP) |
| Cost | High ($$$) | Low ($) |
| Per service | Need one per service | One for many services |
| Hostname routing | ❌ No | ✅ Yes |
| Path routing | ❌ No | ✅ Yes |
| Best for | Single service | Multiple services |

### Ingress Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx   # Requires Ingress Controller
  
  # HTTPS certificates
  tls:
  - hosts:
    - "example.com"
    - "api.example.com"
    secretName: example-tls
  
  # Routing rules
  rules:
  
  # Host 1: api.example.com
  - host: "api.example.com"
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
  
  # Host 2: web.example.com
  - host: "web.example.com"
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
  
  # Host 3: example.com with multiple paths
  - host: "example.com"
    http:
      paths:
      # /api goes to api-service
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
      
      # /images goes to cdn-service
      - path: /images
        pathType: Prefix
        backend:
          service:
            name: cdn-service
            port:
              number: 3000
      
      # Everything else goes to web-service
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

**Note:** Requires Ingress Controller (NGINX, Traefik, etc.)

---

## 🔒 NETWORKPOLICY: Pod Firewall

### What is NetworkPolicy?

Defines which pods can talk to which pods (network firewall rules).

```
Without NetworkPolicy:
All pods talk to all pods ← Security risk!

With NetworkPolicy:
Frontend ──→ Backend (allowed)
       ↗ Database (blocked!)
Backend ──→ Database (allowed)
```

### Default Deny All

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}    # Apply to all pods
  policyTypes:
  - Ingress         # Deny all incoming
  - Egress          # Deny all outgoing
  # Empty rules = deny everything!
```

### Allow Specific Traffic

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
spec:
  # Apply to API pods
  podSelector:
    matchLabels:
      app: api
  
  policyTypes:
  - Ingress
  
  # Allow from frontend pods only
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### API to Database

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-database
spec:
  # Apply to database pods
  podSelector:
    matchLabels:
      app: database
  
  policyTypes:
  - Ingress
  
  # Allow from API pods
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api
    ports:
    - protocol: TCP
      port: 5432
```

---

# PART 5: CONFIGURATION & STORAGE

## 📋 CONFIGMAP: Non-Sensitive Configuration

### What is ConfigMap?

Store application configuration outside container images.

```
ConfigMap
├── database.yml
├── app.properties
├── DEBUG_MODE: true
└── API_ENDPOINT: https://api.example.com
```

### Simple ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  MAX_CONNECTIONS: "100"
  API_TIMEOUT: "30"
```

### ConfigMap with Files

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  # Multi-line file
  nginx.conf: |
    server {
      listen 80;
      server_name _;
      location / {
        proxy_pass http://backend:8080;
      }
    }
  
  # Another file
  app-settings.yaml: |
    server:
      port: 8080
      ssl: true
    database:
      host: db-service
      pool_size: 20
```

### Using ConfigMap in Pod

**Method 1: Environment Variables**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    
    # Load ALL config keys as env vars
    envFrom:
    - configMapRef:
        name: app-config
    
    # Or load specific keys
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_host
```

**Method 2: Files (Volume Mount)**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    
    volumeMounts:
    # Mount config files
    - name: config-volume
      mountPath: /etc/nginx/conf.d
  
  volumes:
  - name: config-volume
    configMap:
      name: nginx-config
      # Creates files:
      # /etc/nginx/conf.d/nginx.conf
      # /etc/nginx/conf.d/app-settings.yaml
```

### Create ConfigMap from Command Line

```bash
# From literal values
kubectl create configmap app-config \
  --from-literal=DB_HOST=database-service \
  --from-literal=LOG_LEVEL=debug

# From file
kubectl create configmap app-config \
  --from-file=app.properties

# From directory
kubectl create configmap app-config \
  --from-file=./config-dir/
```

---

## 🔐 SECRET: Sensitive Data

### What is Secret?

Stores sensitive data (passwords, tokens, API keys).

```
Secret (base64-encoded)
├── username: YWRtaW4=
├── password: c3VwZXJzZWNyZXQ=
└── api-token: YWJjZGVmZ2hpamtsmnoPQo=
```

⚠️ **Important:** Base64 is encoding, NOT encryption!

### Create Secret

```bash
# Encode value
echo -n "my-password" | base64
# Output: bXktcGFzc3dvcmQ=

# Create secret
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123
```

### Secret YAML

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  # Values are base64-encoded
  username: YWRtaW4=              # admin
  password: c3VwZXJzZWNyZXQ=      # supersecret
  connection: cG9zdGdyZXM6Ly9...  # postgresql://...
```

### Using Secret in Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    
    # Load ALL secret keys as env vars
    envFrom:
    - secretRef:
        name: db-credentials
    
    # Or specific keys
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
```

### TLS Secret (for HTTPS)

```bash
# Create from certificate files
kubectl create secret tls tls-secret \
  --cert=tls.crt \
  --key=tls.key

# Use in Ingress
tls:
- hosts:
  - example.com
  secretName: tls-secret
```

### Secret Security Best Practices

```yaml
# ❌ DON'T: Store secrets in ConfigMap!
# ✅ DO: Use Secret for passwords/tokens

# ❌ DON'T: Commit secrets to Git!
# ✅ DO: Use external secret manager (Vault, HashiCorp, etc.)

# ❌ DON'T: Trust base64 encoding as encryption!
# ✅ DO: Enable encryption at rest in etcd

# ✅ DO: Use RBAC to limit access to Secrets
# ✅ DO: Rotate secrets regularly
# ✅ DO: Mask secrets in logs
```

---

## 💾 PERSISTENTVOLUME & PERSISTENTVOLUMECLAIM

### Problem: Pods are Ephemeral

```
Pod created with storage
    ↓
Pod runs, creates data
    ↓
Pod deleted
    ↓
DATA LOST! ❌
```

### Solution: Persistent Storage

```
Pod → PVC (request) → PV (storage) → Physical disk
      ↑                          ↑
      Pod temporary              Data survives pod
```

### PersistentVolume (Storage Resource)

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-storage
spec:
  capacity:
    storage: 10Gi       # Total size
  accessModes:
  - ReadWriteOnce       # Single pod read/write
  hostPath:
    path: /mnt/data     # Physical location on node
```

### PersistentVolumeClaim (Storage Request)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-storage
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi      # Request 5Gi (PV must have ≥5Gi)
```

### Using PVC in Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-storage
spec:
  containers:
  - name: app
    image: myapp:latest
    volumeMounts:
    - name: data        # Volume name
      mountPath: /data  # Where to mount in container
  
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: app-storage  # Reference PVC
```

### How PV/PVC Works

```
1. Admin creates PersistentVolume (10Gi available)

2. Pod creates PersistentVolumeClaim (request 5Gi)

3. Kubernetes matches PVC to compatible PV
   ✅ 10Gi ≥ 5Gi? YES, bind them

4. Pod mounts PVC → Can write to storage

5. Pod deleted → Storage persists!

6. New pod mounts same PVC → Access old data
```

### Access Modes

| Mode | Single Pod | Multiple Pods | Read | Write |
|------|-----------|---------------|------|-------|
| **RWO** (ReadWriteOnce) | ✅ | ❌ | ✅ | ✅ |
| **ROX** (ReadOnlyMany) | ❌ | ✅ | ✅ | ❌ |
| **RWX** (ReadWriteMany) | ❌ | ✅ | ✅ | ✅ |

---

## 📦 STORAGECLASS: Dynamic Provisioning

### Problem: Manual PV Creation

```
Need storage?
    ↓
Ask admin to create PV
    ↓
Admin creates PV manually
    ↓
Developer creates PVC
    ↓
Tedious and slow! ❌
```

### Solution: StorageClass

```
Developer creates PVC
with storageClassName
    ↓
StorageClass auto-provisions PV
    ↓
PV created automatically
    ↓
PVC binds to PV
    ↓
Done! No manual work! ✅
```

### StorageClass Example

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com    # AWS EBS provisioner
parameters:
  type: gp3                       # Volume type
  iops: "3000"                    # IOPS
  throughput: "125"               # Throughput
  encrypted: "true"               # Encrypt at rest
```

### Using StorageClass in PVC

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-storage
spec:
  storageClassName: fast-ssd      # Reference StorageClass
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

**Result:** PV created automatically!

---

# PART 6: ADVANCED CONCEPTS

## 🎯 HORIZONTALPODAUTOSCALER: Auto-Scaling

### What is HPA?

Automatically scales pod replicas based on metrics (CPU, memory).

```
High traffic (CPU > 80%)
    ↓
HPA increases replicas
    ↓
More pods handle traffic
    ↓
Low traffic (CPU < 30%)
    ↓
HPA decreases replicas
    ↓
Fewer pods (save cost!)
```

### HPA Example

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-autoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  
  # Scale between 2-10 replicas
  minReplicas: 2
  maxReplicas: 10
  
  # Scale when CPU > 80%
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### Requirements

```yaml
# Pod MUST have resource requests!
resources:
  requests:
    cpu: "100m"      # HPA needs this
    memory: "128Mi"  # And this
  limits:
    cpu: "500m"
    memory: "512Mi"
```

Also need Metrics Server installed:
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

---

## 📍 AFFINITY: Pod Placement

### NodeAffinity: Place on Specific Nodes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: gpu          # Node label key
            operator: In
            values: ["true"]  # Node label value
  
  containers:
  - name: cuda
    image: nvidia/cuda:latest
```

Step 1: Label nodes
```bash
kubectl label nodes node1 gpu=true
kubectl label nodes node2 gpu=true
kubectl label nodes node3 gpu=false
```

Step 2: Pod schedules only on gpu=true nodes

---

### PodAntiAffinity: Spread Pods Across Nodes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values: ["frontend"]
            topologyKey: kubernetes.io/hostname
      
      containers:
      - name: web
        image: nginx:latest
```

Result: Each pod on different node (high availability!)

---

## 🏷️ TAINTS & TOLERATIONS: Dedicated Nodes

### Taints: Mark Nodes as Special

```bash
# Add taint to node
kubectl taint nodes node1 gpu=true:NoSchedule

# Remove taint
kubectl taint nodes node1 gpu=true:NoSchedule-
```

### Tolerations: Allow Pods on Tainted Nodes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  # Tolerate the gpu taint
  tolerations:
  - key: gpu
    operator: Equal
    value: "true"
    effect: NoSchedule
  
  containers:
  - name: ml-training
    image: pytorch:latest
```

Use case: Reserve GPU nodes only for ML workloads

---

## 🛣️ RBAC: Access Control

### ServiceAccount: Pod Identity

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
```

### Role: Permissions

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: app-reader
rules:
# Allow reading pods
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]

# Allow reading configmaps
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get"]
```

### RoleBinding: Connect Role to ServiceAccount

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-reader-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: app-reader
subjects:
- kind: ServiceAccount
  name: app-sa
  namespace: default
```

### Use in Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  template:
    spec:
      serviceAccountName: app-sa    # Use service account
      containers:
      - name: app
        image: myapp:latest
```

---

# PART 7: INTERVIEW GUIDE

## Top 20 Kubernetes Interview Questions

### ❓ Q1: Explain Deployment vs StatefulSet

**What they're testing:** Understanding of stateless vs stateful workloads

**Answer:**

**Deployments:**
- For stateless applications
- Pod names are random and temporary
- Pods are interchangeable
- Examples: Web servers, APIs, microservices
- Pods can be created/destroyed in any order

**StatefulSets:**
- For stateful applications
- Pod names are predictable (pod-0, pod-1...)
- Each pod has persistent identity
- Pods have dedicated storage
- Pods created/destroyed in order
- Examples: Databases, message queues, caches

```yaml
# Deployment: random names
nginx-abc123-xyz1a
nginx-abc123-xyz2b
nginx-abc123-xyz3c

# StatefulSet: predictable names
mysql-0
mysql-1
mysql-2
```

---

### ❓ Q2: What is a Service and Why Do We Need It?

**What they're testing:** Understanding of pod networking

**Answer:**

**Problem:** Pods are ephemeral. They get new IPs when restarted.

**Solution:** Service provides stable endpoint.

```
Pods (IP changes)
    ↓
Service (stable IP + DNS)
    ↓
Clients connect to Service
    ↓
Service routes to Pods
```

**Service provides:**
- Stable IP address
- DNS name (service-name.namespace.svc.cluster.local)
- Load balancing across pod replicas
- Service discovery

---

### ❓ Q3: Explain Three Types of Services

**What they're testing:** Service types and use cases

**Answer:**

1. **ClusterIP** (Default)
   - Internal cluster communication only
   - Use for: Pod-to-pod communication, backend services
   - Access: Only from inside cluster

2. **NodePort**
   - Expose on node IP + port (30000-32767)
   - Use for: Testing, external access in non-cloud environments
   - Access: `<NodeIP>:NodePort`

3. **LoadBalancer**
   - Cloud provider load balancer assigned
   - Use for: Production external services
   - Access: Cloud provider's external IP

---

### ❓ Q4: What is Ingress and When Would You Use It?

**What they're testing:** Layer 7 routing vs Layer 4 services

**Answer:**

**Ingress** routes HTTP/HTTPS traffic based on hostname and URL path.

**Why use Ingress instead of LoadBalancer:**
- **Cost:** One Ingress replaces many LoadBalancer services
- **Hostname routing:** Route based on domain names
- **Path routing:** Route /api to one service, /images to another
- **Efficiency:** Consolidates multiple services

```yaml
# One Ingress, multiple services
api.example.com    → api-service:8080
web.example.com    → web-service:80
example.com/images → cdn-service:3000
```

**Requires:** Ingress Controller (NGINX, Traefik, etc.)

---

### ❓ Q5: ConfigMap vs Secret - What's the Difference?

**What they're testing:** Configuration management and security

**Answer:**

| Feature | ConfigMap | Secret |
|---------|-----------|--------|
| **Purpose** | Non-sensitive config | Sensitive data |
| **Encoding** | Plain text | Base64-encoded |
| **Use case** | App settings, files | Passwords, API keys |
| **Security** | Low | Higher (but not encrypted by default!) |
| **Best for** | Version control ✅ | External secret manager ✅ |

**Golden Rule:** Never store secrets in ConfigMap!

---

### ❓ Q6: Explain Rolling Update in Deployment

**What they're testing:** Understanding of update strategies

**Answer:**

Rolling update gradually replaces old pods with new ones (zero downtime).

```
Initial:   [Pod-v1] [Pod-v1] [Pod-v1]

Step 1:    [Pod-v2] [Pod-v1] [Pod-v1]  (1 new, 2 old)

Step 2:    [Pod-v2] [Pod-v2] [Pod-v1]  (2 new, 1 old)

Final:     [Pod-v2] [Pod-v2] [Pod-v2]  (all new)

KEY: Service routes to both old and new during transition
```

**Configuration:**
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1          # Allow 1 extra pod during update
    maxUnavailable: 0    # Never go below desired replicas
```

**Rollback:**
```bash
kubectl rollout undo deployment/myapp
```

---

### ❓ Q7: What is PersistentVolume and PersistentVolumeClaim?

**What they're testing:** Storage understanding

**Answer:**

**PersistentVolume (PV):** Storage resource provided by admin

**PersistentVolumeClaim (PVC):** Storage request by pod

Analogy:
- **PV** = Parking lot with available spots
- **PVC** = Driver requesting a spot
- **Binding** = Driver gets assigned a spot

**How it works:**
```
1. Admin creates PV (10Gi available)
2. Pod creates PVC (request 5Gi)
3. Kubernetes matches and binds them
4. Pod mounts PVC, writes data
5. Pod deletes → Storage persists
6. New pod mounts PVC → Accesses old data
```

---

### ❓ Q8: Explain RBAC and Its Importance

**What they're testing:** Security and least privilege

**Answer:**

**RBAC** = Role-Based Access Control

**Components:**
1. **ServiceAccount:** Pod identity
2. **Role:** Define permissions (in namespace)
3. **RoleBinding:** Connect Role to ServiceAccount
4. **ClusterRole:** Cluster-wide permissions
5. **ClusterRoleBinding:** Cluster-wide binding

**Why important:**
- **Security:** Pods only get necessary permissions
- **Least privilege:** Limit access by default
- **Compliance:** Meet security requirements
- **Multi-tenancy:** Isolate teams' permissions

---

### ❓ Q9: How Does HorizontalPodAutoscaler (HPA) Work?

**What they're testing:** Scaling mechanisms

**Answer:**

HPA automatically scales replicas based on metrics.

```
Metrics collected (every 15 sec)
    ↓
Compared to target
    ↓
If CPU > 80%: Scale UP (+1 replica)
If CPU < 30%: Scale DOWN (-1 replica, after cooldown)
    ↓
Deployment replicas updated
```

**Requirements:**
- Metrics Server installed
- Pod resource requests defined

```yaml
resources:
  requests:
    cpu: "100m"      # Required for HPA
    memory: "128Mi"
```

---

### ❓ Q10: What are Taints and Tolerations?

**What they're testing:** Node scheduling

**Answer:**

**Taint:** Mark node as unsuitable for pods (unless tolerating)

**Toleration:** Allow pod to run on tainted node

Use case: Dedicated hardware (GPU nodes)

```bash
# Add taint to GPU nodes
kubectl taint nodes gpu-node gpu=true:NoSchedule
```

```yaml
# Pod tolerates the taint
tolerations:
- key: gpu
  operator: Equal
  value: "true"
  effect: NoSchedule
```

Result: Only GPU-tolerating pods run on GPU nodes

---

## Practice Interview Scenarios

### 📝 Scenario 1: Design Multi-Tier Application

**Question:** Design Kubernetes manifests for a 3-tier app (Frontend, Backend API, Database)

**What they're testing:** Ability to design complete application architecture

**Answer:** Create these manifests:

1. **ConfigMap** - App configuration
2. **Secret** - Database credentials
3. **Database StatefulSet** - MySQL with persistent storage
4. **Backend Deployment** - API server with HPA
5. **Frontend Deployment** - Web server with HPA
6. **Services** - Internal (ClusterIP) for all
7. **Ingress** - Route external traffic
8. **NetworkPolicy** - Restrict traffic paths

---

### 📝 Scenario 2: Troubleshoot Pod Not Starting

**Question:** Pod stuck in Pending state. How do you debug?

**What they're testing:** Troubleshooting skills

**Answer:**

```bash
# 1. Check pod events
kubectl describe pod pod-name
# Look for errors in Events section

# 2. Check node resources
kubectl top nodes
kubectl get nodes

# 3. Check if storage bound
kubectl get pvc
kubectl get pv

# 4. Check image exists
kubectl logs pod-name --previous

# 5. Common issues:
# - PVC not bound → Create PV or StorageClass
# - Insufficient CPU/Memory → Add nodes or lower requests
# - ImagePullBackOff → Check image name and credentials
# - CrashLoopBackOff → App crashed → Check logs
```

---

### 📝 Scenario 3: Plan Zero-Downtime Update

**Question:** Roll out new version of API with zero downtime

**What they're testing:** Update strategies and reliability

**Answer:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3         # Multiple replicas for HA
  
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1           # One extra pod during update
      maxUnavailable: 0     # Never drop below 3 pods
  
  template:
    spec:
      # Health checks
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 10
      
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 5
      
      containers:
      - name: api
        image: api:2.0      # New version
        
        # Resource limits
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2    # Always keep ≥2 pods running
  selector:
    matchLabels:
      app: api-server
```

Steps:
1. Apply new deployment → Rolling update starts
2. PDB ensures ≥2 pods always available
3. Health checks verify new pods are ready
4. Old pods gradually drain
5. Complete: All pods running new version

---

# QUICK REFERENCE

## Essential kubectl Commands

```bash
# Apply/Create
kubectl apply -f manifest.yaml
kubectl create -f manifest.yaml

# Get Resources
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get all

# Describe (Get Details)
kubectl describe pod pod-name
kubectl describe deployment deploy-name

# Logs & Debugging
kubectl logs pod-name
kubectl logs deployment/deploy-name
kubectl logs pod-name --previous    # Previous run
kubectl exec -it pod-name -- bash

# Edit & Update
kubectl edit pod pod-name
kubectl set image deployment/myapp app=myapp:2.0

# Scaling
kubectl scale deployment myapp --replicas=5

# Rollout
kubectl rollout history deployment/myapp
kubectl rollout undo deployment/myapp
kubectl rollout restart deployment/myapp

# Delete
kubectl delete pod pod-name
kubectl delete -f manifest.yaml

# Monitoring
kubectl top nodes
kubectl top pods
kubectl get events
```

## Resource Types Quick Reference

| Resource | Kind | When to Use |
|----------|------|-----------|
| **Pod** | pod | Testing only |
| **Deployment** | deployment | Stateless apps (99%) |
| **StatefulSet** | statefulset | Databases, caches |
| **DaemonSet** | daemonset | Node-level services |
| **Job** | job | Batch/one-time tasks |
| **CronJob** | cronjob | Scheduled tasks |
| **Service** | service | Pod networking |
| **Ingress** | ingress | HTTP routing |
| **ConfigMap** | configmap | Configuration |
| **Secret** | secret | Sensitive data |
| **PV** | persistentvolume | Storage resource |
| **PVC** | persistentvolumeclaim | Storage request |
| **StorageClass** | storageclass | Dynamic provisioning |
| **HPA** | hpa | Auto-scaling |
| **Role** | role | Namespace permissions |
| **RoleBinding** | rolebinding | Bind Role to user |
| **ClusterRole** | clusterrole | Cluster permissions |
| **ServiceAccount** | serviceaccount | Pod identity |
| **NetworkPolicy** | networkpolicy | Network firewall |

---

## Common Patterns

### Stateless Web App

```yaml
# Deployment with HPA
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: myapp:1.2
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"

---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Best Practices Checklist

```
✅ Resource Management
  □ Always set resource requests
  □ Set resource limits
  □ Use namespaces to organize

✅ Deployment
  □ Use Deployments, not bare Pods
  □ Never use 'latest' tag
  □ Use rolling update strategy
  □ Multiple replicas (≥3)

✅ Configuration
  □ Use ConfigMap for non-sensitive data
  □ Use Secret for sensitive data
  □ Externalize configuration

✅ Health & Reliability
  □ Define livenessProbe
  □ Define readinessProbe
  □ Use PodDisruptionBudget
  □ Use NetworkPolicy
  □ Backup persistent data

✅ Security
  □ Use ServiceAccount with limited permissions
  □ Implement RBAC
  □ Use NetworkPolicy for pod-to-pod
  □ Run containers as non-root
  □ Scan images for vulnerabilities

✅ Storage
  □ Use StorageClass for dynamic provisioning
  □ Set PVC reclaimPolicy: Retain
  □ Test backup/restore procedures

✅ Monitoring
  □ Export metrics (Prometheus)
  □ Set up alerts
  □ Centralized logging
  □ Monitor resource usage
```

---

## Common Mistakes & Solutions

| ❌ Mistake | 🔴 Impact | ✅ Solution |
|-----------|-----------|-----------|
| Using `latest` tag | Unpredictable versions | Use specific tags (1.2.3) |
| No resource requests | Resource exhaustion | Always define requests |
| No health checks | Unhealthy pods serve traffic | Add liveness + readiness probes |
| Single replica | Single point of failure | Use ≥3 replicas |
| Pod runs as root | Security vulnerability | Set runAsNonRoot: true |
| No NetworkPolicy | Everyone can talk | Implement network policies |
| Secrets in ConfigMap | Security breach | Use Secret resource |
| No rollback plan | Can't recover from bad deploy | Keep old ReplicaSet/test rollback |
| No backup strategy | Data loss risk | Backup persistent volumes |
| Ignoring RBAC | Pods have excessive permissions | Implement least privilege RBAC |

---

## Resources & Learning

📚 **Official Kubernetes Documentation:**
- https://kubernetes.io/docs/
- https://kubernetes.io/docs/concepts/

🎓 **Interactive Learning:**
- Katakoda Kubernetes Playground
- Minikube (local testing)
- Kind (Kubernetes in Docker)

🧪 **Practice:**
- Deploy sample apps locally
- Practice kubectl commands
- Write YAML from scratch
- Deploy multi-tier applications

📊 **Monitoring & Debugging:**
- `kubectl describe` - detailed resource info
- `kubectl logs` - application logs
- `kubectl top` - resource usage
- `kubectl get events` - cluster events

---

## Final Tips for Success

### For Learning:
1. Start with Deployments (most common)
2. Practice writing YAML by hand
3. Use `kubectl explain` to understand resources
4. Deploy real applications, not just examples
5. Break things, then fix them

### For Interviews:
1. Know core concepts deeply (Pod, Deployment, Service)
2. Understand problem → Kubernetes solution
3. Ask clarifying questions
4. Explain your reasoning
5. Show you understand trade-offs

### For Production:
1. Always use Deployments, not Pods
2. Set resource requests/limits
3. Use health checks (liveness + readiness)
4. Multiple replicas (3+)
5. Use NetworkPolicy
6. Implement RBAC
7. Backup persistent data
8. Monitor and alert
9. Test disaster recovery

---

## Summary

**You now understand:**

✅ YAML syntax and Kubernetes manifest structure
✅ All major Kubernetes resource types
✅ How to design reliable, scalable applications
✅ Security best practices (RBAC, NetworkPolicy, Secrets)
✅ Storage and persistence strategies
✅ Scaling and auto-scaling mechanisms
✅ Networking (Services, Ingress)
✅ Configuration management (ConfigMap, Secret)

**Next Steps:**
1. Set up a local Kubernetes cluster (Minikube/Kind)
2. Write and deploy manifests
3. Practice troubleshooting
4. Deploy real applications
5. Study for interviews/certifications

---
---

**Last Updated:** December 2024
**Kubernetes Version:** 1.24+
**Document Status:** Complete & Production-Ready
