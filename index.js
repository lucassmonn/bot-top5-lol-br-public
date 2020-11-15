const Twit = require('twit');
const T = new Twit(require('./config/keys_t.js'));
const BotController = require('./controller/bot')

const stream = T.stream('statuses/filter', { track: '!!top5br' });
const streamElo = T.stream('statuses/filter', { track: '!!elo' });


console.log('Bot iniciando...')

stream.on('tweet', function (tweet) {
  BotController.getTop(tweet)
});

streamElo.on('tweet', (tweet) => {
  BotController.getElo(tweet)
});