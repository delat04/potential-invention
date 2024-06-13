# Server Functionality Documentation

This document explains the functionality of the server built using Node.js with the Express framework. The server handles various tasks, including CORS configuration, parsing JSON bodies, managing marker data, handling user authentication, and image upload. The server listens on port 3001.

## Setup

To start the server, use the following command:
```bash
node server.js
```
Ensure you have installed the necessary packages:
```bash
npm install express cors fs path multer
```
Configuration
CORS Configuration
The server is configured to allow requests only from http://localhost:5173:

```javascript
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
Middleware
The server uses the following middlewares:

cors for handling Cross-Origin Resource Sharing.
express.json for parsing JSON request bodies.
Endpoints
Save Marker
URL: /save-marker
Method: POST
Description: Saves marker data sent in the request body to casas.json.

```

```json

{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
    },
    "properties": {
        "name": "Marker name"
    }
}
Response: JSON message indicating success or error.
Get Marker Data
URL: /data
Method: GET
Description: Retrieves all marker data from casas.json.
Response: JSON data containing markers.
Delete Marker
URL: /delete-marker/:longitude/:latitude
Method: DELETE
Description: Deletes a marker identified by its longitude and latitude.
Parameters:
longitude: Longitude of the marker.
latitude: Latitude of the marker.
Response: JSON message indicating success, failure, or marker not found.
User Login
URL: /login
Method: POST
Description: Authenticates a user using the provided username and password.
Request Body:

{
    "username": "user",
    "password": "password"
}
Response: JSON message indicating success or invalid credentials.
User Signup
URL: /signup
Method: POST
Description: Registers a new user with the provided username, email, and password.
Request Body:

{
    "username": "user",
    "email": "user@example.com",
    "password": "password"
}
Response: JSON message indicating success or username/email conflict.
Save Image
URL: /save-image
Method: POST
Description: Uploads an image file and saves it to the server.
Form Data:
image: The image file to upload.
Response: JSON containing the URL of the uploaded image.
Directory Structure
public/images: Directory where uploaded images are stored.
casas.json: File storing marker data.
auth.json: File storing user authentication data.
Running the Server
Start the server using the following command:
```
```javascript
node server.js
The server will be running on http://localhost:3001.

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
