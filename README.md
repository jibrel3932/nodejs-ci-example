# CloudScale — Project 2: Infrastructure as Code with Terraform and Azure ACI

**Cloud Computing & DevOps Engineering**
**Instructor:** M.Sc. Abdelhakim Rashid

---

## 👤 Authors

| Name | Student ID | Role |
|------|-----------|------|
| Jibrel Abubakr Jibrel | 3932 | DevOps Engineer |

---

## 📋 Project Description

This project demonstrates end-to-end **Infrastructure as Code (IaC)** using **Terraform** to provision **Azure Container Instances (ACI)** — a serverless container platform. A Dockerized Node.js web application is built, pushed to Docker Hub, and deployed to Azure using a fully automated **GitHub Actions CI/CD pipeline** with a manual approval gate for production deployment.

### Key Features
- 🐳 **Dockerized** Node.js web application with a custom HTML page
- 🏗️ **Terraform** IaC provisioning for Azure resources
- ☁️ **Azure Container Instance (ACI)** with public IP and DNS label
- 🔄 **GitHub Actions** CI/CD with `terraform plan` on PRs and `terraform apply` on merge
- ✅ **Manual approval gate** before production deployment
- 📦 Docker image hosted on **Docker Hub** (public repository)

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPER WORKFLOW                            │
│                                                                        │
│   ┌──────────┐    git push     ┌──────────────────┐                   │
│   │Developer  │ ──────────────▶│   GitHub Repo    │                   │
│   │Workstation│                │  (Source Code)    │                   │
│   └──────────┘                └────────┬─────────┘                   │
│                                         │                              │
└─────────────────────────────────────────┼──────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        GITHUB ACTIONS CI/CD                            │
│                                                                        │
│   ┌─────────────────────┐    ┌─────────────────────┐                  │
│   │  On Pull Request    │    │  On Push to Main     │                  │
│   │                     │    │                      │                  │
│   │  • terraform init   │    │  • terraform init    │                  │
│   │  • terraform fmt    │    │  • terraform plan    │                  │
│   │  • terraform plan   │    │  • MANUAL APPROVAL ⏸ │                  │
│   │                     │    │  • terraform apply   │                  │
│   └─────────────────────┘    └──────────┬───────────┘                  │
│                                          │                              │
│   ┌─────────────────────┐               │                              │
│   │  Docker Build & Push│               │                              │
│   │  (nodejs.yml)       │               │                              │
│   │  → Docker Hub       │               │                              │
│   └─────────────────────┘               │                              │
│                                          │                              │
└──────────────────────────────────────────┼──────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           AZURE CLOUD                                  │
│                                                                        │
│   ┌─────────────────────────────────────────────────────┐              │
│   │  Resource Group: jibrel-proj2-aci-rg                │              │
│   │  Tags: Project=Project2, Environment=production     │              │
│   │                                                     │              │
│   │   ┌─────────────────────────────────────────────┐   │              │
│   │   │  Azure Container Instance: jibrel-proj2-aci │   │              │
│   │   │                                             │   │              │
│   │   │  Image: jibrel3932/nodejs-ci-app:latest     │   │              │
│   │   │  Port: 3000 (TCP)                           │   │              │
│   │   │  Public IP: ✅                               │   │              │
│   │   │  DNS: jibrel-proj2-app.eastus.azurecontainer│   │              │
│   │   │       .io                                   │   │              │
│   │   └─────────────────────────────────────────────┘   │              │
│   │                                                     │              │
│   └─────────────────────────────────────────────────────┘              │
│                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
                               ┌───────────────────────┐
                               │   End User / Browser  │
                               │                       │
                               │  http://jibrel-proj2- │
                               │  app.eastus.azure     │
                               │  container.io:3000    │
                               └───────────────────────┘
