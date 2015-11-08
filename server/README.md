## To Run this Server (tested on Ubuntu 14.04)
 - Prepare System for Install
```
sudo apt-get update
sudo apt-get upgrade
```
 - Install npm and nodejs https://nodejs.org/en/download/
```
curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install --yes nodejs
```
 - Install MongoDB http://docs.mongodb.org/manual/installation/
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get install -y mongodb-org
```

 - Run the Following Commands: (in terminal of the project root folder)
```
sudo service mongod start
mongoimport --db api --collection test --drop --file database-dump/database.json
npm install
npm start
```


Navigate to:
http://localhost:3000/api/test?id=Emily

You should see a response that displays Emily's password.

##Documentation

#####Server Configurations:
 - Found in config/application.js
 - Default Port: 3000

#####API Endpoints:
 - Found in routes/api.js
 - API's can be found at http://\<YOUR-SERVER-IP\>/api/\<YOUR-API-ENDPOINT\>

#####CORS Data:
 - Found in config/routes.js
 - Default: Enable all GET and POST requests from all origins
