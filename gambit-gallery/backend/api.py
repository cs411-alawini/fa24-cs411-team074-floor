from flask import Flask, jsonify, request
from flask_cors import CORS
from mysql.connector import connection
from datetime import datetime
import re

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

connection = connection.MySQLConnection(
    user="root",
    database="gambit_gallery",
    password="root",
    #     #user="root", database="gambit_gallery"
)
# connection = connection.MySQLConnection(
#     host="34.41.165.201",
#     user="root",
#     password="GambitGallery!",
#     database="gambit_gallery",
#     # connection_timeout = 10
# )
cursor = connection.cursor()


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})


@app.route("/api/get-skins")
def get_skins():
    cursor.execute("select * from Skin;")
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/get-rooms", methods=["GET"])
def get_rooms():
    cursor.execute("select * from Room")
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/create-room", methods=["POST"])
def create_room():
    data = request.get_json()
    room_name = data.get("room")
    cursor.execute(f"select RoomID from Room where RoomID = '{room_name}';")
    if cursor.fetchone():
        return jsonify([{"error" : "Room already exists!"}])
    
    cursor.execute(
        f'insert into Room values ("{room_name}", "../data/tmp/log_{room_name}.txt", "../data/tmp/chatlog_{room_name}.txt") on duplicate key update RoomId = RoomId;'
    )
    return jsonify({"message": "room created successfully"}), 201

@app.route("/api/delete-room", methods=["GET"])
def delete_room():
    cursor.execute('delete from Room where RoomId = "test";')
    return jsonify({"result": cursor.fetchall()})

@app.route("/api/join_room", methods=["POST"])
def join_room():
    data = request.get_json()
    username = data.get("username")
    room = data.get("room")
    
    cursor.execute(
        f'update Account set RoomID = "{room}" where UserID = "{username}";'
    )
    return jsonify({"result": cursor.fetchall()})

@app.route("/api/get-log", methods=["GET"])
def get_log():
    cursor.execute('select ChatLog from Room where RoomId = "test";')
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/update-log/<room>/<text>", methods=["GET"])
def update_log(room, text):
    cursor.execute(f'update Room set ChatLog = "{text}" where RoomId = "{room}";')
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/get-transactions/<user>", methods=["GET"])
def get_transactions(user):
    if not check_username_exists(user):
        return (
            jsonify(
                [
                    {
                        "from": "USER",
                        "to": "NOT",
                        "amount": "FOUND",
                        "date": "",
                        "description": "",
                    }
                ]
            ),
        )

    cursor.execute(
        f'select * from Transaction where SenderID = "{user}" or ReceiverID = "{user}" limit 15'
    )
    data = []
    for d in cursor.fetchall():
        transid, sid, rid, amnt, date, descrip = d
        data.append(
            {
                "from": sid,
                "to": rid,
                "amount": amnt,
                "date": date,
                "description": descrip,
            }
        )
        # print(f'from: {sid}, to: {rid}, amnt: {amnt}, date: {date}, descrip: {descrip}')

    return jsonify(data)


@app.route("/api/login", methods=["POST"])
def login():
    # Get the request data (username and password)
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    VALID_USERNAME_REGEX = r"^[a-zA-Z0-9_.-]+$"  # Alphanumeric + _, ., and -

    if not re.match(
        VALID_USERNAME_REGEX, username
    ):  # errors if the username used is not a valid one
        return jsonify({"error": "Forbidden"}), 403

    if not check_username_exists(
        username
    ):  # errors if username used to log in doesnt exist in the db
        return jsonify({"error": "Conflict"}), 409

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    # Query the database for the username
    # connection = create_connection()
    # if connection is None:
    #     return jsonify({"error": "Failed to connect to the database."}), 500

    # cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Account WHERE UserId = %s", (username,))
    user = cursor.fetchone()
    t_username, t_pass = user[:2]

    if user and t_pass == password:  # Here, replace with hash comparison for production
        return jsonify(
            {
                "success": True,
                "message": "Login successful",
                "user": {"name": t_username, "picture": ""},
            }
        )
    else:
        return jsonify({"error": "Invalid username or password."}), 401


@app.route("/api/create-account", methods=["POST"])
def create_account():
    VALID_USERNAME_REGEX = r"^[a-zA-Z0-9_.-]+$"  # Alphanumeric + _, ., and -

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # check if username includes @gmail.com, error if it does because that is reserved for google Oauth
    if not re.match(VALID_USERNAME_REGEX, username):
        return jsonify({"error": "Forbidden"}), 403

    if check_username_exists(username):
        return jsonify({"error": "Conflict"}), 409

    if username and password:
        # hashed_password = hash_password(password)  # Implement hashing
        cursor.execute(
            "INSERT INTO Account (UserID, Pass, CurrentSkin, RoomID, Balance) "
            "VALUES (%s, %s, %s, %s, %s)",
            (username, password, "s1", None, 0),
        )
        # cursor.execute(f'SELECT * FROM Account WHERE UserID = "{username}";')
        # print(cursor.fetchone())
        return jsonify({"message": "Account created successfully"}), 201
    return jsonify({"error": "Invalid data"}), 400


