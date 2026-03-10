const WebSocket = require("ws");
const axios = require("axios");

const CONFIG = {
  wsUrl: "wss://api.smartlife.az/wss/app/rv_k8Xp2mNqL5vRtY9wZjH3sBcD",
  authUrl: "https://api.smartlife.az/api/broadcasting/auth",
  loginUrl: "https://api.smartlife.az/api/v1/auth/login",

  credentials: {
    login: "root@smartlife.az",
    password: "12345678",
    login_type: "web",
  },

  accountType: "user",
  accountId: 1,
};

async function start() {
  try {
    console.log("Login olunur...");

    const login = await axios.post(CONFIG.loginUrl, CONFIG.credentials);

    const token = login.data?.data?.token;

    if (!token) {
      console.log("Token tapılmadı");
      return;
    }

    console.log("Token alındı");

    const channel = `private-notifications.${CONFIG.accountType}.${CONFIG.accountId}`;

    console.log("WebSocket qoşulur...");

    const ws = new WebSocket(CONFIG.wsUrl + "?protocol=7&client=js&version=8.4.0");

    ws.on("open", async () => {
      console.log("WS connected");

      try {
        console.log("Channel auth olunur...");

        const auth = await axios.post(
          CONFIG.authUrl,
          {
            socket_id: "1234.5678",
            channel_name: channel,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        console.log("Auth response:", auth.data);

        const subscribe = {
          event: "pusher:subscribe",
          data: {
            auth: auth.data.auth,
            channel: channel,
          },
        };

        ws.send(JSON.stringify(subscribe));

        console.log("Channel subscribe edildi:", channel);
      } catch (err) {
        console.error("Auth error:", err.response?.data || err.message);
      }
    });

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());
        console.log("WS message:", data);
      } catch {
        console.log("WS raw:", msg.toString());
      }
    });

    ws.on("error", (err) => {
      console.error("WS error:", err.message);
    });

    ws.on("close", () => {
      console.log("WS disconnected");
    });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

start();