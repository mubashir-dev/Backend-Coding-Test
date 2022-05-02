const apiResponse = require("../helpers/apiResponse");
const {CallValidation} = require("../helpers/callValidation");
const TwilioHelpers = require("../helpers/Twilio");
const Call = require('../models/Call');
const _ = require('underscore');
const VoiceResponse = Client.twiml.VoiceResponse;

//For initiating calls
exports.makeCall = async (req, res, next) => {
  //Validations
  const validationResult = CallValidation.validate(req.body, {abortEarly: false});
  if (!_.isEmpty(validationResult.error)) {
    let _errors = [];
    validationResult.error.details.forEach((element) => {
      _errors.push(element.message);
    });
    return apiResponse.ErrorResponse(_errors, 'Errors');
  }
  try {
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
      numDigits: 1,
      action: "/userInput",
    });
    gather.say(
       "For personal number, press 1. Press 2, to leave a voice message"
    );
    twiml.redirect("/makeCall");
    res.type("text/xml");
    res.send(twiml.toString());
  } catch
     (error) {
    return apiResponse.ErrorResponse(error, 'Call was not successful');
  }
}
//For processing user inputs
exports.processUserInput = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();
    //Switching Call
    if (req.body.Digits) {
      switch (req.body.Digits) {
        case "1":
          twiml.say("Forwarding to personal contact");
          return res.redirect("/forwardCall");
        case "2":
          twiml.say("Please leave a voice message!");
          return res.redirect("/voiceMessage");
        default:
          twiml.say("Invalid Choice,Make a right choice");
          break;
      }
    } else {
      twiml.redirect("/makeCall");
    }
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    return apiResponse.ErrorResponse(error, 'Error');
  }
}
//for forwarding calls
exports.forwardCall = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();
    const dial = twiml.dial({
      action: "/hangup?callStatus=forwarded",
    });
    dial.number("+1 555 666 7777");
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(error, 'Error');
  }
}
//for voice message
exports.voiceMessage = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();
    twiml.say(
       "Please leave a message after beep,to end this press 0"
    );
    twiml.record({
      action: "/hangup?callStatus=voiceMessage",
      finishOnKey: "0",
    });
    twiml.hangup();
    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    return apiResponse.ErrorResponse(error, 'Error');
  }
}
//for ending calls
exports.hangUpCall = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();
    twiml.say("Thanks for reaching out");
    twiml.hangup();
    //storing data
    const callStore = new Call({...req.body});
    await callStore.save();
    res.type("text/xml");
    return apiResponse.successResponseWithData(twiml.toString(), 'Call logs saved successfully', callStore);
  } catch (error) {
    console.log(error);
  }
}