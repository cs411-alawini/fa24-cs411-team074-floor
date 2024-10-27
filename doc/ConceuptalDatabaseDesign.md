# Normalized Database in 3NF

`User(UID, Password, Balance, CurrentSkin, RoomID)`

- The `User` entity is 3NF as it meets the following criteria:  
  -  It matches 1NF  
    - All attributes of this table contain atomic values   
    - There can be no row which contains multiple values per attribute  
  - It matches 2NF  
    - `User` is in 1NF  
    - All non key attribute values are dependent on the primary key (UID, RoomID) as their values are all specific and dependent on this composite key pair. In this case, we group attributes RoomID and UID to be our primary keys because the attribute RoomID by itself is not dependent on UID. Therefore, because a user is not constrained to only visit one room ever, grouping both attributes to be the primary key allows us to have entries of the user in any possible room, albeit one room at a time.  
  - It matches 3NF  
    - `User` is in 2NF  
    - There are no transitive dependencies. No non key attribute in this table determines any other non key attribute value. They are all solely dependent on the primary key pair.

`Room(RoomID, Log, ChatLog)`

- The `Room` entity is 3NF as it meets the following criteria:  
  -  It matches 1NF  
    - All attributes of this table contain atomic values   
    - There can be no row which contains multiple values per attribute  
  - It matches 2NF  
    - `Room` is in 1NF  
    - All non key attribute values are dependent on the primary key RoomID. The `Room` log and chat log are solely dependent and specific to the `Room` it is associated to  
  - It matches 3NF  
    - `Room` is in 2NF  
    - There are no transitive dependencies as the chat log and log do not determine each other

`GameHistory((HandID, UID), DateTime, buyin, blinds_level, …, result, balance)`

- The `GameHistory` entity is 3NF as it meets the following criteria:  
  -  It matches 1NF  
    - All attributes of this table contain atomic values   
    - There can be no row which contains multiple values per attribute  
  - It matches 2NF  
    - `GameHistory` is in 1NF  
    - All non-key attribute values are dependent on the primary key (HandID, UID) as their values are all specific and dependent on the game that is being played. Essentially, a specific instance of a game played tells us the in-game statistics. Additionally, because the HandID is not dependent on the game UID, we group these two attributes together as primary keys.  
  - It matches 3NF  
    - `GameHistory` is in 2NF  
    - There are no transitive dependencies. No non key attribute in this table determines any other non key attribute value. They are all solely dependent on the primary keys.

`Transaction(TransactionID, SenderUID, ReceiverUID, Amount, DateTime, Description)`
- The `Transaction`  entity is 3NF as it meets the following criteria:  
  -  It matches 1NF  
    - All attributes of this table contain atomic values   
    - There can be no row which contains multiple values per attribute  
  - It matches 2NF  
    - `Transaction` is in 1NF  
    - All non key attribute values are dependent on the primary key `Transaction` ID as their values are all specific and dependent on the transaction being completed  
  - It matches 3NF  
    - `Transaction`  is in 2NF  
    - There are no transitive dependencies. No non key attribute in this table determines any other non key attribute value. They are all solely dependent on the primary key.

`Inventory(UID, SkinID)`

- The Inventory relationship is 3NF as:  
  - Contains only atomic values  
  - No non key attributes  
  - There are no transitive dependencies

`Skin(SkinID, Image, Description)`

- The `Skin` entity is 3NF as it meets the following criteria:  
  - It matches 1NF  
    - All attributes of this table contain atomic values   
    - There can be no row which contains multiple values per attribute  
  - It matches 2NF  
    - `Skin` is in 1NF  
    - All non key attribute values are dependent on our primary key SkinID because the image and description are dependent on what the skin is  
  - It matches 3NF  
    - `Skin` is in 2NF  
    - There are no transitive dependencies. Image does not determine Description, and vice versa.

# Logical Design/Relational Schema

```sql
User(
    UID: VARCHAR(255), 
    RoomID: VARCHAR(255) [FK to Room.RoomID], 
    Password: VARCHAR(225), 
    Balance: INT, 
    CurrentSkin: VARCHAR(255) [FK to Skin.SkinID], 
    (UIC, RoomID) [PK]
)
```

```sql
Room(
    RoomID: VARCHAR(255) [PK], 
    Log: VARCHAR(255), 
    ChatLog: VARCHAR(255)
)
```

```sql
GameHistory(  
    HandID: VARCHAR(255),  
    UID: VARCHAR(255) [FK to User.UID],  
    DateTime: DATETIME ,  
    buyin: REAL,  
    blinds_level: INT,  
    init_stack: INT,  
    position: INT,  
    action_pre: VARCHAR(255),  
    action_flop: VARCHAR(255),  
    action_turn: VARCHAR(255),  
    action_river: VARCHAR(255),  
    all_in: BOOLEAN,  
    cards: VARCHAR(255),  
    board_flop: VARCHAR(255),  
    board_turn: VARCHAR(255),  
    board_river: VARCHAR(255),  
    pot_pre: INT,  
    pot_flop: INT,  
    pot_turn: INT,  
    pot_river: INT,  
    ante: INT,  
    blinds: INT,  
    bet_pre: INT,  
    bet_flop: INT,  
    bet_turn: INT,  
    bet_river: INT,  
    result: VARCHAR(255),  
    balance: INT,  
    (HandID, UID) [PK]  
)
```

```sql
Transaction(
    TransactionID: VARCHAR(255) [PK], 
    SenderUID: VARCHAR(255) [FK to User.UID], 
    ReceiverUID: VARCHAR(255) [FK to User.UID], 
    Amount: INT, 
    DateTime: DATETIME, 
    Description: VARCHAR(255)
)
```
```sql
Skin(
    SkinID: VARCHAR(255) [PK], 
    Image: VARCHAR(255), 
    Description: VARCHAR(255))
```
```sql
Inventory(
    UID: VARCHAR(255) [FK to User.UID], 
    SkinID: VARCHAR(255) [FK to Skin.SkinID],
    (UID, SkinID) [PK]
)
```