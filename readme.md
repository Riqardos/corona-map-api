# Corona visualisation app
Basic web-app visualisationing corona stats in Slovakia. Data from [NCZI](https://data.korona.gov.sk/).

Data types:
- Ag tests
- Hospital beds
- Patients in hospital

## Localhost test
- install docker and docker-compose
- run `docker-compose up` - builds and starts containers

## IBM cloud
# Prerequisities
- IBMcloud CLI installed
- container registry installed - `ibmcloud plugin install container-registry`
- container servise installed - `ibmcloud plugin install container-service`

# Login and setup kubernetes cluster
- cluster need to be created 
- `ibmcloud login` to login to IBM cloud
- `ibmcloud login -a cloud.ibm.com -r eu-de -g Default` - docker login to IBM cr
- `ibmcloud ks cluster config --cluster <cluster-id>` - set config of cluster
- `ibmcloud ks workers --cluster <cluster name>` - show cluster info
- create docker image
- download cors-web-app-image `docker pull redocly/cors-anywhere`
- `docker tag <local_image> de.icr.io/<my_namespace>/<my_repo>:<my_tag>` - tag both images
kubectl get pods

### Deploy cors web service
- set image name based on name in container registry in `.\kuber-cors-app.yml`
- `kubectl apply -f .\kuber-cors-app.yml` - deploy app based on yml file
- `kubectl expose pod/corona-cors-app --type=NodePort --port=8080 --name=corona-cors-service --target-port=8080` - create service
- `kubectl describe service corona-cors-service` - shows service info and extract the port the service is running on

### Deploy corona web app 
- set image name based on name in container registry in `.\kuber-web-app.yml`
- set `REACT_APP_BASE_URL` env variable in `.\kuber-web-app.yml` based on url **cors-service** is running on
- `kubectl apply -f .\kuber-web-app.yml` - deploy app basd on yml file 
- `kubectl expose pod/corona-web-app --type=NodePort --port=80 --name=corona-web-app-service --target-port=80` - create web app
- `kubectl describe service corona-web-app-service` - shows info about service and port the web-app is running on
