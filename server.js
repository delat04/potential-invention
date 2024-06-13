    import express from 'express';
    import cors from 'cors';
    import fs from 'fs';
    import path from 'path';
    import multer from 'multer';
    import { fileURLToPath } from 'url';
    const app = express();
    const PORT = 3001;

    // CORS configuration
    const corsOptions = {
        origin: 'http://localhost:5173', // Allow only this origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    // Use CORS middleware with options
    app.use(cors(corsOptions));

    // Parse JSON request bodies
    app.use(express.json());

    // Define the path to the data file
    //const dataFilePath = path.join(__dirname, 'casas.json');

    // Endpoint to handle marker saving
    app.post('/save-marker', (req, res) => {
        const markerData = req.body;
        console.log('Received marker data:', markerData);

        // Read the existing markers data
        fs.readFile('casas.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading markers data:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Parse the existing data
            let markersData;
            try {
                markersData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON data:', parseErr);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Add the new marker data
            markersData.features.push(markerData);

            // Write the updated data back to the file
            fs.writeFile('casas.json', JSON.stringify(markersData, null, 2), (err) => {
                if (err) {
                    console.error('Error saving marker data:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log('Marker saved successfully to casas.json');
                res.status(200).json({ message: 'Marker saved successfully' });
            });
        });
    });

    // Endpoint to get marker data
    app.get('/data', (req, res) => {
        // Read the JSON file from the server filesystem
        fs.readFile('casas.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            // Send the JSON data as a response to the client
            res.json(JSON.parse(data));
        });
    });
    app.delete('/delete-marker/:longitude/:latitude', (req, res) => {
        const longitude = parseFloat(req.params.longitude); // Parse longitude from URL parameter
        const latitude = parseFloat(req.params.latitude); // Parse latitude from URL parameter

        // Read the JSON file containing marker data
        fs.readFile('casas.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            try {
                const markersData = JSON.parse(data);
                const updatedMarkers = markersData.features.filter(marker => {
                    const coordinates = marker.geometry.coordinates;
                    return !(coordinates[0] === longitude && coordinates[1] === latitude);
                });

                // If marker was found and deleted
                if (updatedMarkers.length < markersData.features.length) {
                    const updatedData = { ...markersData, features: updatedMarkers };

                    // Write the updated data back to the file
                    fs.writeFile('casas.json', JSON.stringify(updatedData, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }
                        console.log('Marker deleted successfully');
                        res.status(200).json({ message: 'Marker deleted successfully' });
                    });
                } else {
                    // If marker with given coordinates was not found
                    res.status(404).json({ error: 'Marker not found' });
                }
            } catch (parseErr) {
                console.error('Error parsing JSON data:', parseErr);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        // Read auth data from JSON file
        fs.readFile('auth.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading auth data:', err);
                return res.status(500).send('Internal Server Error');
            }

            const authData = JSON.parse(data);
            const user = authData.users.find(u => u.username === username && u.password === password);

            if (user) {
                // Authentication successful
                res.status(200).json({ message: 'Login successful', user });
            } else {
                // Authentication failed
                res.status(401).json({ message: 'Invalid username or password' });
            }
        });
    });
    app.post('/signup', (req, res) => {
        const { username, email, password } = req.body;

        // Read auth data from JSON file
        fs.readFile('auth.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading auth data:', err);
                return res.status(500).send('Internal Server Error');
            }

            const authData = JSON.parse(data);
            const userExists = authData.users.some(u => u.username === username || u.email === email);

            if (userExists) {
                return res.status(409).json({ message: 'Username or email already exists' });
            }

            // Add new user
            authData.users.push({ username, email, password });

            // Save auth data back to JSON file
            fs.writeFile('auth.json', JSON.stringify(authData), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing auth data:', writeErr);
                    return res.status(500).send('Internal Server Error');
                }

                res.status(201).json({ message: 'User signed up successfully' });
            });
        });
    });
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const upload = multer({ dest: 'public/images' });

    app.post('/save-image', upload.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imagePath = path.join(__dirname, req.file.path);
        const targetPath = path.join(__dirname, 'public/images', req.file.originalname);

        fs.renameSync(imagePath, targetPath);

        const imageUrl = `/public/images/${req.file.originalname}`;
        res.json({ url: imageUrl });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
