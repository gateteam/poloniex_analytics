const W3CWebSocket = require('websocket').w3cwebsocket,
	moment = require('moment'),
	fs = require('fs'),
	mongoose = require('mongoose').connect('mongodb://localhost/api2Poloniex'),
	url = 'wss://api2.poloniex.com/',
	cron = require('cron').CronJob;

const MS_IN_SECOND = 1000

/*Модель в базе данных*/
const DataBase0 = module.exports[0] = mongoose.model('TRADE HISTORY', { 
	BTC:    {type: String,required: true},
	data:   {type: String,required: true},
	time:   {type: Number,required: true},
	type:   {type: String,required: true},
	price:  {type: Number,required: true},
	amount: {type: Number,required: true},
	total:  {type: Number,required: true},
});

schema = { 
	BTC:    {type: String, required: true},
	open:   {type: Number, required: true},
	close:  {type: Number, required: true},
	high:   {type: Number, required: true},
	low:    {type: Number, required: true},
	time:   {type: Number, required: true},
	total:  {type: Number, required: true},
}

const DataBase5 =  module.exports["5"] = mongoose.model('TRADE HISTORY 5', schema);
const DataBase10 = module.exports["10"] = mongoose.model('TRADE HISTORY 10', schema);
const DataBase30 = module.exports["30"] = mongoose.model('TRADE HISTORY 30', schema);

const DataBase = {
	"0": DataBase0,
	"5":  DataBase5,
	"10": DataBase10,
	"30": DataBase30
}

const BTC = ["BTC_AMP", "BTC_ARDR", "BTC_BCY", "BTC_BELA", "BTC_BLK", "BTC_BTCD", "BTC_BTM", "BTC_BTS", "BTC_BURST", "BTC_CLAM", "BTC_DASH", "BTC_DCR", "BTC_DGB", "BTC_DOGE", "BTC_EMC2", "BTC_ETC", "BTC_ETH", "BTC_EXP", "BTC_FCT", "BTC_FLDC", "BTC_FLO", "BTC_GAME", "BTC_GNT", "BTC_GRC", "BTC_HUC", "BTC_LBC", "BTC_LSK", "BTC_LTC", "BTC_MAID", "BTC_NAUT", "BTC_NAV", "BTC_NEOS", "BTC_NMC", "BTC_NOTE", "BTC_NXC", "BTC_NXT", "BTC_OMNI", "BTC_PASC", "BTC_PINK", "BTC_POT", "BTC_PPC", "BTC_RADS", "BTC_REP", "BTC_RIC", "BTC_SBD", "BTC_SC", "BTC_SJCX", "BTC_STEEM", "BTC_STR", "BTC_STRAT", "BTC_SYS", "BTC_VIA", "BTC_VRC", "BTC_VTC", "BTC_XBC", "BTC_XCP", "BTC_XEM", "BTC_XMR", "BTC_XPM", "BTC_XRP", "BTC_XVC", "BTC_ZEC"];

const BTCobj = {"160": "BTC_AMP", "177": "BTC_ARDR", "160": "BTC_AMP", "177": "BTC_ARDR", "151": "BTC_BCY", "8": "BTC_BELA", "10": "BTC_BLK", "12": "BTC_BTCD", "13": "BTC_BTM", "14": "BTC_BTS", "15": "BTC_BURST", "20": "BTC_CLAM", "24": "BTC_DASH", "162": "BTC_DCR", "25": "BTC_DGB", "27": "BTC_DOGE", "28": "BTC_EMC2", "171": "BTC_ETC", "148": "BTC_ETH", "153": "BTC_EXP", "155": "BTC_FCT", "31": "BTC_FLDC", "32": "BTC_FLO", "38": "BTC_GAME", "185": "BTC_GNT", "40": "BTC_GRC", "43": "BTC_HUC", "167": "BTC_LBC", "163": "BTC_LSK", "50": "BTC_LTC", "51": "BTC_MAID", "60": "BTC_NAUT", "61": "BTC_NAV", "63": "BTC_NEOS", "64": "BTC_NMC", "66": "BTC_NOTE", "183": "BTC_NXC", "69": "BTC_NXT", "58": "BTC_OMNI", "184": "BTC_PASC", "73": "BTC_PINK", "74": "BTC_POT", "75": "BTC_PPC", "158": "BTC_RADS", "174": "BTC_REP", "83": "BTC_RIC", "170": "BTC_SBD", "150": "BTC_SC", "86": "BTC_SJCX", "168": "BTC_STEEM", "89": "BTC_STR", "182": "BTC_STRAT", "92": "BTC_SYS", "97": "BTC_VIA", "99": "BTC_VRC", "100": "BTC_VTC", "104": "BTC_XBC", "108": "BTC_XCP", "112": "BTC_XEM", "114": "BTC_XMR", "116": "BTC_XPM", "117": "BTC_XRP", "98": "BTC_XVC", "178": "BTC_ZEC"}
const candles = {};

