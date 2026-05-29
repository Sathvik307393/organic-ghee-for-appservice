const express =require('express')
const path = require('path')
const hbs=require('hbs')
const route=require('./routers/main')
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const fileUpload = require('express-fileupload');
const { handlebars } = require('hbs');
require("./handlebar")//this hbs user made handlebars
const app=express();
app.use(fileUpload())
app.use(session({
    secret:"restorent_datails"
}))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use('',route)
//static folder
app.use("/static",express.static(path.join(__dirname, '..', 'public')));
//template engine
app.set("view engine",'hbs')
app.set("views",path.join(__dirname, '..', 'views'))
//app.set("views","")
hbs.registerPartials(path.join(__dirname, '..', 'views', 'partials'))





const connectionString = process.env.AZURE_COSMOS_CONNECTIONSTRING;
if (!connectionString) {
    console.error("MongoDB connection error: AZURE_COSMOS_CONNECTIONSTRING is not defined in the environment variables.");
} else {
    let safeConnectionString = connectionString;
    try {
        const regex = /^(mongodb(?:\+srv)?:\/\/[^:]+:)(.*)(@[^@]+)$/;
        const match = connectionString.match(regex);
        if (match) {
            const prefix = match[1];
            const password = match[2];
            const suffix = match[3];
            // Encode the password part if it contains special characters and is not already encoded
            if ((password.includes('/') || password.includes('+') || password.includes('=')) && !password.includes('%')) {
                safeConnectionString = prefix + encodeURIComponent(password) + suffix;
            }
        }
    } catch (e) {
        console.error("Error parsing connection string:", e.message);
    }

    mongoose.connect(safeConnectionString)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });
}
const PORT = process.env.PORT || 5656;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
