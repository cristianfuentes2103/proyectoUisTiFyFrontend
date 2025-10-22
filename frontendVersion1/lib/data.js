const playlists = [
  {
    id: '1',
    albumId: 1,
    title: "The Eminem Show",
    color: colors.yellow,
    cover:
      "https://m.media-amazon.com/images/I/71n0xmxpw7L._SL1400_.jpg",
    artists: ["Eminem"],
  },
  {
    id: '2',
    albumId: 2,
    title: "Californication",
    color: colors.green,
    cover:
      "https://m.media-amazon.com/images/I/61oied0UgVL._UF1000,1000_QL80_.jpg",
    artists: ["Red Hot Chili Peppers"],
  },
  {
    id: '3',
    albumId: 3,
    title: "Master of Puppets",
    color: colors.rose,
    cover:
      "https://upload.wikimedia.org/wikipedia/en/b/b2/Metallica_-_Master_of_Puppets_cover.jpg",
    artists: ["Metallica"],
  },
  {
    id: '4',
    albumId: 4,
    title: "The Dark Side of the Moon",
    color: colors.blue,
    cover:
      "https://www.lamusica.com.co/cdn/shop/products/81aTawcGdmL._SL1500.jpg?v=1590757797",
    artists: ["Pink Floyd"],
  },
  {
    id: '5',
    albumId: 5,
    title: "Appetite for Destruction",
    color: colors.purple,
    cover:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Appetitefordestruction.jpg/250px-Appetitefordestruction.jpg",
    artists: ["Guns N’ Roses"],
  },
  {
    id: '6',
    albumId: 6,
    title: "American Idiot",
    color: colors.orange,
    cover:
      "https://upload.wikimedia.org/wikipedia/en/e/ed/Green_Day_-_American_Idiot_album_cover.png",
    artists: ["Green Day"],
  },
];

const morePlaylists = playlists.map((item) => ({
  ...item,
  id: item.id + "_more",
}))

const sidebarPlaylists = playlists.map((item) => ({
  ...item,
  id: item.id + "_side",
}))

const allPlaylists = [
  ...playlists,
  ...morePlaylists,
  ...sidebarPlaylists,
]

const songs = [
  {
    "id": 1,
    "albumId": 1,
    "title": "Moonlit Walk",
    "image": `https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "2:57"
  },
  {
    "id": 2,
    "albumId": 1,
    "title": "Coffee Daze",
    "image": `https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:40"
  },
  {
    "id": 3,
    "albumId": 1,
    "title": "Skyline Serenade",
    "image": `https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "3:29"
  },
  {
    "id": 4,
    "albumId": 1,
    "title": "Urban Echoes",
    "image": `https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "2:11"
  },
  {
    "id": 5,
    "albumId": 1,
    "title": "Night's End",
    "image": `https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_4-min.png?v=1680526353`,
    "artists": ["LoFi Dreamer"],
    "album": "Chill Lo-Fi Music",
    "duration": "2:26"
  }
]

window.UisTiFyData = {
    playlists: playlists,
    songs: songs,
    allPlaylists: allPlaylists
};