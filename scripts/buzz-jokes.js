// Description:
//   Commands for jokes
//
// Commands:
//   hubot tell me a joke - tells a joke
//   hubot don't tell me a joke - tells an antijoke

module.exports = function(robot) {

  robot.respond(/tell me a joke/i, function(msg) {
    msg.send(msg.random(jokes) + "\n(☞ﾟヮﾟ)☞\n☜(ﾟヮﾟ☜)");
  });
  robot.respond(/(don't|dont) tell me a joke/i, function(msg) {
    msg.send(msg.random(antijokes));
  });
}

var jokes = [
  "What do you call a stuck-up criminal walking down the stairs?\nA condascending con descending.",
  "What do you call a psychic midget who just escaped from prison?\nA small medium at large.",
  "Why can't you hear a pterodactyl go to the bathroom?\nBecause the P is silent.",
  "I went to a zoo once, and the only animal there was a dog.\nIt was a shihtzu.",
  "What do you get when you combine a rhetorical question and a joke?",
  "Why is the letter C afraid of the rest of the alphabet?\nBecause all the other letters are not-Cs.",
  "Why was the soldier pinned down?\nBecause he was under a tack.",
  "I can see " + (2020-new Date().getFullYear()) + " years into the future.\nI have 2020 vision.",
  "Three guys are sitting on a boat with four cigarettes and no way to light them. What do they do?\nThrow one cigarette overboard so the whole boat becomes a cigarette lighter.",
  "Why did the can crusher quit his job?\nBecause it was soda pressing.",
  "What do you call a broken can opener?\nA can't opener.",
  "Why can't you trust Skrillex to carry a fish?\nBecause he'll drop the bass.",
  "How did the hipster burn his lip?\nHe drank his coffee before it was cool.",
  "My friend really changed when she became a vegetarian.\nIt was like I'd never seen her-bivore.",
  "A guy walks into a bar and sees 3 pieces of meat hanging from the ceiling. The guy asks, \"What's this about?\"\nThe bartender replies, \"Well, if you can jump up and slap the meat, you get free drinks for the rest of the night. If you miss, you pay for everyone's drinks for the next hour. You wanna do it?\"\nThe guy replies, \"Nah, the steaks are too high.\"",
  "How do you organize a party in space?\nYou planet.",
  "I'd like to give a shoutout to sidewalks for keeping me off the streets.",
  "What do you call a Labrador that becomes a magician?\nA Labracadabrador!",
  "Why was six afraid of seven?\nBecause seven eight nine.",
  "Why did the archaeologist commit suicide?\nBecause his career was in ruins.",
  "A physicist walks by a building and sees a man standing at the top.\nThe physicist says \"Don't jump! You have so much potential!\"",
  "A photon checks into a hotel. The bellhop asks if he needs help with his bags.\n\"No thanks, I'm traveling light.\""
];

var antijokes = [
  "Why can't you hear a pterodactyl go to the bathroom?\nBecause pterodactyls are extinct.",
  "What's brown and rhymes with Snoop?\nDr. Dre.",
  "I ain't sayin she a gold digger...\nBut she did move to California in 1849.",
  "I have glasses but cannot see. I have feet but cannot walk. What am I?\nA riddle.",
  "What's red and bad for your teeth?\nA brick.",
  "Why can't you trust Skrillex to carry a fish?\nBecause fish are slippery.",
  "This basically sums up the 90s:\n90+91+92+93+94+95+96+97+98+99 = 945",
  "Why was the boy sad?\nHe had a frog stapled to his face.",
  "How does Batman's mom call him to dinner?\nShe doesn't. She's dead.",
  "How did the hipster burn his lip?\nHe was trapped in a house fire and suffered from 3rd degree burns on 90% of his body.",
  "I got 99 problems\nAnd one of them is that I count my problems instead of solving them.",
  "Why was six afraid of seven?\nBecause seven is a registered six offender.",
  "An Englishman, an Irishman, and a Spaniard walk into a bar.\nThe bartender says \"Is this some kind of joke?\""
];
