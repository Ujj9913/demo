const express = require("express")
const app = express()
const cookie = require('cookie-parser')
var conn = require('./mongo/db');
const mongoose = require('mongoose')
const session = require('express-session')
const Users = require('./mongo/user')
const bodyParser = require('body-parser')
const port=process.env.PORT || 8000
app.use(bodyParser.urlencoded({ extended: true }))
const jwt = require('jsonwebtoken')
app.set('view engine', 'ejs')
app.set(express.json)
app.use(session({
    secret: 'this session is use to digit progaram',
    resave: false,
    saveUninitialized: false
}))

app.get('/GetDigitStatus/:d', async (req, res) => {

    const { d } = req.params;


    var digits = await Users.digits.findOne({ digits: d }, {});
    if (digits == null) {
        res.send("digits is not found plz enter the valied")
    }
    else {
        var tranction = await Users.tranction.findOne({ "_id": digits.active_transaction_id }, {});
        var filter = await Users.tranction.aggregate([
            {
                $lookup: {
                    from: "digit",
                    localField: "_id",
                    foreignField: "digitId",
                    as: "data"

                }

            },
            // {$unwind:'$digit'},

            {
                $addFields: {
                    data: [
                        d_id = digits._id,
                        digit = digits.digits,
                        Appraised_price = digits.Appraised_price,
                        Number_of_emails = digits.Number_of_emails,
                        active_selller_id = digits.active_selller_id,
                        active_transaction_id = digits.active_transaction_id
                    ]

                }
            }

        ])

        console.log(filter)
        if (digits.active_transaction_id == "") {
            digits.active_transaction_id = null
        }
        if (digits.active_selller_id == "") {
            digits.active_selller_id = null
        }
        var l1 = (digits.active_transaction_id != null) ? 1 : 0;
        const d1 = (digits.digits != null) ? digits.digits : null;
        var p1 = (digits.Appraised_price != 0) ? digits.Appraised_price : 0;
        var c1 = (digits.active_selller_id != null) ? 1 : 0;
        u1 = digits.active_selller_id
        c1 = (u1 != null) ? 1 : 0;

        const data = {
            "_id": 1,
            "digit": d1,
            "userId": u1,
            "claimed": c1,
            "listed": l1,
            "price": p1,
            "info": tranction
        }

        sess = req.session;
        sess.data = data;
        // console.log(sess);
        var header = res.header(sess)

        res.send(data)
    }

})
app.listen(port);