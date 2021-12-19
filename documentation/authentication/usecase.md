# Email and Password Authentication

> ## Data
* email
* password

> ## Primary flow
1. Search the user by the provided email
2. Checks if the provided password matches with the user found
3. Generates an access token from the user's ID, that expires in 2 hours
4. Returns the generated access token


> ## Exception flow: user not found for the provided email
1. returns an authentication error

> ## Exception flow: user and password do not match
1. returns an authentication error
