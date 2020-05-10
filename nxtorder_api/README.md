# Nxt-Order API Server

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


## Prerequisites

* MongoDB - Download and Install [MongoDB](https://www.mongodb.com/download-center#community) - As we are using mongoose, you'll need mongoDB to be installed and have the `mongod` process running.
* NodeJS - Download and Install [NodeJS](https://nodejs.org/en/download/) - The project's is written in NodeJS.
* Redis - Download and Install [Redis](http://redis.io/download) - As we are using redis for invalidating json web token, you'll need redis to be installed and have the `redis-server` process running.


## Usage

Clone the repository
```
git clone https://bitbucket.com/ajaykoppisetty/next-order-api.git .
```

change the directory
```
cd next-order-api
```

Then install all the node dependencies
```
npm install
```

Run node application in development mode
```
npm run debug
```
