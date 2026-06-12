variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "jibrel-proj2-aci-rg"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "East US"
}

variable "container_image" {
  description = "Docker Hub image to deploy (e.g., username/repo:tag)"
  type        = string
  default     = "jibrel3932/nodejs-ci-app:latest"
}

variable "dns_name_label" {
  description = "DNS name label for the container's public FQDN"
  type        = string
  default     = "jibrel-proj2-app"
}
