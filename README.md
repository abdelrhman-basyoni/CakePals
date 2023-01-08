<p align="center">
  <a href="https://cake-pals.onrender.com/api" target="blank"><img src="https://i.ibb.co/8PShdRx/cake-pals1.png" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">CakePals is a place where people can sell home-baked cakes to each other.</p>

## Description

CakePals is a place where people can sell home-baked cakes to each other. There are bakers who can
register on CakePals and list their delicious cakes for sale. There are also cake lovers who are eager to
explore new flavours. A customer typically looks for available offerings nearby, creates a member
account  and places a baking order. Bakers receive orders, bake cakes and hand them over
at the agreed collection time. Refer to the Appendix for an example.

## project Requirments
Create a backend API application for CakePals. Consider 3 types of users:

  - guests (unregistered or unauthenticated users);
  - members — registered users that order cakes from bakers;
  - bakers — registered users that offer cakes and get paid.
  
In addition to typical data (e.g. identifiers), consider that:

  - Baker’s profile includes a picture, self-introduction, location, rating, and collection time range.
  - Cake offering includes title, description, price, baking time, and type (e.g. fruit cake, meat pie).
  - Order information includes payment method and collection time.
  
Here are the features that we ask you to implement

  - Bakers and members can register, log in and log out.
  - Bakers can add new cakes for selling and then edit or remove their offerings.
  - All users can list available cake offerings and filter them by location and type.
  - All users can see a baker’s profile (with description and rating).
  - Members can see available collection times and place orders. For collection time availability,
  assume that each baker can bake only one cake at a time (see an example in the Appendix).
  - Bakers can see their orders, accept, reject and fulfil them.
  - Customers can rate their fulfilled orders. Orders rates form the overall baker’s rating.
  
## FlowCharts
  - you can review some flow charts for the projects logics here [flowcharts](https://www.figma.com/file/hbQ6KYq9XtHl9AErwdeLSG/Untitled?node-id=0%3A1&t=nd1vWkvqqSiBbXmI-1)

## Api Documentations
  - [here](https://cake-pals.onrender.com/api)
## Features ( To be Added)

  - we need to add calculation matrix for the bakers to define how the cake-pals will charge them ( subscription module or percentage )
  - currently payment method is cash on collection (COC), we can add new payment methods.
  - keep track of the user search and interest  and integrate that into dashboard to help the marketing team, to develop campagins and targeted ads
  - create a dashboard for the baker to monitor their businesses
  - add email verification (didnt had time for it)
  - add notification services  (by email or firebase)
  - notifiy the baker when there is a new order 
  - notify the user when his order has been created
  - clear the orders that has been pending for over 15 min or 10 and tell the user sorry it has been not accepted.
  - add cancel order logic so that the user can  cancel his order within the first 15 min.
  - the previous point open a new rabbit hole ( how are the business going to handle the cakes that the user didnt pick/
    - change the payment to be card only ?
    - how are we going to compensate the baker in these cases
    - what if the other way happened the user went and didnt find the cake ?


# Installation
## A-Locally
### Prerequistes
  - create a .env file at the root and add the keys like in .env.example file with ur actuall links and data
  - to run it locally you need:
    - redis server installed on the host machine, or remote 
    - mongodb instance ready and configured as replicaset not as standalone.


### Install packages
```bash
$ npm install
```

### Running the app

```bash


# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## B-Docker
    

```bash
$ docker build .
$ docker-compose up
```
## Test


```bash
# to run tests
$ npm run test

```
# Deployment
  - deployed the app using [Render](https://render.com/)
  - there is CD on the branch that is called render
#  Things to consider:
  - use a tool like [new Relic](https://newrelic.com/) in production
  - configure the database backup.
  - configure cors
  - configure csrf.
      
## Technologies
- Nodejs
- nestjs
- TypeScript
- mongodb
- jest
- redis
- Docker


