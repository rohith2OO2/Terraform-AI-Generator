# Terraform AI Generator

AI-powered Terraform code generator using:

- Ollama
- Qwen 2.5 Coder 3B
- Docker
- Nginx
- HTML
- JavaScript

## Architecture

Browser
   |
   v
Nginx
   |
   v
Ollama
   |
   v
Qwen 2.5 Coder 3B

## Docker Containers

### terraform-ai-ui

Frontend and Nginx reverse proxy.

Port:

80

### ollama

Ollama AI model server.

Port:

11434

Ollama is accessible only inside the Docker network.

## Start Application

```bash
docker compose up -d --build
