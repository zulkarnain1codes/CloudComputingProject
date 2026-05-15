import { getApiUrl } from '../config/apiConfig';

export const subscribeMusic = async (userEmail: string, song: any) => {
  const res = await fetch(`${getApiUrl()}/music/subscribe`, {
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
  const res = await fetch(
    `${getApiUrl()}/music/subscriptions?user_email=${encodeURIComponent(userEmail)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.json();
};
export const removeSubscription = async (
  userEmail: string,
  title: string,
  artist: string,
  year: string
) => {
  const res = await fetch(`${getApiUrl()}/music/unsubscribe`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: userEmail,
      title,
      artist,
      year,
    }),
  });

  return res.json();
};