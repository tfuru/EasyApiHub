/** API Interface
 * 
 */

class IApi {
    constructor() {
        if (this.constructor === IApi) {
            throw new TypeError('Abstract class "IApi" cannot be instantiated directly.');
        }
    }
    async request(req) {
        throw new Error('You have to implement the method request!');
    }
}
IApi.type = "IApi";

module.exports = { IApi };