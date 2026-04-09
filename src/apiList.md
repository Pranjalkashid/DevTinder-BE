# api list for DevTinder

auth Router

- POST /signup
- POST /login
- POST /logout
- POST /forgotPassword

profile Router

- GET /profile/view
- PATCH /profile/edit

request Router

- POST /request/send/:status/:userId - interested, ignored
- POST /request/review/:status/:rejectedId - accepted, rejected

user Router

- GET /user/connections
- GET /user/requests
- GET /feed
