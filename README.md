<p align="center">
  <a href="#" target="blank"><img src="https://i.ibb.co/8PShdRx/cake-pals1.png" width="200" alt="Nest Logo" /></a>
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
  

## Installation

```bash
$ npm install
```

## Running the app

```bash


# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# to run tests
$ npm run test

# test coverage
$ npm run test:cov
```
## Technologies
- Nodejs
- nestjs
- TypeScript
- mongodb
- jest
- redis


