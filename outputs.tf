output "container_fqdn" {
  description = "Fully Qualified Domain Name of the container"
  value       = azurerm_container_group.aci.fqdn
}

output "container_ip" {
  description = "Public IP address of the container"
  value       = azurerm_container_group.aci.ip_address
}

output "resource_group_name" {
  description = "Name of the Azure Resource Group"
  value       = azurerm_resource_group.rg.name
}
