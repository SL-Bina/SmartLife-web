const WebSocket = require('ws');
const http = require('https');

const CONFIG = {
    wsUrl: 'wss://api.smartlife.az:8080/app/rv_k8Xp2mNqL5vRtY9wZjH3sBcD',
    authUrl: 'https://api.smartlife.az/api/broadcasting/auth',
    loginUrl: 'https://api.smartlife.az/api/v1/auth/login',
    credentials: {
        login: 'root@smartlife.az',
        password: '12345678',
        login_type: 'web',
    },
    accountType: 'user', // 'user' ya 'resident'
    accountId: 1,
};