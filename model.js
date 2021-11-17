const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fireWarning = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    payload: {
      type: String,
      required: true,
    },
    qos: {
      type: String,
      required: true,
    },
    qos: {
      type: Boolean,
      required: true,
    },
    _msgid: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// https://stackoverflow.com/questions/19020802/how-to-send-google-maps-location-info-through-sms-as-a-link

const fireWarningModel = mongoose.model("data", fireWarning, "data");

module.exports = fireWarningModel;
