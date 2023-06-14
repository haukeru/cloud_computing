CREATE DATABASE IF NOT EXISTS shipments_wi_g001;
USE shipments_wi_g001;

CREATE TABLE IF NOT EXISTS Shipments (
    ShipmentId INT,
    Date DATE,
    PLZ_From VARCHAR(10),
    PLZ_To VARCHAR(10),
    Weight DOUBLE,
    Status INT,
    Last_Update DATE
);

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/data.csv' 
INTO TABLE Shipments
FIELDS TERMINATED BY '\t' 
LINES TERMINATED BY '\n' 
IGNORE 1 ROWS
(ShipmentId, @var1, PLZ_From, PLZ_To, Weight, Status, @var2)
SET Date = STR_TO_DATE(@var1, '%d.%m.%Y'), Last_Update = STR_TO_DATE(@var2, '%d.%m.%Y');
