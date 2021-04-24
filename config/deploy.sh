#!/bin/bash
DOCKER_PATH=../docker/
APP_CONTAINER_NAME=nest-app
NGINX_CONTAINER_NAME=blog-nginx

EXIST_BLUE=$(docker-compose -p ${APP_CONTAINER_NAME}-blue -f ${DOCKER_PATH}docker-compose.blue.yml ps | grep Up)
RUN_NGINX=$(docker ps --filter name=${NGINX_CONTAINER_NAME} | grep Up)

if [ -z "$EXIST_BLUE" ]; then
	echo "blue up"
	docker-compose -p ${APP_CONTAINER_NAME}-blue -f ${DOCKER_PATH}docker-compose.blue.yml up -d

	sleep 10

	docker-compose -p ${APP_CONTAINER_NAME}-green -f ${DOCKER_PATH}docker-compose.green.yml down
else
	echo "green up"
	docker-compose -p ${APP_CONTAINER_NAME}-green -f ${DOCKER_PATH}docker-compose.green.yml up -d

	sleep 10

	docker-compose -p ${APP_CONTAINER_NAME}-blue -f ${DOCKER_PATH}docker-compose.blue.yml down
fi

if [ -z "$RUN_NGINX" ]; then
  echo "run nginx"
  docker-compose -f ${DOCKER_PATH}/docker-compose.yml up
fi
