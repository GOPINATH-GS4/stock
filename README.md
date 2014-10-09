#### Stock data collection

This project consists of two sections 
1. Stock data collection 
2. Stock data API 

##### Stock Data collection  

The stock data collection scripts are stored in scripts folder, there are two programs 

1. createTickerFromFile.js
   
   The createTickerFrom file gets data from '|' delimited data file containing ticker symbol, name and exchange and loads into mongodb document using mongoose.js, the structure of the document is 
   
````
var Ticker = new Schema({
        ticker: {type: String, trim:true, required: true, index: { unique: true, sparse: true } }
        ,name:        String······
        ,exchange:     String
        ,profile:     [Profile]·····
        //,dataTypes              : {type: [DataTypes],required:true}

    });  

````
Profile is not implemented yet 
    
	
2. getStock.js

	The getStock program collects data every minute (default) and stores it in the collection called stock, described below 
	
````
var Stock = new Schema({
     id: Number
     ,t: String
     ,e: String
     ,l: Number
     ,l_fix: Number
     ,l_cur: Number·
     ,s: Number
     ,ltt: String
     ,lt_dts: Date
     ,c: String
     ,c_fix: String
     ,cp: Number
     ,cp_fix: Number
     ,ccol: String
     ,pcls_fix: Number
    });
````

Google financial services api is used for collecting the data 




##### Stock data API 
###### Standard Error codes and messages
###standard error codes and messages
the following standard error codes can be emitted as output for any end point

| Status      | Message                                           |
|-------------|---------------------------------------------------|
| 200         | Success                                           |
| 400         | Bad request - malformed request                   |
| 401         | not authorized                                    |
| 500         | failure - something went wrong in the code        |

and the following error codes related to data submitted and results returned

| Status      | Message                                           |
|-------------|---------------------------------------------------|
| 1000        | incorrect input - one or more fields missing      |
| 1001        | no result found                                   |
| 1002        | more than one result found - expecting just one   |
| 1003        | one result found - expecting more than one        |
| 1004        | one result found - expecting no result            |


The stock data api is a express server supporting the following end points


###### Root / [Index]
| parameter   | value                                                                |
|-------------| ---------------------------------------------------------------------|
| end point   | /                                              |
| verb        | GET                                                                 |

Just displays the success message, To be IMPLEMENTED 


###### Tickers 

| parameter   | value                                                                |
|-------------| ---------------------------------------------------------------------|
| end point   | /ticker                                               |
| verb        | GET                                                                 |

Displays the ticker from ````Tickers```` collections above 

###### Data 
| parameter   | value                                                                |
|-------------| ---------------------------------------------------------------------|
| end point   | /data?ticker=""  // e.g AAPL                                             |
| verb        | GET                                                                 |


Displays all the stock data for a given ticker ordered by date-timestamp desc 

If the URL query syntax is incorrect you will get ````{
status: 1000,
message: "incorrect input - one or more fields missing"
}````


if no data found you will get ````{
status: 1001,
message: "no result found"
}````


### Installation instructions 

to set up the framework and library 

1. git clone git@github.com:GOPINATH-GS4/stock.git
2. npm install 
3. Install mongodd, please refer to 
[Mongodb Installation](http://docs.mongodb.org/manual/installation/ "Link to mongodb install document")

##### Creating Ticker master data 

create data before starting the getStock.js program, an example file called ````dfile```` is provided under scripts directory 

node createTickerFromFile.js dfile 

#### Running stock data collection 

nohup node getStock.js & 


#### Starting the server   

Under the root folder execute 

. ./.env.development 
start mongodb 

node server.js 

All data will be stored into a database called stock 



