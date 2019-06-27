const fs = require('fs');

module.exports = {
    addCarPage: (req, res) => {
        res.render('add-car.ejs', {
            title: 'Welcome to Car Showroom' | 'Add a new car',
            message: ''
        });
    },
    addCar: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let car_name = req.body.car_name;
        let brand = req.body.brand;
        let description = req.body.description;
        let technical = req.body.technical;
        let price = req.body.price;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = car_name + '.' + fileExtension;

        let carnameQuery = "SELECT * FROM `cars` WHERE car_name = '" + car_name + "'";

        db.query(carnameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Car already exists';
                res.render('add-car.ejs', {
                    message,
                    title: 'Welcome to Car Showroom' | 'Add a new car'
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `cars` (car_name, brand, price, description, image, technical) VALUES ('" +
                            car_name + "', '" + brand + "', '" + price + "', '" + description + "', '" + image_name + "', '" + technical + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-car.ejs', {
                        message,
                        title: 'Welcome to Car Showroom' | 'Add a new car'
                    });
                }
            }
        });
    },
    editCarPage: (req, res) => {
        let carId = req.params.id;
        let query = "SELECT * FROM `cars` WHERE id = '" + carId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-car.ejs', {
                title: 'Edit  Cars',
                car: result[0],
                message: ''
            });
        });
    },

    getPrice: (req, res) => {
        let carId = req.params.id;
        let query = "SELECT * FROM `cars` WHERE id = '" + carId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('view-cars.ejs', {
                title: 'Car Price'
                ,player: result[0]
                ,message: ''
            });
        });
    },

    viewCars: (req, res) => {
        let carId = req.params.id;
        let query = "SELECT * FROM `cars` WHERE id = '" + carId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('view-cars.ejs', {
                title: 'View Car Details',
                car: result[0],
                message: '',
                username: ''
            });
        });
    },

    login: (req, res) => {
        res.render('login.ejs', {
            title: 'User Login'
        });
    },

    loginUser: (req, res) => {
        let loggedInUser = sessionStorage.getItem("carUser");
        console.log(loggedInUser);
        if(!loggedInUser) {
            sessionStorage.setItem("carUser", req.body.username +":"+ req.body.password);
        }
    },

    editCar: (req, res) => {
        let carId = req.params.id;
        let car_name = req.body.car_name;
        let brand = req.body.brand;
        let description = req.body.description;
        let technical = req.body.technical;
        let price = req.body.price;

        let query = "UPDATE `cars` SET `car_name` = '" + car_name + "', `brand` = '" + brand + "', `description` = '" + description + "', `technical` = '" + technical + "' WHERE `cars`.`id` = '" + carId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteCar: (req, res) => {
        let carId = req.params.id;
        let getImageQuery = 'SELECT image from `cars` WHERE id = "' + carId + '"';
        let deleteUserQuery = 'DELETE FROM cars WHERE id = "' + carId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};
