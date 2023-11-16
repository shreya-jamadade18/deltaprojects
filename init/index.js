const mongoose = require("mongoose");
const initData = require("./data.js");
const List = require("../models/listing.js");

main().then((res) => {
    console.log("connect to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
};

const initDB = async() => {
    await List.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6540902b20efb8044b005c96" }));
    await List.insertMany(initData.data);
    console.log("data is initiallized");

};
initDB();