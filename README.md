Ponthos (js) Framework. 
(Ponthos is the name of the captains dog -  John Archer ,star trek) 


This is the framework we have made in node js for several projects. 
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

This fw works with local database mongodb configured on port 27017 (replicaset 3 nodes or single standalone).
See the config file (config.js) 
E2e test folder , shows how to implement a POST call to the server.
Also can be used to generate the post postman call.
The configuration file used to define the http and https ports server 
operation as well as the maximum number of parallel processes that can 
be used by each call to the post method.

Some examples can you see at mobile & translator services
(test e2e too)
resizing on the fly examples:
http://localhost:3000/images/10.jpg?dim=320x200
http://localhost:3000/images/10.jpg?dim=640x480 

This api translator (translate.route) use google translator facility
start server:
1) in standalone node: node single.js .
2) cluster mode: node cluster.js .

Main features:
1) Part of a skeleton already prefixed, structured and clustered.
2)Simplify the configuration of http / https accesses.
3)Public part to integrate with angular / html5 / css for backoffice management.
4) makes "resizing on the fly" of images, very useful for mobile devices.
5) Integrates TDD tests with mocha
6) Management of dynamic routes and services with the possibility of caching content.
7) It establishes "synchronous" design patterns within the services.
8) Simplifies the tracing of data by including your own lib.
9) Integrates the parallel processing of the request.
10) It is installed and tested in production environments.
(spain masterchef 2014,2015,2016 & nov. 2017 editions)
(televisa logout/login/flip)
(NBC Telemundo señora acero && señor de los cielos)

