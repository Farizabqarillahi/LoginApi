//untuk initialisasi mongodb

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {dbname: process.env.DB_NAME}) //url dan nama db mongodb
.then(() => {
    console.log('MongoDB Connected')
})
.catch((err) => console.log(err.message))

mongoose.connection.on(('connected'), () => {       //message klo connected
    console.log('MongoDB Connected to Database')
})

mongoose.connection.on(('error'), (err) => {        //message klo error
    console.log(err.message)
})

mongoose.connection.on(('disconnected'), () => {    //message klo disconnected
    console.log('MongoDB Disonnected to Database')
})

process.on('SIGINT', async() => {                   //process untuk disconnected, klo g ad, kgk bkl muncul messageny
    await mongoose.connection.close()
    //await untuk menunggu
    process.exit(0)
})  
//masih ga bisa
//mungkin ga bisa krn emg dri sanany(?)
//ternyata error karena vsc sendiri