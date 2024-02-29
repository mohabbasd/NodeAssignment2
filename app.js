/******************************************************************************
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Mohammad Abbas Student ID: N01579722 Date: 29th February, 2024
*
*
******************************************************************************/


//importing express module
var express = require("express");

//importing path module
var path = require("path");

const bodyParser = require("body-parser");
const fs = require("fs");

//instance of Express
var app = express();

//importing express-handlebars module
const exphbs = require("express-handlebars");

//define the port number
const port = process.env.port || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//show static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
      isZero: function (value) {
        return value === 0 ? "highlighted" : "";
      }
    },
  })
);

//setting the view engine to use handlebars
app.set("view engine", "hbs");

//define the route for the homepage
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

app.get("/allData", (req, res) => {
  const filePath = path.join(__dirname, "json", "datasetB.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      res.status(500).send("Error reading the JSON file");
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const limitedData = jsonData.slice(0, 300);
      res.render("allData", { title: "All Data", data: limitedData });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send("Error parsing JSON file");
    }
  });
});

app.get("/allData1", (req, res) => {
  const filePath = path.join(__dirname, "json", "datasetB.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      res.status(500).send("Error reading the JSON file");
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const limitedData = jsonData.slice(0, 300);
      res.render("allData1", { title: "All Filtered Data", data: limitedData });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError); 
      res.status(500).send("Error parsing JSON file");
    }
  });
});

app.get("/allData2", (req, res) => {
  const filePath = path.join(__dirname, "json", "datasetB.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      res.status(500).send("Error reading the JSON file");
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const limitedData = jsonData.slice(0, 300);
      res.render("allData2", {
        title: "All Highlighted Data",
        data: limitedData,
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send("Error parsing JSON file");
    }
  });
});

app.get("/data", (req, res) => {
  const filePath = path.join(__dirname, "json", "datasetB.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading the JSON file");
      return;
    }

    const jsonData = JSON.parse(data);

    res.render("data", { title: "Data Page", data: jsonData });
  });
});

app.get("/productID", (req, res) => {
  res.render("searchProductByID", { title: "Product ID Search" });
});

// Handle product ID search
app.post("/productID", (req, res) => {
  const index = req.body.index;
  const filePath = path.join(__dirname, "json", "datasetB.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading the JSON file");
      return;
    }
    const jsonData = JSON.parse(data);
    const product = jsonData[index];

    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Index out of range");
    }
  });
});

// Render Handlebars form for product name search
app.get("/productName", (req, res) => {
  res.render("searchByProductName", { title: "Product Name Search" });
});

// Handle product name search
app.post("/productName", (req, res) => {
  const productName = req.body.productName;
  const filePath = path.join(__dirname, "json", "datasetB.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading the JSON file");
      return;
    }
    const jsonData = JSON.parse(data);
    const matchingProduct = jsonData.filter((product) =>
      product.title.toLowerCase().includes(productName.toLowerCase())
    );

    if (matchingProduct.length > 0) {
      const selectedProduct = matchingProduct
        .slice(0, 3)
        .map(({ categoryName, price, stars }) => ({
          categoryName,
          price,
          stars,
        }));
      res.json(selectedProduct);
    } else {
      res.status(404).send("No products found matching the search criteria");
    }
  });
});

//define the route for '/users'
app.get("/users", function (req, res) {
  //show a response on the webpage
  res.send("respond with a resource");
});

//any other route expect which is already defined above
app.get("*", function (req, res) {
  //show the error message on th webpage
  res.render("error", { title: "Error", message: "Wrong Route" });
});

//start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

