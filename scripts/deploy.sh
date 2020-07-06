echo "searching for exited containers"
if [ "$(docker ps -a -f status=exited -q)" ]; then
    echo "exited containers found"
    echo "stopping and removing exited containers"
    docker rm $(docker ps -a -f status=exited -q)
fi
echo "searching for existing containers"
if [ "$(docker ps -q -f name=puppeteer-recorder)" ]; then
    echo "existing containers found"
    echo "stopping and removing existing containers"
    docker stop puppeteer-recorder
    docker rm puppeteer-recorder
fi
echo "searching for untagged images"
if [ "$(docker images -f "dangling=true" -q)" ]; then
      echo "untagged images found, removing them"
      docker rmi $(docker images -f "dangling=true" -q)
fi
echo "starting new container"
docker run -d -p 3002:3002 --name puppeteer-recorder puppeteer-recorder
 