# team074-floor

## Running it locally

1. ```sudo apt update```
2. ```sudo apt install mysql-server```
3. ```sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf```
4. in that file, add ```secure-file-priv=""```
5. ```systemctl status mysql```
6. ```sudo mysql```
7. ```CREATE DATABASE gambit_gallery```
8. ```USE gambit_gallery```
9. paste the DDL Commands from DatabaseDesign.md
10. load data using the following command:
```sql
load data infile '/path/to/cs411/fa24-cs411-team074-floor/data fixed_MyTable.csv' into table MyTable fields terminated by ',' lines terminated by '\r\n'
(Vars, @vNullVar, MoreVars)
set NullVar = nullif(@vNullVar, "NULL")
;
```
Start:

`sudo /etc/init.d/mysql start`

Stop:

`sudo /etc/init.d/mysql stop`

Restart / reload configs:

`sudo /etc/init.d/mysql restart`

Check run status:

`sudo /etc/init.d/mysql status`



## Accessing the VM and Database

First, ssh into the VM. (you'll only be able to if you're added). You can do it though command line or vs code.

> When you're in, please work in the `/home/shared` directory ty

### SSH from terminal

```bash
ssh my_username@35.208.175.145
```

### Add remote from command line

1. install `remote-ssh` extension
2. edit ssh config file and add this entry below:

```bash
Host gambit-gallery-vm
  HostName 35.208.175.145
  User my_username
```

### Connect to MySQL database
After connecting to the GCP VM, connect to the database using MySQL
```bash
mysql -h 34.41.165.201 -u root -p
```
- it will ask you for a password (ask me, i dont want it on the internet)

## Shutting down VM and database
### VM
```bash
sudo shutdown -h now
```
### database
- go into gcloud :(

### Setting Up Angular-Flask Base Project  
git clone the repo url  
cd into gambit gallery folder   
navigate to backend folder of project  
python3 -m venv venv  
source venv/bin/activate  
pip install Flask flask-cors  
python app.py  

navigate to frontend folder of project  
npm install  
ng serve  

### To run project:  
python app.py (from backend folder)  
ng serve (from frontend folder)  


hf :)  
