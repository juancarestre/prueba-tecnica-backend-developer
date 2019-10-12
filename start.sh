#!/bin/bash
docker-compose -f .\\packages\\user-service\\docker-compose.yml -f .\\packages\\user-service\\docker-compose.dev.yml up --build -d
docker-compose -f .\\packages\\shopping-service\\docker-compose.yml -f .\\packages\\shopping-service\\docker-compose.dev.yml up --build -d
docker-compose -f .\\packages\\dashboard-service\\docker-compose.yml -f .\\packages\\dashboard-service\\docker-compose.dev.yml up --build -d
