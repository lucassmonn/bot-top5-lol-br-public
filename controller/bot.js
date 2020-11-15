const kayn = require('../config/lol');
const emoji = require('node-emoji');
const Twit = require('twit');
const T = new Twit(require('../config/keys_t.js'));

class BotController {

    getTop(tweet) {

        if (tweet.text.substring(0, 2) != 'RT') {
            kayn.Challenger.list('RANKED_SOLO_5x5').then(list => {
                let sortList = (list.entries.sort(this.compare));

                var list = [];
                let listNumbers = ['one', 'two', 'three', 'four', 'five'];
                let last = 199;

                for (var i = 0; 5 > i; i++) {
                    list.push(sortList[last])
                    last--
                }

                var message = `${emoji.get('star')} TOP 5 SOLOQ BR ${emoji.get('star')}  \n\n`;

                for (var i = 0; i < list.length; i++) {
                    message += `${emoji.get(listNumbers[i])} ${list[i].summonerName} com ${list[i].leaguePoints} pontos\n\n`
                }

                var nameID = tweet.id_str;

                var name = tweet.user.screen_name;

                T.post('statuses/update', { in_reply_to_status_id: nameID, status: '@' + name + ' ' + message }, function (err, data, response) {
                    console.log('Tweet feito para o usuário @' + name)
                })
            }).catch(err => {
                console.log(err);
            })
        }
    }

    getElo(tweet) {
        if (tweet.text.substring(0, 2) != 'RT') {

            var nameID = tweet.id_str;

            var name = tweet.user.screen_name;
            var text = tweet.text.split(' ')
            text = text[text.length - 1]


            kayn.Summoner.by.name(text).then(data => {
                kayn.League.Entries.by.summonerID(data.id).then(league => {
                    var filter = league.filter(function (obj) { return obj.queueType == 'RANKED_SOLO_5x5'; })
                    var elo = `${text} está ${filter[0].tier} ${filter[0].rank}`

                    T.post('statuses/update', { in_reply_to_status_id: nameID, status: '@' + name + ' ' + elo }, function (err, data, response) {
                        console.log('Tweet feito para o usuário @' + name)
                    })

                })
            }).catch(err => {
                message = 'O jogador não foi encontrado!'
                T.post('statuses/update', { in_reply_to_status_id: nameID, status: '@' + name + ' ' + message }, function (err, data, response) {
                    console.log('Tweet feito para o usuário @' + name)
                })
            })

        }
    }


    compare(a, b) {
        const A = a.leaguePoints;
        const B = b.leaguePoints;

        let comparison = 0;
        if (A > B) {
            comparison = 1;
        } else if (A < B) {
            comparison = -1;
        }
        return comparison;
    }
}

module.exports = new BotController(); 
