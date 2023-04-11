sudo kubectl delete secret nautilus-meta
sudo kubectl create secret generic nautilus-meta --from-env-file=.env
sudo kubectl replace -f ./kubernetes/deployment_service.yaml