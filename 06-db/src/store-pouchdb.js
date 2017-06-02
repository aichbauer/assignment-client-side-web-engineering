import PouchDB from 'pouchdb'

const localDB = new PouchDB('mmt-ss2017')
const remoteDB = new PouchDB('https://couchdb.5k20.com/mmt-ss2017', {
    auth: {
        username: 'laichbauer',
        password: 'test'
    }
})

export default class Store {
    /**
     * @param {!string} name Database name
     * @param {function()} [callback] Called when the Store is ready
     */
    constructor(name, callback) {

        /**
         * Read the local ItemList from localStorage.
         *
         * @returns {ItemList} Current array of todos
         */
        this.getStore = () => {
            const store = []
            return new Promise((resolve) => {
                remoteDB.allDocs({ include_docs: true })
                    .then((result) => {
                        result.rows.map((row) => {
                            return store.push({
                                id: row.doc._id,
                                completed: row.doc.completed,
                                title: row.doc.title,
                                _rev: row.doc._rev
                            })
                        })

                        resolve(store)
                    })
            })
        }

        /**
         * Write the local ItemList to localStorage.
         *
         * @param {ItemList} todos Array of todos to write
         */
        this.setStore = (todo) => {
            remoteDB.put(todo)
        }

        if (callback) {
            callback()
        }
    }

    /**
     * Find items with properties matching those on query.
     *
     * @param {ItemQuery} query Query to match
     * @param {function(ItemList)} callback Called when the query is done
     *
     * @example
     * db.find({completed: true}, data => {
     *	 // data shall contain items whose completed properties are true
     * })
     */
    find(query, callback) {
        let filteredTodos
        this.getStore().then((todos) => {
            let k
            filteredTodos = todos.filter((todo) => {
                for (k in query) {
                    if (query[k] !== todo[k]) {
                        return false
                    }
                }

                return true
            })

            callback(filteredTodos)
        })
    }

    /**
     * Update an item in the Store.
     *
     * @param {ItemUpdate} update Record with an id and a property to update
     * @param {function()} [callback] Called when partialRecord is applied
     */
    update(update, callback) {
        const id = update.id

        this.getStore().then((todos) => {
            todos.forEach((todo) => {
                if ((id).toString() === (todo.id).toString()) {
                    return remoteDB.put({
                        _id: (todo.id).toString(),
                        completed: update.completed,
                        title: todo.title,
                        _rev: todo._rev
                    })
                }
            })

            if (callback) {
                callback()
            }
        })
    }

    /**
     * Insert an item into the Store.
     *
     * @param {Item} item Item to insert
     * @param {function()} [callback] Called when item is inserted
     */
    insert(item, callback) {
        remoteDB.put({
            _id: (item.id).toString(),
            title: item.title,
            completed: item.completed,
        })
        if (callback) {
            callback()
        }
    }

    /**
     * Remove items from the Store based on a query.
     *
     * @param {ItemQuery} query Query matching the items to remove
     * @param {function(ItemList)|function()} [callback] Called when records matching query are removed
     */
    remove(query, callback) {
        let k

        this.getStore().then((todos) => {
            const filteredTodosToRemove = todos.filter((todo) => {
                for (k in query) {
                    if ((query[k]).toString() !== (todo[k]).toString()) {
                        return false
                    }
                }
                return true
            })
            const newTodos = todos.filter((todo) => {
                for (k in query) {
                    if ((query[k]).toString() !== (todo[k]).toString()) {
                        return true
                    }
                }
                return false
            })

            filteredTodosToRemove.forEach((todo) => {
                remoteDB.remove({
                    _id: (todo.id).toString(),
                    _rev: todo._rev
                })
            })

            if (callback) {
                callback(newTodos)
            }
        })

    }

    /**
     * Count total, active, and completed todos.
     *
     * @param {function(number, number, number)} callback Called when the count is completed
     */
    count(callback) {
        this.getStore().then((todos) => {
            const total = todos.length

            let completed = 0

            todos.forEach((todo) => {
                completed += todo.completed
            })

            callback(total, total - completed, completed)
        })
    }
}
