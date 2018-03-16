Ponthos (js) Framework. 
(Ponthos is the name of the captains dog -  John Archer ,star trek) 


This is the framework we have made in node js for this project. 
This framework is under the Test Development Design methodology and already has 
all the necessary scalability features to offer an advanced performance. 
This Framework is based on a model of routes and services, 
which allows defining the necessary flows in the rest services,
 to achieve effective communication with third-party APIs, 

You will se a different folders:
cert: contains the certificates oh the server ( https)
connector: contains the mongoldb connector module
And de main folder are:
lib/routes: contains the entry points os the api-framework
lib/schemas; contains the necessary validation schemes to fix entry data values
lib/services: contains the business rules and define the waterfall process

This Fw enable to pass scheme to input data, and define
a parallel mode to handle concurrent request.
Inside of the services, you can be put your bussines rules inside a,
waterfall pattern, avoiding the callback hell.

Some examples can you see at mobile & translator services
(test e2e too)



Test 
======

Place test directories as per-domain-based test

#Documentation
* *unit*: Unit test
* *e2e*: End to End
* ...

