require('dotenv').config();

module.exports = {
    URL: process.env.VALORO_URL,
    NETWORKNAME: process.env.NETWORK_NAME,
    CONTRACTNAME: process.env.CONTRACT_NAME,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    roles: {
        admin: 'admin',
        client: 'client',
        technicalManager: 'technicalManager',
        financialManager: 'financialManager'
    }
};