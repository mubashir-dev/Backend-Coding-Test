require('dotenv').config()
const AccountSID = process.env.AccountSID;
const AuthToken = process.env.AuthToken;
const Client = require('twilio')(AccountSID, AuthToken);

//Twilio VoiceResponse
const VoiceResponse = Client.twiml.VoiceResponse;
const Twiml = new VoiceResponse();


//for making  calls
exports.makeCall = async (callTo) => {
  const callResult = await Client.calls.create({
    url: process.env["TwilioUrl"],
    to: callTo,
    from: process.env["TwilioNumber"]
  });
  return callResult
}

//for managing user dial inputs
exports.manageUserInput = () => {
  const gatherNode = Twiml.gather({numDigits: 1, action: "/api/v1/call/handle-input"});
  gatherNode.say("For call forward press 1,For leaving a voice message press 2");
  //In-case use doesn't enter any digits
  Twiml.redirect("/api/v1/call/answer?redo=true");
  return Twiml.toString();
}

//for menu validation
exports.managerUserInputValidation = () => {
  Twiml.say("You have entered invalid option,Please select a valid option");
  //pause
  Twiml.pause();
  return Twiml.toString();
}

//for recording message
exports.recordUserMessage = () => {
  Twiml.say("Please leave a message after beep,to end call press 0");
  //record the message
  Twiml.record({
    action: "/api/v1/call/hangup?option=record",
    method: "get",
    finishOnKey: "0"
  });
  Twiml.toString();
}

//for call forwarding
exports.forwardUserCall = (forwardCallNumber) => {
  Twiml.say("Please hold,the call is forwarding");

  const dial = Twiml.dial({
    action: "/api/v1/call/hangup?option=forward",
    method: "get"
  });
  dial.number(forwardCallNumber);
  return Twiml.toString();
}

//for ending the call
exports.endUserCall = () => {
  //ending note
  Twiml.say("Have a nice day");
  Twiml.hangup();
  return Twiml.toString();
}

//call listing
exports.callHistory = async () => {
  return await Client.calls.list({limit: 20});
}