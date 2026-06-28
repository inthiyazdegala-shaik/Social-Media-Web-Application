export const storyUsers = [
  { name: "your story", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80" },
  { name: "forest", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80" },
  { name: "river", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80" },
  { name: "mountain", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80" },
  { name: "flowers", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80" },
  { name: "ocean", image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=80" }
];

export const suggestionUsers = ["daily.pulse", "tech.brief", "earth.report", "city.circle"];

export function initials(value) {
  return (value || "C").trim().slice(0, 1).toUpperCase();
}
