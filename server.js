const app = require('./src/config/App');
const database = require('./src/config/Database');
//database connection
database();


app.listen(process.env.PORT, () => {
  console.log('App listening on port ' + process.env.PORT)
})