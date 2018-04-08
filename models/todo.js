const connection = require('../config/db'),
model = require('../config/model'),
Sequelize = require('sequelize'),
moment = require('../config/moment');

class Todo {

    constructor(row){
        this.row = row
    }

    get id(){
        return this.row.id
    }

    get message(){
        return this.row.message
    }

    get completion(){
        return this.row.completion
    }
    get createAt(){
        return moment(this.row.createAt)
    }
    get updatedAt(){
        return moment(this.row.updatedAt)
    }

    static create(content, callback){
        model.sync({force: false}).then(() => {
            return model.create({ message: content.task, completion: content.state }).then(result => {
                callback(result)
            })
        }).catch(error => {
            console.log(error)
        })
    }

    static all(callback){
        model.findAll().then(result => {
            callback(result.map((row) => new Todo(row)))
        }).catch(error => {
            console.log(error)
        })
    }

    static find(id, callback){
        model.findOne({ where: {id: id} }).then(result => {
            callback(new Todo(result))
        }).catch(error => {
            console.log(error)
        })
    }

    static update(id, content, callback){
        const todo = model.findOne({ where: {id: content.id} })
        todo.message = content.task
        todo.completion = content.state
        todo.save().then(result => {
            callback(result)
        }).catch(error => {
            console.log(error)
        })
    }

    static delete(id, callback){
        model.destroy({ where: {id:id} }).then(result => {
            callback(result)
        }).catch(error => {
            console.log(error)
        })
    }
}

module.exports = Todo