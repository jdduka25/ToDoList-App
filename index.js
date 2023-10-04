import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yhesgu8.mongodb.net/todolistDB"
);

const itemsSchema = {
  name: String,
  check: String,
};

const Item = mongoose.model("Item", itemsSchema);

app.get("/", (req, res) => {
  const today = new Date();

  Item.find({}).then(function (foundItems) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };

    const date = today.toLocaleDateString("en-us", options);

    const data = {
      day: date,
      itemsList: foundItems,
    };

    res.render("index.ejs", data);
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
    check: "",
  });

  item.save();

  res.redirect("/");
});

app.post("/checked", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndUpdate(checkedItemId, { check: "checked" }).then(function () {
    console.log("checked an item.");
  });
});

app.post("/delete", function (req, res) {
  const deletedItemId = req.body.trashbin;

  Item.findByIdAndRemove(deletedItemId)
    .then(function () {
      console.log("Successfully deleted checked item.");
    })
    .catch(function (err) {
      console.log(err);
    });

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
