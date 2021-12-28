# Add User Account (Sign Up)

> ## Data
* email
* password

> ## Primary flow
1. Checks if the user account exists for the provided email
2. Hash the given password
3. Stores the user account
4. Generates an access token from the user's ID, that expires in 2 hours
4. Returns the user's email alongside the generated access token


> ## Exception flow: user found for the provided email
1. returns an user already exists error
