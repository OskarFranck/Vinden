const functions = require("firebase-functions");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
const cors = require("cors");
admin.initializeApp();

app.use(cors({ origin: ["http://localhost:3000"] }));

// get all items from trade collection

app.get("/", async (req, resp) => {
  const snapShot = await admin.firestore().collection("trade").get();
  let trades = [];
  snapShot.forEach((trade) => {
    let id = trade.id;
    let tradeData = trade.data();
    trades.push({
      id,
      ...tradeData,
    });
  });
  resp.status(200).json(trades);
});

// get item from trade collection by id
app.get("/:id", async (req, resp) => {
  const id = req.params.id;
  const snapShot = await admin.firestore.collection("trade").doc(id).get();
  let tradeData = snapShot.data();
  if (!tradeData) {
    resp.status(404).send("Trade add not found");
  } else {
    const returnObject = { id, ...tradeData };
    resp.json(returnObject);
  }
});

// Add item to trade collection
app.post("/", async (req, resp) => {
  const tradeAdd = req.body;
  let checkContent = JSON.stringify(tradeAdd);
  if (checkContent != "{}") {
    await admin.firestore().collection("trade").add(tradeAdd);
    resp.status(201).send("Trade add created");
  } else {
    resp.status(404).send("Missing body");
  }
});

// Update item in trade collection
app.put("/:id", async (req, resp) => {
  try {
    const id = req.params.id;
    const body = req.body;
    await admin.firestore().collection("trade").doc(id).update(body);
    resp.send("Add updated");
  } catch (e) {
    resp.status(404).send("Internal server error: " + e);
  }
});

// delete item from trade collection
app.delete("/:id", async (req, resp) => {
  const id = req.params.id;
  await admin.firestore().collection("trade").doc(id).delete();
  resp.send("Trade add removed");
});

exports.trade = functions.https.onRequest(app);