for(let b in BTC){
	candles[BTC[b]] = {
		"5": getDefaultCandle("5", BTC[b], undefined),
		"10": getDefaultCandle("10", BTC[b], undefined),
		"30": getDefaultCandle("30", BTC[b], undefined)
	};
}

const connect = () => {
	const client = new W3CWebSocket(url);
	client.onerror = function() {
			console.log('Connection Error');
	};

	client.onopen = function() {
		console.log(`WebSocket Client Connected`);
		for(let b in BTC){
			client.send(`{"command":"subscribe", "channel":"${BTC[b]}"}`)
		}
	};

	client.onclose = function() {
			console.log('echo-protocol Client Closed');
			clearInterval(Interval);
			delete client;
			setTimeout(()=>{
				newConnect(++b);
			}, randomInteger(30, 120) * MS_IN_SECOND );
	};

	client.onmessage = function(e) {
		if (typeof e.data !== 'string') {
			return;
		}
		data = JSON.parse(e.data)
		d = moment()
		d.hour(d.hour()-3)

		if(data[2])
			if(data[2][1])
				for(i in data[2])
					if(data[2][i][0] == "t") {
						let candle = candles[ BTCobj [data[0]]  ] 
						let price = data[2][i][3];
						let total = data[2][i][4];
						candle["5"] = candleHeandle(candle["5"], price, total);
						candle["10"] = candleHeandle(candle["10"], price, total);
						candle["30"] = candleHeandle(candle["30"], price, total);
					}
	}
}
connect();

candleHeandle = (candle, price, total)=>{
	candle["open"]  = !candle.open  ? price : candle.open;
	candle["close"] = price;
	candle["high"]  = candle.high < price || !price? price : candle.high;
	candle["low"]   = candle.low  > price || !price? price : candle.low;
	candle["total"] = candle.total + (price * total);
	return candle
}

/*Сохранение в бд*/
saveCandleToDb = (num, data)=>{
	// console.log("save")
	if(num !== "0" && num !== "5" && num !== "10" &&  num !== "30") return;
	let toSave = new DataBase[num](data)
	return toSave.save()
	// .then(() => {
	// 	console.log("save ",data.BTC)
	// })
	.catch((err) => {
		// console.log("err ",data.BTC)
		// console.log(err)
	});
}

function randomInteger(min, max) {
	var rand = min - 0.5 + Math.random() * (max - min + 1)
	rand = Math.round(rand);
	return rand;
}

setCron = (sec) => {
	console.log(`Cron start sec: ${sec}`);
	new cron(`*/${sec} * * * * *`, function() {
		/* Runs every 10 seconds */
			for(let b in BTC){
				let candle = candles[ BTC[b] ][sec];
				saveCandleToDb(sec, candle)
				candles[ BTC[b] ][sec] = getDefaultCandle(sec, BTC[b], candle.close);
			}
		}, function () {
			console.log("!!! CRON 5 IS STOPS")
		}
		,true /* Start the job right now */
	);
}
setCron("5")
setCron("10")
setCron("30")

function getDefaultCandle(time, BTC, price){
	return {
		BTC,
		s: time,
		open: price,
		close: price,
		high: price,
		low: price,
		time: new Date().getTime(),
		total: 0
	}
}



// Da1taBase5.remove({}), function(){
// 	console.log("remove", arguments)
// });
// DataBase10.remove({})
// DataBase30.remove({})