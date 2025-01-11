## profileRouter 
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgotPassword

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## useRouter 
- GET /user/connections
- GET /user/requests
- GET /user/feed

status: ignore, interested, accepted , rejected