// config.js
export const config = {
    userTypes: {
        ADMINISTRATOR: 'Administrador',
        AGRICULTOR: 'Agricultor',
        GESTOR: 'Gestor',
    },
    mqtt: {
        clientId: 'iot-amilcar' + Math.floor(Math.random() * 8999 + 1000),
        brokerUrl: '62.171.180.52',
        port: 9001,
    },
};