from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Flask, request, jsonify
from mysql.connector import connection
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

# connection = mysql.connector.connect(
#     host="34.41.165.201",
#     user="root",
#     password="GambitGallery!",
#     database="gambit_gallery"
# )


connection = connection.MySQLConnection(
    user="root",
    database="gambit_gallery"
)

cursor = connection.cursor(dictionary=True)

queries = {
    "UP": '''
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
ORDER BY UserID, WinRate DESC''',
    "CPW" : '''
SELECT UserID, Image
FROM (SELECT * FROM Account WHERE RoomID = 0) AS UserInRooms
JOIN Skin ON SkinID = CurrentSkin''',
    "AT" : '''
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
ORDER BY g.Date''',
    'GCF' : '''
SELECT TransactionID, SenderID, ReceiverID, Amount, CONVERT(DateTime, DATE) AS TransactionDate
FROM Transaction
WHERE SenderID = 'TEXAS_HOLDEM' OR ReceiverID = 'TEXAS_HOLDEM'
GROUP BY TransactionDate, TransactionID, SenderID, ReceiverID, Amount''',
    'RS' : '''
SELECT 
    UserID,
    SUM(CASE WHEN balance > 0 THEN 1 ELSE 0 END) AS Positive,
    SUM(CASE WHEN balance < 0 THEN 1 ELSE 0 END) AS Negative,
    SUM(CASE WHEN balance = 0 THEN 1 ELSE 0 END) AS Zero
FROM GameHistory
WHERE  handID IN ( SELECT handID 
FROM GameHistory g 
WHERE g.UserID LIKE "00021ae5")
GROUP BY UserID''',
}

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})


@app.route('/api/query/<q>', methods=['GET'])
def query(q):
    cursor.execute(queries[q])
    return jsonify({"query": cursor.fetchall()})


@app.route('/api/get_rooms', methods=['GET'])
def get_rooms():
    cursor.execute('select * from Room')
    return jsonify({"result": cursor.fetchall()})

@app.route('/api/create_room', methods=['GET'])
def create_room():
    cursor.execute('insert into Room values ("test", "nah", "ur mom") on duplicate key update RoomId = RoomId;')
    return jsonify({"result": cursor.fetchall()})

@app.route('/api/join_room', methods=['GET'])
def join_room():
    status = ""
    
    cursor.execute('insert into Room values ("test", "nah", "ur mom") on duplicate key update RoomId = RoomId;')
    return jsonify({"result": cursor.fetchall()})

@app.route('/api/delete_room', methods=['GET'])
def delete_room():
    cursor.execute('delete from Room where RoomId = "test";')
    return jsonify({"result": cursor.fetchall()})

@app.route('/api/get_log', methods=['GET'])
def get_log():
    cursor.execute('select ChatLog from Room where RoomId = "test";')
    return jsonify({"result": cursor.fetchall()})

@app.route('/api/update_log/<room>/<text>', methods=['GET'])
def update_log(room, text):
    cursor.execute(f'update Room set ChatLog = "{text}" where RoomId = "{room}";')
    return jsonify({"result": cursor.fetchall()})

@app.route('/api/login', methods=['POST'])
def login():
    # Get the request data (username and password)
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    # Query the database for the username
    # connection = create_connection()
    # if connection is None:
    #     return jsonify({"error": "Failed to connect to the database."}), 500
    
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Account WHERE UserId = %s", (username,))
    user = cursor.fetchone()

    # username can't include @gmail.com, reserved for google oauth login
    if user and '@gmail.com' not in user['UserID'] and user['Pass'] == password:  # Here, replace with hash comparison for production
        cursor.close()
        connection.close()
        return jsonify({"success": True, "message": "Login successful", "user": {"name": user['UserID'], "picture": ''}})
    else:
        cursor.close()
        connection.close()
        return jsonify({"error": "Invalid username or password."}), 401


@app.route('/api/create-account', methods=['POST'])
def create_account():
    VALID_USERNAME_REGEX = r'^[a-zA-Z0-9_.-]+$'  # Alphanumeric + _, ., and -

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # check if username includes @gmail.com, error if it does because that is reserved for google Oauth
    if not re.match(VALID_USERNAME_REGEX, username):
        return jsonify({'error': 'Forbidden'}), 403

    # Insert account into the database (example logic)
    if username and password:
        # hashed_password = hash_password(password)  # Implement hashing
        cursor.execute('INSERT INTO Account (UserID, Pass, CurrentSkin, RoomID, Balance) VALUES (?, ?, ?, ?, ?)', (username, password, 's1', NULL, 0))
        return jsonify({'message': 'Account created successfully'}), 201
    return jsonify({'error': 'Invalid data'}), 400



@app.route('/api/check-username', methods=['GET'])
def check_username(username):
    # Replace with your actual database check
    print(username)
    print('hi')
    print(profile)
    username = request.get_data().get('username')
    cursor.execute("SELECT * FROM Account WHERE UserId = %s", (username,))
    profile = cursor.fetchone()
    print(username)
    print(profile)
    if not profile:
        return jsonify({"valid": False}), 404
    else:
        return jsonify({"profile": profile})

if __name__ == '__main__':
    app.run(debug=True, port=5000)