```

---

## 🐳 Docker Image Build & Push Instructions

### Prerequisites
- Docker Desktop installed and running
- Docker Hub account (username: `jibrel3932`)

### Step 1: Build the Docker Image
```bash
docker build -t jibrel3932/nodejs-ci-app:latest .
```

### Step 2: Test Locally
```bash
docker run -p 3000:3000 jibrel3932/nodejs-ci-app:latest
# Visit http://localhost:3000 in your browser
```

### Step 3: Push to Docker Hub
```bash
docker login
docker push jibrel3932/nodejs-ci-app:latest
```

### Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

---

## 🏗️ Terraform Setup Instructions

### Prerequisites
- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.0 installed
- Azure CLI installed and authenticated
- Azure Service Principal with Contributor role

### Step 1: Set Azure Credentials
```bash
export ARM_CLIENT_ID="<your-client-id>"
export ARM_CLIENT_SECRET="<your-client-secret>"
export ARM_TENANT_ID="<your-tenant-id>"
export ARM_SUBSCRIPTION_ID="<your-subscription-id>"
```

### Step 2: Initialize Terraform
```bash
terraform init
```

### Step 3: Preview Changes
```bash
terraform plan
```

### Step 4: Apply Infrastructure
```bash
terraform apply
```

### Step 5: View Outputs
```bash
terraform output
# container_fqdn = "jibrel-proj2-app.eastus.azurecontainer.io"
# container_ip   = "x.x.x.x"
# resource_group_name = "jibrel-proj2-aci-rg"
```

### Step 6: Destroy (cleanup)
```bash
terraform destroy
```

### Terraform File Structure

| File | Purpose |
|------|---------|
| `providers.tf` | Azure provider configuration and version constraints |
| `main.tf` | Resource Group + Azure Container Instance resources with tags |
| `variables.tf` | Input variables (resource_group_name, location, container_image, dns_name_label) |
| `outputs.tf` | Output values (container FQDN, IP address, resource group name) |

---

## 🔄 GitHub Actions Workflow Explanation

### Workflow: `terraform.yml`

This workflow automates the Terraform lifecycle:

#### On Pull Request to `main`:
1. **Checkout** — Clones the repository
2. **Setup Terraform** — Installs Terraform v1.7.0
3. **Terraform Init** — Initializes providers and backend
4. **Terraform Format Check** — Ensures code formatting standards
5. **Terraform Validate** — Validates configuration syntax
6. **Terraform Plan** — Shows what resources will be created/changed

#### On Push to `main`:
1. Steps 1–6 from above (**Plan phase**)
2. **Manual Approval Gate** — Uses GitHub Environment `production` with protection rules. A reviewer must approve before proceeding
3. **Terraform Apply** — Provisions the actual Azure resources
4. **Show Outputs** — Displays the container FQDN and IP

### Workflow: `nodejs.yml`

Handles Docker image CI/CD:
1. **Build & Test** — Installs dependencies and runs Jest tests
2. **Build & Push Docker** — Builds the Docker image and pushes to Docker Hub (only on push to `main`)

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `ARM_CLIENT_ID` | Azure Service Principal Application ID |
| `ARM_CLIENT_SECRET` | Azure Service Principal Password |
| `ARM_TENANT_ID` | Azure Active Directory Tenant ID |
| `ARM_SUBSCRIPTION_ID` | Azure Subscription ID |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password/token |

### Manual Approval Setup
1. Go to **Settings** → **Environments** in your GitHub repo
2. Create an environment named `production`
3. Enable **Required reviewers** and add yourself as a reviewer
4. Now `terraform apply` will wait for your approval before running

---

## 📸 Screenshots

### 1. Docker Image Build Successful (Terminal)
<!-- Replace with your actual screenshot -->
![Docker Build](screenshots/01-docker-build.png)

---

### 2. Docker Image Pushed to Docker Hub
<!-- Replace with your actual screenshot -->
![Docker Push](screenshots/02-docker-push.png)

---

### 3. Terraform Plan Output (Terminal)
<!-- Replace with your actual screenshot -->
![Terraform Plan](screenshots/03-terraform-plan.png)

---

### 4. Terraform Apply Output (Terminal)
<!-- Replace with your actual screenshot -->
![Terraform Apply](screenshots/04-terraform-apply.png)

---

### 5. GitHub Actions — Successful Plan on Pull Request
<!-- Replace with your actual screenshot -->
![GitHub Actions Plan](screenshots/05-github-actions-plan-pr.png)

---

### 6. GitHub Actions — Approved Apply
<!-- Replace with your actual screenshot -->
![GitHub Actions Apply](screenshots/06-github-actions-approved-apply.png)

---

### 7. Browser — Containerized Web App Running
<!-- Replace with your actual screenshot -->
![Web App Running](screenshots/07-web-app-browser.png)

---

### 8. Azure Portal — Resource Group and Resources
<!-- Replace with your actual screenshot -->
![Azure Portal](screenshots/08-azure-portal-resources.png)

---

## 📝 Step-by-Step Detailed Solution

### Phase 1: Application Development

1. **Created a Node.js web application** (`index.js`) using the built-in `http` module
2. The application serves a styled HTML page displaying:
   - Student name: **Jibrel Abubakr Jibrel (3932)**
   - Server information (hostname, platform, Node.js version, uptime, memory)
   - Technology stack badges (Docker, Terraform, Azure ACI, etc.)
3. The application listens on **port 3000**

### Phase 2: Docker Containerization

4. **Wrote a Dockerfile** based on `node:20-alpine` (lightweight image)
5. Used multi-step `COPY` — first `package*.json` for layer caching, then the rest of the source
6. Exposed port 3000 and set the entrypoint to `node index.js`
7. **Built the image locally**: `docker build -t jibrel3932/nodejs-ci-app:latest .`
8. **Tested locally**: `docker run -p 3000:3000 jibrel3932/nodejs-ci-app:latest`
9. **Pushed to Docker Hub**: `docker push jibrel3932/nodejs-ci-app:latest`

### Phase 3: Terraform Infrastructure as Code

10. **Created `providers.tf`** — Configured the `azurerm` provider with version `~> 3.0`
11. **Created `variables.tf`** — Defined 4 input variables:
    - `resource_group_name` → `jibrel-proj2-aci-rg`
    - `location` → `East US`
    - `container_image` → `jibrel3932/nodejs-ci-app:latest`
    - `dns_name_label` → `jibrel-proj2-app`
12. **Created `main.tf`** — Provisioned:
    - **Azure Resource Group** (`jibrel-proj2-aci-rg`) with required tags
    - **Azure Container Instance** (`jibrel-proj2-aci`) with:
      - Public IP address
      - DNS label for FQDN access
      - 0.5 CPU / 0.5 GB memory
      - Port 3000 exposed
      - All required tags (Project, Environment, StudentName)
13. **Created `outputs.tf`** — Exposed container FQDN, public IP, and resource group name
14. **Ran `terraform init`** to initialize the Azure provider
15. **Ran `terraform plan`** to preview the infrastructure changes
16. **Ran `terraform apply`** to provision the resources on Azure

### Phase 4: GitHub Actions CI/CD Pipeline

17. **Created `.github/workflows/terraform.yml`** with two jobs:
    - **terraform-plan**: Runs on every PR and push — initializes, validates, and plans
    - **terraform-apply**: Runs only on push to `main`, requires manual approval via GitHub Environment `production`, then applies the changes
18. **Configured GitHub Secrets** for Azure authentication (ARM_CLIENT_ID, ARM_CLIENT_SECRET, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID)
19. **Set up GitHub Environment** `production` with required reviewers for manual approval gate
20. **Existing `nodejs.yml` workflow** handles Docker image build and push to Docker Hub on every push to `main`

### Phase 5: Verification

21. Created a Pull Request → Verified `terraform plan` runs successfully in GitHub Actions
22. Merged the PR → Approved the manual approval gate → Verified `terraform apply` completes
23. Accessed the web app at `http://jibrel-proj2-app.eastus.azurecontainer.io:3000`
24. Verified resources in Azure Portal (Resource Group + Container Instance with correct tags)

