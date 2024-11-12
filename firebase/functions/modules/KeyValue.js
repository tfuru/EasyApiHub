/** KeyValue
 * 
 *  指定されたキーと値を保持するクラス
 *  Firestore への ロードとセーブのためのメソッドを持つ
 * 
 */

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

class KeyValue {
    constructor() {
        try {
            initializeApp();
        } catch (e) {
            // logger.error(e);
        }
        this.db = getFirestore();
        // タイムゾーンを設定
        process.env.TZ = 'UTC';
        // logger.log(`TZ: ${process.env.TZ}`);
    }

    // レスポンスを作成する
    createResponse(request, data) {
        const timestamp_utc = new Date().getTime();
        return {
            'identifier': request.identifier,
            'idfc': request.idfc ?? '',
            'userid': data.userid ?? '',
            'value': data.value,
            'timestamp_utc': timestamp_utc,
        }
    }
    
    // db に verify をセットする
    setVerify(identifier, value) {
        return new Promise((resolve, reject) => {
            this.db
                .collection(identifier)
                .doc('verify')
                .set({
                    'value': value
                })
                .then(() => {
                    logger.log("Document successfully written!");
                    resolve({
                        'identifier': identifier,
                        'verify': value                  
                    });
                });
        });
    }

    // db から verify を取得する
    getVerify(identifier) {
        return new Promise((resolve, reject) => {
            this.db
                .collection(identifier)
                .doc('verify')
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        logger.log("Document data:", doc.data());
                        const data = doc.data();
                        resolve(data.value);
                    } else {
                        // doc.data() will be undefined in this case
                        logger.log("No such document!");
                        reject(null);
                    }
                });
        });
    }

    // Firestore からデータをロードする
    loadFromFirestore(request) {
        const _self = this;
        return new Promise(async (resolve, reject) => {
            // verify の 取得
            const verify = await _self.getVerify(request.identifier);
            if (verify == null) {
                reject("verify not found");
                return;
            }            
            this.db
                .collection(request.identifier)
                .doc(request.idfc)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        logger.log("Document data:", doc.data());
                        const data = doc.data();
                        const response = JSON.stringify(_self.createResponse(request, data));
                        const result = {
                            'verify': verify,
                            'response': response
                        };                    
                        resolve(result);                    
                    } else {
                        // doc.data() will be undefined in this case
                        logger.log("No such document!");
                        reject("No such document!");
                    }
                });       
        });
    }

    // Firestore にデータをセーブする
    saveToFirestore(request) {
        const _self = this;
        return new Promise(async (resolve, reject) => {        
            const data = {
                'identifier': request.identifier,
                'idfc': request.idfc,
                'userid': request.userid ?? '',
                'value': request.value
            };
            // verify の 取得
            const verify = await _self.getVerify(request.identifier);
            if (verify == null) {
                reject("verify not found");
                return;
            } 
            this.db
                .collection(request.identifier)
                .doc(request.idfc)
                .set(data)
                .then(() => {
                    logger.log("Document successfully written!");
                    const response = JSON.stringify(_self.createResponse(request, data));
                    const result = {
                        'verify': verify,
                        'response': response
                    }; 
                    resolve(result);
                });
        });
    }
}

module.exports = { KeyValue };