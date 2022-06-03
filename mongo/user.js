const mongoose = require('mongoose');
var conn = require('./db');
const jwt = require("jsonwebtoken");

const session = require('express-session');
var userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    active: { type: Boolean, required: true },
    wallet: { type: String, required: true },

}, {
    timestamps: true
});
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, "thisjbsjbfjdbszzshhsdvf")
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}
var digitschema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    digits: { type: Number, required: true },
    active_selller_id: { type: String, required: true },
    active_transaction_id: { type: String, required: true },
    claimed: { type: Boolean, required: true },
    Appraised_price: { type: String, required: true },
    Number_of_emails: { type: Number, required: true }


})
var tranctionSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    tranctionUrl: { type: String, required: true },
    price: { type: Number, required: true },
    sellertid: { type: String, required: true },
    digitId: { type: String, required: true },
    createAt: { type: Date, required: true },
    soldAt: { type: Date, required: true },
    cancellAt: { type: Date, required: true },
    expireAt: { type: Date, required: true },
    state: { type: String, required: true }

})
var informSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    digit: { type: Number, required: true }
})

let users = conn.model('users', userSchema);
let digits = conn.model('digits', digitschema);
let informme = conn.model('inform_me', informSchema);
let tranction = conn.model('tranction', tranctionSchema);

module.exports = { users, digits, informme, tranction };