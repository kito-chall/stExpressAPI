const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const routes = require("./routes/routes");


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.use("/drills", routes);

app.listen(port, () => {
  console.log(`PORT: ${port}`);
});

