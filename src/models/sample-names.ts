const sampleNames = [
  "Kalindu Sachintha Wijesundara",
  "Tymon Kolasiński",
  "Max Park",
  "Luke Garrett",
  "Zach Baruch",
  "Maciej Spirydowicz",
  "Mitchell Lane 6.25 Official Rubik's Cube Single",
  "Ron van Bruchem",
  "Luke Griesser",
  "I know it!",
  "hi bro 👋",
  "DG The Artist",
  "Oh my god I'm in a spaceship",
  "Delegate Report",
  "FLIP IT FLIP IT FLIP IT FLIP IT",
  "Stephen Nedoroscik",
  "Prime Energy Drink",
  "Freedom Loving American",
  "Cyoubix's Friends",
  "Me When",
  "Shain Papalotl Longbehn",
  "Circle Circle Square Square",
  "Spindorizer Nation",
  "#FTOForWCA",
  "#CH2ForWCA",
  "Shortcat",
  "Billy Mitchell",
  "Billy Dickson",
  "CubeLeg",
  "A7g",
  "2k6",
  "#FreeKalindu"
]

export default sampleNames

export const randomName = () => {
  const idx = Math.floor(Math.random() * sampleNames.length)  
  return sampleNames[idx]
}