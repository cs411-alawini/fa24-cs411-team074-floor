# SQL Tables
## DDL Commands
```sql
CREATE TABLE Skin (
    SkinID VARCHAR(255) PRIMARY KEY,
    Image VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NOT NULL
);

CREATE TABLE Room (
    RoomID VARCHAR(255) PRIMARY KEY,
    Log VARCHAR(255),
    ChatLog VARCHAR(255)
);

CREATE TABLE Account (
    UserID VARCHAR(255) PRIMARY KEY,
    Pass VARCHAR(255) NOT NULL,
    CurrentSkin VARCHAR(255),
    RoomID VARCHAR(255),
    Balance INT,
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID),
    FOREIGN KEY (CurrentSkin) REFERENCES Skin(SkinID)
);

CREATE TABLE Inventory(
    UserID VARCHAR(255),
    SkinID VARCHAR(255),
    FOREIGN KEY (UserID) References Account(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SkinID) References Skin(SkinID),
    PRIMARY KEY (UserID, SkinID)
);


CREATE TABLE Transaction (
    TransactionID VARCHAR(255) PRIMARY KEY,
    SenderID VARCHAR(255), 
    ReceiverID VARCHAR(255), 
    Amount INT NOT NULL,
    DateTime DATETIME NOT NULL,
    Description VARCHAR(255),
    FOREIGN KEY (SenderID) REFERENCES Account(UserID) ON DELETE SET NULL,
    FOREIGN KEY (ReceiverID) REFERENCES Account(UserID) ON DELETE SET NULL
);


CREATE TABLE GameHistory(
    HandID VARCHAR(255),
    UserID VARCHAR(255),
    DateTime DATETIME NOT NULL,
    buyin VARCHAR(255),
    blinds_level INT,
    init_stack INT,
    position INT,
    action_pre VARCHAR(255),
    action_flop VARCHAR(255),
    action_turn VARCHAR(255),
    action_river VARCHAR(255),
    all_in BOOLEAN,
    cards VARCHAR(255),
    board_flop VARCHAR(255),
    board_turn VARCHAR(255),
    board_river VARCHAR(255),
    pot_pre INT,
    pot_flop INT,
    pot_turn INT,
    pot_river INT,
    ante INT,
    bet_pre INT,
    bet_flop INT,
    bet_turn INT,
    bet_river INT,
    result VARCHAR(255),
    balance INT,
    PRIMARY KEY (HandID, UserID),
    FOREIGN KEY (UserID) REFERENCES Account(UserID)
);
```
## MySQL CLI Table Screenshots
### Tables
![tables](imgs/connection.png)
### Total Row Counts
![alt_text](imgs/rowCounts.png)


# Advanced SQL Queries

## 1. User Performance Query
The query retrieves the user performance for different moves in gameplay, showing the average balance and win rate for each type of game action that they do.

### SQL Code
```sql
SELECT UserID, action, AVG(balance) AS AvgBalance, SUM(CASE WHEN balance > 0 THEN 1 ELSE 0 END) / COUNT(balance) AS WinRate
FROM 
    (SELECT UserID, balance, action_pre AS action
        FROM GameHistory
        UNION ALL
        SELECT UserID, balance, action_flop AS action
        FROM GameHistory
        UNION ALL
        SELECT UserID, balance, action_turn AS action
        FROM GameHistory
        UNION ALL
        SELECT UserID,  balance, action_river AS action
        FROM GameHistory) AS T
GROUP BY action, UserID
ORDER BY UserID, WinRate DESC
LIMIT 15;
```
### Example Execution on MySQL DB
![alt_text](/doc/imgs/query1.png)

## 2. Currently Playing With
This query returns the skins of all the players in a specific room. 

### SQL Code
```sql
SELECT UserID, Image
FROM (SELECT * FROM Account WHERE RoomID = 0) AS UserInRooms
JOIN Skin ON SkinID = CurrentSkin
LIMIT 15;
```
### Example Execution on MySQL DB
![alt_text](/doc/imgs/query2.png)

## 3. Activity Tracker
This query retrieves the daily activity of a user over multiple days, specifically counting the total amount of transactions that occur in game and outside of the games every day. 

### SQL Code
```sql
SELECT g.UserID, g.Date, g.GameCount, t.NonGameCount, g.GameCount + t.NonGameCount AS TotalActivity
FROM 
    (SELECT UserID, DATE(DateTime) AS Date, COUNT(*) AS GameCount
     FROM GameHistory
     GROUP BY UserID, DATE(DateTime)) AS g
JOIN 
    (SELECT DISTINCT UserID, Date, COUNT(*) AS NonGameCount
     FROM 
((SELECT SenderID AS UserID,  DATE(DateTime) AS Date 
FROM Transaction 
WHERE SenderID <> 'TEXAS_HOLDEM')
 UNION ALL 
(SELECT ReceiverID AS UserID,  DATE(DateTime) AS Date 
FROM Transaction 
WHERE ReceiverID <> 'TEXAS_HOLDEM' )) AS CombinedTransactions
    GROUP BY UserId, Date) AS t
ON g.UserID = t.UserID AND g.Date = t.Date
ORDER BY g.Date
LIMIT 15;
```

### Example Execution on MySQL DB
![alt_text](/doc/imgs/query3.png)

## 4. Game Cash Flow
This query retrieves all the transactions for a specific game, in this case being the Texas Hold’Em game.

### SQL Code
```sql
SELECT TransactionID, SenderID, ReceiverID, Amount, CONVERT(DateTime, DATE) AS TransactionDate
FROM Transaction
WHERE SenderID = 'TEXAS_HOLDEM' OR ReceiverID = 'TEXAS_HOLDEM'
GROUP BY TransactionDate, TransactionID, SenderID, ReceiverID, Amount
LIMIT 15; 
```

### Example Execution on MySQL DB
![alt_text](/doc/imgs/query4.png)

## 5. Round statistics
This query retrieves the game histories of all players involved in the game that a specific player was in. The results will be grouped by players to show the individual stats of the players involved in the game. 
### SQL Code
```sql
SELECT 
    UserID,
    SUM(CASE WHEN balance > 0 THEN 1 ELSE 0 END) AS Positive,
    SUM(CASE WHEN balance < 0 THEN 1 ELSE 0 END) AS Negative,
    SUM(CASE WHEN balance = 0 THEN 1 ELSE 0 END) AS Zero
FROM GameHistory
WHERE  handID IN ( SELECT handID 
FROM GameHistory g 
WHERE g.UserID LIKE "00021ae5")
GROUP BY UserID
LIMIT 15;
```
### Example Execution on MySQL DB
![alt_text](/doc/imgs/query5.png)

*Note: the output is less than 15 rows. We will be using this query to get stats on every person the arbitrarily selected user* `00021ae5` *played against. When the user* `00021ae5` *plays against more distinct people, this set will increase. We will call this query when we have a specific UserID we want to look at.*

