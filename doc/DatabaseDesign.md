# DDL Commands

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