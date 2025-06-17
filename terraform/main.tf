provider "azurerm" {
  features {}

   subscription_id = "00f5f5c1-11f1-4eba-8e30-74c62ad0a814"
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-strapi"
  location = "East US"
}

resource "azurerm_container_group" "strapi" {
  name                = "strapi-container"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"

  container {
    name   = "strapi"
    image  = "xiristian/strapi-app:latest"
    cpu    = "1"
    memory = "1.5"

    environment_variables = {
      APP_KEYS         = var.app_keys
      API_TOKEN_SALT   = var.api_token_salt
      ADMIN_JWT_SECRET = var.admin_jwt_secret
    }

    ports {
      port     = 1337
      protocol = "TCP"
    }
  }

  image_registry_credential {
    server   = "index.docker.io"
    username = var.dockerhub_username
    password = var.dockerhub_password
  }

  ip_address_type = "Public"
  dns_name_label  = "strapi-demo-${random_id.id.hex}"
}

resource "random_id" "id" {
  byte_length = 4
}
