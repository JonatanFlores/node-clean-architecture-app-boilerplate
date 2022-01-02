# Refresh Token

> ## Data
* refreshToken

> ## Primary flow
1. Verify if the refreshToken is valid
2. Get the user by the ID from the decoded refreshToken
3. Generates an access token from the user's ID, that expires in 2 hours
3. Generates a refresh token from the user's ID, that expires in 30 days
4. Returns the generated access token, refresh token and user's email

> ## Exception flow: verify the refresh token fails
1. returns an authentication error

> ## Exception flow: user not found for the id
1. returns an authentication error
