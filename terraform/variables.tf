variable "dockerhub_username" {
  type = string
}

variable "dockerhub_password" {
  description = "Docker Hub password"
  type        = string
  sensitive   = true
}

variable "app_keys" {
  type = string
}

variable "api_token_salt" {
  type = string
}

variable "admin_jwt_secret" {
  type = string
}