@app.route("/api/create-account-oauth", methods=["POST"])
def create_account_oauth():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    print(username)
    # check if username includes @gmail.com, error if it does because that is reserved for google Oauth
    if check_username_exists(username):
        return jsonify({"error": "No need to create"}), 200

    # Insert account into the database (example logic)
    if username and password:
        # hashed_password = hash_password(password)  # Implement hashing
        cursor.execute(
            "INSERT INTO Account (UserID, Pass, CurrentSkin, RoomID, Balance) "
            "VALUES (%s, %s, %s, %s, %s)",
            (username, password, "s1", None, 0),
        )
        # cursor.execute(f'SELECT * FROM Account WHERE UserID = "{username}";')
        # print(cursor.fetchone())
        return jsonify({"message": "Account created successfully"}), 201
    return jsonify({"error": "Invalid data"}), 400


@app.route("/api/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    username = data.get("username")
    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")

    if not check_username_exists(username):
        return jsonify({"error": "Conflict"}), 409

    # Retrieve the current hashed password from the database for the user
    cursor.execute(f'SELECT Pass FROM Account WHERE UserId = "{username}"')
    stored_password = cursor.fetchone()["Pass"]

    if stored_password != current_password:
        return jsonify({"error": "Wrong Password"}), 401

    # Insert account into the database (example logic)
    if username and stored_password == current_password:
        # hashed_password = hash_password(password)  # Implement hashing
        cursor.execute(
            f'UPDATE Account SET Pass = "{new_password}" WHERE UserId = "{username}";'
        )
        return jsonify({"message": "Account updated successfully"}), 201
    return jsonify({"error": "Invalid data"}), 400


@app.route("/api/delete-account", methods=["DELETE"])
def delete_account():
    data = request.get_json()
    username = data.get("username")

    if not check_username_exists(username):
        return jsonify({"error": "User not found"}), 404

    try:
        cursor.execute(f'DELETE FROM Account WHERE UserId = "{username}";')
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get-balance/<username>", methods=["GET"])
def get_balance(username):
    cursor.execute(f'SELECT Balance From Account WHERE UserID = "{username}";')
    balance = cursor.fetchall()
    print(username)
    if balance:
        # print(balance[0])
        return jsonify({"balance": balance[0]}), 200
    else:
        return jsonify({"error": "Invalid data"}), 400


@app.route("/api/check-username/<username>", methods=["GET"])
def check_username(username):
    if check_username_exists(username):
        return jsonify({"profile": username})
    else:
        return jsonify({"valid": False}), 404


def check_username_exists(username):
    # Replace with your actual database check
    cursor.execute(f"SELECT * FROM Account WHERE UserId = '{username}'")
    profile = cursor.fetchall()
    if not profile:
        return False
    else:
        return True


@app.route("/api/send-funds", methods=["POST"])
def send_funds():
    data = request.get_json()
    username = data.get("username")
    recepient = data.get("recipientUsername")
    amount = data.get("amount")
    note = data.get("note")

    now = datetime.now()
    print(recepient)
    if not check_username_exists(recepient):
        return jsonify({"error": "UserID doesnt exist"}), 409

    # Retrieve the current hashed password from the database for the user
    cursor.execute(f'SELECT Balance FROM Account WHERE UserId = "{username}"')
    username_oldbal = cursor.fetchone()[0]

    cursor.execute(f'SELECT Balance FROM Account WHERE UserId = "{username}"')
    recepient_oldbal = cursor.fetchone()[0]

    # Insert account into the database (example logic)
    if username and recepient:
        cursor.execute(
            "INSERT INTO Transaction (TransactionID, SenderID, ReceiverID, Amount, DateTime, Description) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (
                username + recepient + str(now.strftime("%Y-%m-%d %H:%M:%S")),
                username,
                recepient,
                amount,
                now.strftime("%Y-%m-%d %H:%M:%S"),
                note,
            ),
        )
        # cursor.execute(f'UPDATE Account SET Balance = "{username_oldbal-amount}" WHERE UserId = "{username}";' )
        # cursor.execute(f'UPDATE Account SET Balance = "{recepient_oldbal+amount}" WHERE UserId = "{recepient}";' )
        return jsonify({"message": "Account updated successfully"}), 201
    return jsonify({"error": "Invalid data"}), 400


@app.route("/api/get-user-performance/<username>", methods=["GET"])
def get_user_performance(username):
    # Check if the username exists
    if not check_username_exists(username):
        return jsonify({"error": "User not found"}), 404

    # Call the stored procedure with the correct parameter
    cursor.callproc(f"getUserPerformance", [username])

    # Fetch and process the result
    results = []
    for result in cursor.stored_results():
        results.extend(result)

    # print(results)
    return jsonify(
        [
            {"action": action, "avgBalance": avgBalance, "winrate": winrate}
            for action, avgBalance, winrate in results
        ]
    )


@app.route("/api/get-user-activity/<username>", methods=["GET"])
def get_user_activity(username):
    # Check if the username exists
    if not check_username_exists(username):
        return jsonify({"error": "User not found"}), 404

    # print("user found")
    # print("calling database")

    cursor.callproc(f"getUserActivity", [username])

    # Fetch and process the result
    results = []
    for result in cursor.stored_results():
        results.extend(result)

    # print(results)
    return jsonify(
        [
            {"date": d, "gameCount": gc, "nonGameCount": ngc, "totalActivity": ta}
            for d, gc, ngc, ta in results
        ]
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
