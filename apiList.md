## profileRouter 
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgotPassword

## connectionRequestRouter
- POST /request/send/:status/:userId (status:interested/ignored)
- POST /request/review/:status/:requestId (status:accepted/rejected)


## useRouter 
- GET /user/requests/received
- GET /user/connections

- GET /user/feed

status: ignore, interested, accepted , rejected