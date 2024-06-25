const dbConfig = {
    user: 'sa',
    password: 'Reliant#1',
    server: '3.97.243.202',
    database: 'test',
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        instancename: '',
        port: 6625
    },
};

module.exports = dbConfig;
