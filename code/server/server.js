'use strict';
const express = require('express');
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const APIrouter = require('./routers/API');
const db = require('./DB/db.js');


// init express
const app = new express();
const port = 3001;

app.use(express.json());

app.use('/', APIrouter);
/*db.testConfig().then(()=>
{
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
  
)*/

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})
// activate the server


module.exports = app;