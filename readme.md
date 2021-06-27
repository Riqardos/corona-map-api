ibmcloud login

 

ibmcloud cr login - docker login
kubectl create deployment corona-deploy --image=de.icr.io/muni_coronamap/muni_coronamap@sha256:48be692495ebf139b27a5b32ab337d251391bd13822c43079c67875238d45332
kubectl get pods

kubectl expose deployment.apps/corona-deploy --type=NodePort --port=80 --name=coronamap-service --target-port=80
kubectl describe service coronamap-service 

```
kubectl apply -f .\kuber-cors-app.yml 
kubectl expose pod/corona-cors-app --type=NodePort --port=8080 --name=corona-cors-service --target-port=8080
kubectl describe service corona-cors-service
```
- check servise nodeport and set it with wholu url and port as `REACT_APP_BASE_URL` env variable in `kuber-web-app.yml`

kubectl apply -f .\kuber-web-app.yml 
kubectl expose pod/corona-web-app --type=NodePort --port=80 --name=corona-web-app-service --target-port=80
kubectl describe service corona-web-app-service
