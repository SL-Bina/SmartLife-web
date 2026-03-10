import { useEffect, useRef, useState, useCallback } from "react";

const APP_KEY = "rv_k8Xp2mNqL5vRtY9wZjH3sBcD";
const WS_BASE = `wss://api.smartlife.az/app/${APP_KEY}`;
const WS_URL = `${WS_BASE}?protocol=7&client=js&version=8.4.0`;
const AUTH_URL = "https://api.smartlife.az/api/broadcasting/auth";

const MAX_RETRIES = 10;
const BASE_DELAY = 1000;   // 1s
const MAX_DELAY = 30000;   // 30s

export function useNotificationsSocket(user, token, onNotification) {
  const wsRef = useRef(null);
  const retriesRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const onNotificationRef = useRef(onNotification);
  const [isConnected, setIsConnected] = useState(false);

  // Callback ref-ə saxla ki dependency array-ə düşməsin
  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    const accountType = user.is_resident ? "resident" : "user";
    const channelName = `private-notifications.${accountType}.${user.id}`;

    // Əvvəlki bağlantını bağla
    if (wsRef.current) {
      try { wsRef.current.close(); } catch { /* ignore */ }
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      console.log("[WS] Connected");
      setIsConnected(true);
      retriesRef.current = 0; // reset retry counter on success
    };

    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);

        // Pusher connection established — auth et
        if (message.event === "pusher:connection_established") {
          const { socket_id } = JSON.parse(message.data);

          const authRes = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              socket_id,
              channel_name: channelName,
            }),
          });

          if (!authRes.ok) {
            console.error("[WS] Auth failed:", authRes.status);
            return;
          }

          const { auth } = await authRes.json();

          ws.send(JSON.stringify({
            event: "pusher:subscribe",
            data: { channel: channelName, auth },
          }));

          console.log(`[WS] Subscribed to ${channelName}`);
        }

        // Pusher ping → pong cavab ver (keep-alive)
        if (message.event === "pusher:ping") {
          ws.send(JSON.stringify({ event: "pusher:pong", data: {} }));
        }

        // Notification gəldi
        if (message.event === "notification.sent") {
          const data = JSON.parse(message.data);
          const notif = {
            id: data.id || Date.now(),
            title: data.title || "Bildiriş",
            message: data.message || "",
            type: data.type || "info",
            data: data.data || null,
            receivedAt: new Date().toISOString(),
          };
          onNotificationRef.current?.(notif);
        }

      } catch (err) {
        console.error("[WS] Message parse error:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };

    ws.onclose = (event) => {
      if (!mountedRef.current) return;
      console.warn("[WS] Disconnected, code:", event.code);
      setIsConnected(false);

      // Auto-reconnect with exponential backoff
      if (retriesRef.current < MAX_RETRIES) {
        const delay = Math.min(BASE_DELAY * Math.pow(2, retriesRef.current), MAX_DELAY);
        retriesRef.current += 1;
        console.log(`[WS] Reconnecting in ${delay}ms (attempt ${retriesRef.current}/${MAX_RETRIES})`);
        reconnectTimerRef.current = setTimeout(connect, delay);
      } else {
        console.error("[WS] Max retries reached, giving up.");
      }
    };
  }, [user?.id, user?.is_resident, token]);

  useEffect(() => {
    mountedRef.current = true;

    if (!user?.id || !token) return;

    connect();

    return () => {
      mountedRef.current = false;
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch { /* ignore */ }
      }
    };
  }, [connect]);

  const sendMessage = useCallback((payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { isConnected, sendMessage };
}
