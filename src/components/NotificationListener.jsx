import { useDynamicToast } from "@/hooks/useDynamicToast";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { useSelector } from "react-redux";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default function NotificationListener() {
  const user = useSelector((state) => state.auth.user);
  const { showToast } = useDynamicToast();
  const token = getCookie('smartlife_token');

  useNotificationsSocket(
    user,
    token,
    (notif) => {
      showToast({
        title: notif.title,
        message: notif.message,
        type: notif.type || "info",
      });
    }
  );

  return null;
}
