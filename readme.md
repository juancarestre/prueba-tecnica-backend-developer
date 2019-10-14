# prueba-tecnica-backend-developer

Fictitious e-commerce platform where you buy with bitcoin, to simulate transactions you can use the Bitcoin Testnet.

Platform wallet address:

    mxgD3HgYEYQ1JeF9yFoydtEiyVHs7HNPp9



To check the balance in the account check the testnet wallet [in this page](https://counterwallet-testnet.coindaddy.io/#) using the this has 12 word access passphrase:

    yearn decay flow bedroom observe hair blonde prayer laugh shall street egg

## Getting Started

For a quick start clone the repository and run

     ./start.sh

To stop the services:

    ./down.sh

### How this works


*   There are 3 microservices and 1 mongo database: user-service, dashboard-service, shopping-service 
* Each microservice runs in a docker container
* Mongo database runs attached by docker-compose to user-service
* Docker-compose runs the containers and attaches them to the same docker network


### API endpoints

[Here](https://documenter.getpostman.com/view/9136570/SVtWxnqu?version=latest) is the postman collection, also its attached in this repository.

To buy a product

* create a user in localhost:8080/user/create
* get logged and copy the auth token using localhost:8080/user/login
* put the token as 'x-auth' header
* check the available products in localhost:8081/product/list
* do the transaction to the platform wallet (mxgD3HgYEYQ1JeF9yFoydtEiyVHs7HNPp9), using [mempool testnet faucet](https://testnet-faucet.mempool.co/) or [coinfaucet](https://coinfaucet.eu/en/btc-testnet/)
* copy the transaction id
* confirm the transaction in the platform using the endpoint localhost:8081/product/buy/:id/:transactionid, where id is the product id to buy
* to check your transaction you can use the endpoint localhost:8082/transaction/check/:transactionId
* wait for the confirmation, the platform assumes that the transaction was confirmed if the transaction has atleast one confirmation, to check confirmations visit: [https://live.blockcypher.com/btc-testnet/](https://live.blockcypher.com/btc-testnet/) and search your transaction id



### Prerequisites

[Docker](https://www.docker.com/) to manage containers

[Postman](https://www.getpostman.com/) to test apis

### Installing

Run:

    ./start.sh


To initialize the 3 microservices

Or run:

    docker-compose -f .\docker-compose.yml -f .\docker-compose.dev.yml up --build

Inside packages/user-service, packages/dashboard-service and packages/shopping-service, 
respectively and in the same order, this because the first microservice attaches the database and the docker network to where the other services connect

## Running the tests

Only user-service has a few tests 😕, to run the tests executes the following command inside the packages/user-service folder:

    docker-compose -f .\docker-compose.yml -f .\docker-compose.test.yml up --build

This initiate a different database and seed it with test seed data, after that mocha run the tests


### 
    dtengo: mwREqD3yh774ATZQHxEKUaqWaoj8Y9LDXw
    el wallet de mi tienda: mxgD3HgYEYQ1JeF9yFoydtEiyVHs7HNPp9

