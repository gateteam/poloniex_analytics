const model = require("./parser.js"),
	express   = require("express"),
	app       = express(),
	server    = require('http').Server(app),
	momemt    = require('moment'),
	io        = require('socket.io')(server),
	expressStatic = require('express-static'),
	fs = require('fs'),
	bodyParser    = require('body-parser');

app.use(expressStatic(__dirname + '/public'));
app.use( express.bodyParser());
server.listen(80, ()=>{
	console.log ('Express listening on port ' + 80)
})


io.on('connection', function(socket){
	console.log("socket connect")

	socket.on("data", (data)=>{
		console.log(data.second, data.BTC, data.date)
		getCandles(data.second, data.BTC, data.date)
		.then((data) => {
			socket.emit("data", data)
		})
	});

});


getCandles = (second, BTC, date) => {
	if(  second !== "5" 
		&& second !== "10"
		&& second !== "30")
			return;

	let query = {BTC: BTC}
	date = new Date(date)

	if(date.toString() === "Invalid Date")
		date = new Date( moment().format('YYYY-MM-DD') );

	query.time = {
		$lte: date.getTime() + 86400000,
		$gte: date.getTime()
	}

	console.log(query)
	return new Promise((resolve, reject) => {

		let TimeStamp = new Date();
		model[second].collection.find(query).toArray().then((res)=>{
			console.log("Time db.find() ", (new Date() - TimeStamp)/1000, "seconds |    result.length ", res.length)
			if(err){
				console.log(err)
				return reject(err);
			}

			let result = [];

			for( i in res )
				result.push([res[i].time, res[i].open, res[i].high, res[i].low, res[i].close, res[i].total]);

			resolve(result);

		});
	})
}