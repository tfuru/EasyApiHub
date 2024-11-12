/** 各種 外部API へのリクエストを中継するクラス
 * 
 */
const logger = require("firebase-functions/logger");
const { API_LIST } = require("./api/ApiList");

class Api {
  constructor() {
    logger.debug(`Api`, `constructor`);
  }

  async request(req) {
    const type = req.type.toUpperCase();
    // API_LIST に一致するクラスがあるか確認
    const api = API_LIST.find(api => api.type === type) || null;
    if (api) {
      try {      
        // 一致するクラスがある場合
        return await (new api()).request(req);
      }
      catch (e) {
        // 何らかのエラーが発生した場合 エラーメッセージ を返す
        logger.error(e);
        return {
          'error': e.message,
          type: api.type,
        }
      }
    } else {
      // 一致するクラスがない場合 エラーメッセージ を返す
      const result = {
        'error': "API not found",
      };
      return result;
    }
  }
}

module.exports = { Api };