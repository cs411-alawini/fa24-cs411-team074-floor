# team074-floor

## Accessing the VM and Database

First, ssh into the VM. (you'll only be able to if you're added). You can do it though command line or vs code

### SSH from terminal

```bash
ssh 35.208.175.145
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


hf :)