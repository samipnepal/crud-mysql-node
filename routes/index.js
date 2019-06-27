module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `cars` ORDER BY id ASC"; // query database to get all the cars

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to Car Showroom" | 'View Cars',
                cars: result
            });
        });
    },
};