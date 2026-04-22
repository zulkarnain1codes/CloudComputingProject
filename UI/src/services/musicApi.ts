const API_URL = import.meta.env.VITE_API_URL;

export const subscribeMusic = async (userEmail: string, song: any) => {
  const res = await fetch(`${API_URL}/music/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: userEmail,
      song: song,
    }),
  });

  return res.json();
};

export const getSubscriptions = async (userEmail: string) => {
  const res = await fetch(`${API_URL}/music/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: userEmail,
    }),
  });

  return res.json();
};

export const removeSubscription = async (userEmail: string, title: string) => {
  const res = await fetch(`${API_URL}/music/unsubscribe`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: userEmail,
      title: title,
    }),
  });

  return res.json();
};