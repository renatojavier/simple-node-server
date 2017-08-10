const MainService = require('../services/MainService');
const _ = require('lodash');

var DishModel, mongoose, asset;

class DishesService extends MainService{
    constructor(){
        super();
    }

    imports(){
        DishModel = require('../models/dishesModel');
        mongoose = require('mongoose');
        asset = require('assert');

        mongoose.Promise = require('bluebird');
        mongoose.connect('mongodb://127.0.0.1/conFusion', {
            useMongoClient: true
        });
        
        const db = mongoose.connection;
        return db;
    }

    on(op, data, callback){
        const db = this.imports();
        const operations = [ 'list', 'add', 'remove', 'update'];

        var validOperation = _.includes( operations, op) || false;

        if( !validOperation ){
            throw new Error('Argument for operation is not valid');
            return;
        }

        db.on('error', () => {
            console.log('Error connecting to database server');
        });

        db.once('open', () => {
            console.log('Connection request done');
            switch (op) {
                case 'add':
                    this.add(db, data, callback);
                    break;
                case 'update':
                    this.update(db, data, callback);
                    break;
                case 'remove':
                    this.remove(db, data, callback);
                    break;
                default:
                    this.list(db, data, callback);
                    break;
            }
            return;
        });
    }

    // Private member functions
    list(db, id, callback){
        var filter = ( id === null ) ? {} : id;

        DishModel.find(filter, (err, dish) => {
            if( err ){
                callback(err, null);
            }else{
                callback(null, dish);
            }
            db.close();
        });
    }

    add(db, data, callback){
        DishModel.create({
            name: data.name,
            description: data.description,
            price: data.price
        }, ( err, dish ) => {
            if( ! err )
                callback(null, dish, data);
            else
                callback(err, null, data);
            db.close();
        });
    }

    update(db, data, callback){
        const _id = data._id;
        const _dish = data.dish;
        const filter = { "_id": _id };
        const options = { $set: _dish };

        DishModel.findOneAndUpdate(
            filter,
            options,
            (err, dish) => {
                if( ! err )
                    callback(null, dish, data);
                else
                    callback(err, null, data);
                db.close();
            }
        );
    }

    remove(db, data, callback){
        const _id = data._id;
        const filter = { "_id": _id };
        const options = {};

        DishModel.findOneAndRemove(
            filter,
            options,
            (err, dish) => {
                if( !err )
                    callback(null, dish, data);
                else
                    callback(err, null, data);
                db.close();
            }
        );
        
    }
    
}

module.exports = new DishesService;