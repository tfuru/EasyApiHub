const { IApi } = require("../IApi");
const logger = require("firebase-functions/logger");
const { KeyValue } = require('../../KeyValue');

class KeyValueApi extends IApi {
  constructor() {
    super();
  }

  async request(req) {
    const keyValue = new KeyValue();

    const identifier = req.identifier;
    const parameter = req.parameter;

    const cmd = parameter.cmd;
    const request = {
      identifier: identifier,
      ...parameter
    };
    logger.info("KeyValue request", request);

    let result = {
      'verify': "verify not found",
      'response': "cmd not found"
    };
    switch (cmd) {
      case "LOAD":
          {
              result = await keyValue.loadFromFirestore(request);
          }
          break;
      case "SAVE":
          {
              result = await keyValue.saveToFirestore(request);
          }
          break;
      default:
          break;
    }
    return result;
  }
}

KeyValueApi.type = "KEYVALUE";

module.exports = { KeyValueApi };