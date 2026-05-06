const API_URL = import.meta.env.VITE_API_URL;

//
// LOGIN
//
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/login_lambda`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response.json();
}

//
// REGISTER
//
export async function registerUser(
  email: string,
  user_name: string,
  password: string
) {
  const response = await fetch(`${API_URL}/Register_Lambda`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      user_name,
      password,
    }),
  });

  return response.json();
}

// GET MUSIC
export async function getMusic(filters: {
  title?: string;
  artist?: string;
  year?: string;
  album?: string;
}) {
  const params = new URLSearchParams();
  if (filters.title)  params.append("title",  filters.title);
  if (filters.artist) params.append("artist", filters.artist);
  if (filters.year)   params.append("year",   filters.year);
  if (filters.album)  params.append("album",  filters.album);

  const response = await fetch(`${API_URL}/get_music_lambda?${params.toString()}`, {
    method: "GET",
  });
  return response.json();
}

// SUBSCRIBE
export async function subscribeMusic(userEmail: string, song: any) {
  const response = await fetch(`${API_URL}/subscribe_lambda`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_email: userEmail, song }),
  });
  return response.json();
}

// GET SUBSCRIPTIONS
export async function getSubscriptions(userEmail: string) {
  const response = await fetch(`${API_URL}/get_subscriptions_lambda?user_email=${userEmail}`, {
    method: "GET",
  });
  return response.json();
}

// REMOVE SUBSCRIPTION
export async function removeSubscription(userEmail: string, title: string, artist: string, year: string) {
  const response = await fetch(`${API_URL}/unsubscribe_lambda`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_email: userEmail, title, artist, year }),
  });
  return response.json();
}