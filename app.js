const express = require('express');
const multer = require('multer');
const path = require('path'); // Import path
const app = express();

const uploadFolder = './uploads';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadFolder);
    },
    filename: (req, file, callback) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                             .replace(fileExt, '')
                             .toLowerCase().split(' ')
                             .join('-') + '-' + Date.now();
        callback(null, fileName + fileExt);
    }
});

var upload = multer({
    storage: storage, // Correctly set storage here
    limits: {
        fileSize: 1000000, // 1 MB
    },
    fileFilter: (req, file, callback) => {
        if (file.fieldname === 'avater') {
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                callback(null, true);
            } else {
                callback(new Error('Only jpg, png and jpeg files are allowed.'));
            }
        } else if (file.fieldname === 'doc') { // Correctly check file.fieldname
            if (file.mimetype === 'application/pdf') {
                callback(null, true);
            } else {
                callback(new Error('Only .pdf files are allowed.'));
            }
        } else {
            callback(new Error('There was an unknown error!'));
        }
    }
});

app.post('/', upload.fields([
    { name: 'avater', maxCount: 3 },
    { name: 'doc', maxCount: 1 },
]), (req, res) => {
    // console.log(req.files);
    res.send('File Upload Successful'); // Success message
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send(err.message); // Send error message
});

app.listen(5000, () => {
    console.log('Running on port 5000');
});
