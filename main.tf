# -----------------------------------------------
# Resource Group
# -----------------------------------------------
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Project      = "Project2"
    Environment  = "production"
    StudentName  = "Jibrel Abubakr Jibrel"
  }
}

# -----------------------------------------------
# Azure Container Instance (ACI)
# -----------------------------------------------
resource "azurerm_container_group" "aci" {
  name                = "jibrel-proj2-aci"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  ip_address_type     = "Public"
  dns_name_label      = var.dns_name_label

  container {
    name   = "nodejs-app"
    image  = var.container_image
    cpu    = "0.5"
    memory = "0.5"

    ports {
      port     = 3000
      protocol = "TCP"
    }
  }

  tags = {
    Project      = "Project2"
    Environment  = "production"
    StudentName  = "Jibrel Abubakr Jibrel"
  }
}
