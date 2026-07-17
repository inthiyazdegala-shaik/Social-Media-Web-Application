export const storyUsers = [
  { name: "world", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80" },
  { name: "climate", image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?auto=format&fit=crop&w=900&q=80" },
  { name: "cities", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=900&q=80" },
  { name: "science", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80" },
  { name: "people", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80" },
  { name: "sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80" }
];

export const suggestionUsers = ["world.pulse", "climate.watch", "startup.radar", "city.signal", "sports.live", "culture.now"];

export const pulseTopics = ["World", "Technology", "Climate", "Sports", "Culture", "Campus", "Startups"];

export const liveSignals = [
  { label: "Climate", text: "Heat alerts and rain updates are moving fast across cities." },
  { label: "Technology", text: "Creators are testing new AI tools for video, study, and design." },
  { label: "Community", text: "Local groups are organizing cleanups, events, and donation drives." }
];

export const worldPosts = [
  {
    id: "world-demo-1",
    username: "world.pulse",
    name: "World Pulse",
    place: "Global update",
    caption: "Morning signal: creators, students, and local groups are sharing what is changing around them today. Add your city to the circle.",
    likes: 18420,
    comments: 928,
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    source: "World",
    demo: true
  },
  {
    id: "world-demo-2",
    username: "climate.watch",
    name: "Climate Watch",
    place: "Earth report",
    caption: "Heat, rain, air quality, water levels: small local reports become useful when people post what they actually see.",
    likes: 9270,
    comments: 341,
    image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 84).toISOString(),
    source: "Climate",
    demo: true
  },
  {
    id: "world-demo-3",
    username: "startup.radar",
    name: "Startup Radar",
    place: "Tech and ideas",
    caption: "Students are building tools for notes, design, local delivery, and community alerts. Post your build, not just the result.",
    likes: 13205,
    comments: 512,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    source: "Technology",
    demo: true
  },
  {
    id: "world-demo-4",
    username: "city.signal",
    name: "City Signal",
    place: "Community live",
    caption: "A street food meetup, cleanup drive, and open mic are happening this weekend. Real life looks better when the feed helps people show up.",
    likes: 7310,
    comments: 204,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    source: "Community",
    demo: true
  },
  {
    id: "world-demo-5",
    username: "sports.live",
    name: "Sports Live",
    place: "Matchday",
    caption: "Fans are posting from watch parties, local grounds, and campus tournaments. The best sports feed starts with the crowd.",
    likes: 15840,
    comments: 604,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
    source: "Sports",
    demo: true
  },
  {
    id: "world-demo-6",
    username: "culture.now",
    name: "Culture Now",
    place: "People and culture",
    caption: "Music, street style, food, college festivals, local art: culture becomes real when people show what is happening nearby.",
    likes: 11290,
    comments: 389,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    source: "Culture",
    demo: true
  }
];

export function initials(value) {
  return (value || "C").trim().slice(0, 1).toUpperCase();
}