---

## 📁 Repository Structure

```
nodejs-ci-example/
├── .github/
│   └── workflows/
│       ├── nodejs.yml              # CI: Build, test, Docker push
│       ├── cd-automatic.yml        # CD: Automatic deployment
│       └── terraform.yml           # IaC: Terraform plan/apply with approval
├── .gitignore                      # Excludes node_modules, tfstate, .terraform
├── .dockerignore                   # Excludes files from Docker build
├── Dockerfile                      # Container image definition
├── index.js                        # Node.js web application
├── calculator.js                   # Calculator module
├── calculator.test.js              # Jest unit tests
├── package.json                    # Node.js dependencies
├── providers.tf                    # Terraform Azure provider config
├── main.tf                         # Terraform resources (RG + ACI)
├── variables.tf                    # Terraform input variables
├── outputs.tf                      # Terraform output values
└── README.md                       # This documentation
```

---

## 🔗 Repository Link

**GitHub:** [https://github.com/jibrel3932/nodejs-ci-example](https://github.com/jibrel3932/nodejs-ci-example)

---

## 📌 Tags Applied to All Resources

| Tag | Value |
|-----|-------|
| `Project` | Project2 |
| `Environment` | production |
| `StudentName` | Jibrel Abubakr Jibrel |

---

*Cloud Computing & DevOps Engineering — Project 2: Infrastructure as Code with Terraform and Azure ACI*
# Trigger build
