module.exports = new (class Service {

    constructor() { }

    /**
     * Is str a valid json?
     * @param {*} str 
     * @returns 
     */
    isValidJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
});