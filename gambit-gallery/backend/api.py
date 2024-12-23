from flask import Flask, jsonify, request
from flask_cors import CORS
from mysql.connector import connection
from datetime import datetime
import re

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

connection = connection.MySQLConnection(
    #user="root", database="gambit_gallery", password="root"
    user="root", database="gambit_gallery"
)
# connection = mysql.connector.connect(
#     host="34.41.165.201",
#     user="root",
#     password="GambitGallery!",
#     database="gambit_gallery",
#     connection_timeout = 10
# )
cursor = connection.cursor()

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route("/api/get_skins")
def get_skins():
    cursor.execute("select * from Skin;")
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/get_rooms", methods=["GET"])
def get_rooms():
    cursor.execute("select * from Room")
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/create_room", methods=["GET"])
def create_room():
    cursor.execute(
        'insert into Room values ("test", "nah", "ur mom") on duplicate key update RoomId = RoomId;'
    )
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/join_room", methods=["GET"])
def join_room():
    status = ""

    cursor.execute(
        'insert into Room values ("test", "nah", "ur mom") on duplicate key update RoomId = RoomId;'
    )
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/delete_room", methods=["GET"])
def delete_room():
    cursor.execute('delete from Room where RoomId = "test";')
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/get_log", methods=["GET"])
def get_log():
    cursor.execute('select ChatLog from Room where RoomId = "test";')
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/update_log/<room>/<text>", methods=["GET"])
def update_log(room, text):
    cursor.execute(f'update Room set ChatLog = "{text}" where RoomId = "{room}";')
    connection.commit()
    return jsonify({"result": cursor.fetchall()})


@app.route("/api/get_transactions/<user>", methods=["GET"])
def get_transactions(user):
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
    t_pass = user[1]

    if user and t_pass == password:  # Here, replace with hash comparison for production
        return jsonify({"success": True, "message": "Login successful", "user": {"name": user[0], "picture": ''}})
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
        connection.commit()
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
        connection.commit()
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
    stored_password = cursor.fetchone()[0]

    if stored_password != current_password:
        return jsonify({"error": "Wrong Password"}), 401

    # Insert account into the database (example logic)
    if username and stored_password == current_password:
        # hashed_password = hash_password(password)  # Implement hashing
        cursor.execute(
            f'UPDATE Account SET Pass = "{new_password}" WHERE UserId = "{username}";'
        )
        connection.commit()
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
        connection.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get-balance", methods=["POST"])
def get_balance():
    data = request.get_json()
    username = data.get("username")

    cursor.execute(f'SELECT Balance From Account WHERE UserID = "{username}"')
    balance = cursor.fetchall()
    if balance:
        # print(balance[0])
        return jsonify({"balance": balance[0]}), 200
    else:
        return jsonify({"error": "Invalid data"}), 400


@app.route("/api/check-username", methods=["GET"])
def check_username(username):
    # Replace with your actual database check
    username = request.get_data().get("username")
    cursor.execute("SELECT * FROM Account WHERE UserID = %s", (username,))
    profile = cursor.fetchone()
    if not profile:
        return jsonify({"valid": False}), 404
    else:
        return jsonify({"profile": profile})


def check_username_exists(username):
    # Replace with your actual database check
    cursor.execute("SELECT * FROM Account WHERE UserId = %s", (username,))
    profile = cursor.fetchall()
    if not profile:
        return False
    else:
        return True
    
@app.route('/api/send-funds', methods=['POST'])
def send_funds():
    data = request.get_json()
    username = data.get('username')
    recepient = data.get('recipientUsername')
    amount = data.get('amount')
    note = data.get('note')

    now = datetime.now()
    print(recepient)
    if not check_username_exists(recepient):
        return jsonify({'error': 'UserID doesnt exist'}), 409
    if amount < 0:
        return jsonify({'error': 'Invalid Amount'}), 403
    
    # Retrieve the current hashed password from the database for the user
    cursor.execute(f'SELECT Balance FROM Account WHERE UserId = "{username}"')
    username_oldbal = cursor.fetchone()[0]

    cursor.execute(f'SELECT Balance FROM Account WHERE UserId = "{username}"')
    recepient_oldbal = cursor.fetchone()[0]

    # Insert account into the database (example logic)
    if username and recepient:
        cursor.execute('INSERT INTO Transaction (TransactionID, SenderID, ReceiverID, Amount, DateTime, Description) '
            'VALUES (%s, %s, %s, %s, %s, %s)', 
            (username+recepient+str(now.strftime('%Y-%m-%d %H:%M:%S')), username, recepient, amount, now.strftime('%Y-%m-%d %H:%M:%S'), note))
        cursor.execute(f'UPDATE Account SET Balance = "{username_oldbal-amount}" WHERE UserId = "{username}";' )
        cursor.execute(f'UPDATE Account SET Balance = "{recepient_oldbal+amount}" WHERE UserId = "{recepient}";' )
        connection.commit()
        return jsonify({'message': 'Account updated successfully'}), 201
    return jsonify({'error': 'Invalid data'}), 400

@app.route("/api/get-user-performance", methods=["POST"])
def get_user_performance():
    data = request.get_json()
    username = data.get("username")

    # Check if the username exists
    if not check_username_exists(username):
        return jsonify({"error": "User not found"}), 404

    # Call the stored procedure with the correct parameter
    cursor.callproc(f"getUserPerformance", username)

    # Fetch and process the result
    results = []
    for result in cursor.stored_results():
        results.extend(
            result.fetchall()
        )  # Flatten results if it's a multiple-row result

    print(str(results))
    # Prepare the response (if the result is empty, return an empty list)
    if not results:
        return jsonify({"data": []})

    # Return the results in JSON format
    print(str(results))
    return jsonify({"data": results})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
