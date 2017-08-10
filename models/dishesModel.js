const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const dishSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }    
    }, {
        timestamps: false
    }
);

module.exports = Mongoose.model('dish', dishSchema);