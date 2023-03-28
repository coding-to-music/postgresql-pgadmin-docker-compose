#!/bin/bash

# docker ps -aq

# docker stop $(docker ps -aq)
docker rm $(docker ps -aq) 
docker-compose down --volumes

docker volume prune -f
docker container prune -f
docker network prune -f

# docker image prune -a