//created by yang
//CRUD methods
var mongodb = require('./db');
var crypto = require('crypto');

function User(user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.age = user.age;
    this.eye = user.eye;
    this.company = user.company;
    this.phone = user.phone;
    this.address = user.address;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//save the information
User.prototype.save = function (callback) {
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        balance = 0
    var user = {
        firstname: this.firstname,
        lastname: this.lastname,
        age: this.age,
        eye: this.eye,
        company: this.company,
        phone: this.phone,
        address: this.address,
        password: this.password,
        email: this.email,
        balance: balance
    };
    //open the db
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//error
        }
        //read users collection
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //insert
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });
    });
};

//get the data
User.get = function (email, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //search email
            collection.findOne({
                email: email
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);//return user
            });
        });
    });
};

User.edit = function (firstname, lastname, age, eye, company, email, phone, address, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({

                "firstname": firstname,
                "lastname": lastname,
                "age": age,
                "eye": eye,
                "company": company,
                "email": email,
                "phone": phone,
                "address": address
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};


User.update = function (firstname, lastname, age, eye, company, email, phone, address, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //update
            collection.update({"email": email}, {
                    $set: {
                        firstname: firstname,
                        lastname: lastname,
                        age: age,
                        eye: eye,
                        company: company,
                        phone: phone,
                        address: address
                    }
                },
                function (err) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
        });
    });
};
