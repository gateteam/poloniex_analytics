var socket = io();
socket.on('connect', () => console.log("SOCKET IO Connect"));


var inputTime = document.getElementsByClassName("Time")
var selectBTC = document.getElementById("select")


const BTC = ["BTC_AMP", "BTC_ARDR", "BTC_BCY", "BTC_BELA", "BTC_BLK", "BTC_BTCD", "BTC_BTM", "BTC_BTS", "BTC_BURST", "BTC_CLAM", "BTC_DASH", "BTC_DCR", "BTC_DGB", "BTC_DOGE", "BTC_EMC2", "BTC_ETC", "BTC_ETH", "BTC_EXP", "BTC_FCT", "BTC_FLDC", "BTC_FLO", "BTC_GAME", "BTC_GNT", "BTC_GRC", "BTC_HUC", "BTC_LBC", "BTC_LSK", "BTC_LTC", "BTC_MAID", "BTC_NAUT", "BTC_NAV", "BTC_NEOS", "BTC_NMC", "BTC_NOTE", "BTC_NXC", "BTC_NXT", "BTC_OMNI", "BTC_PASC", "BTC_PINK", "BTC_POT", "BTC_PPC", "BTC_RADS", "BTC_REP", "BTC_RIC", "BTC_SBD", "BTC_SC", "BTC_SJCX", "BTC_STEEM", "BTC_STR", "BTC_STRAT", "BTC_SYS", "BTC_VIA", "BTC_VRC", "BTC_VTC", "BTC_XBC", "BTC_XCP", "BTC_XEM", "BTC_XMR", "BTC_XPM", "BTC_XRP", "BTC_XVC", "BTC_ZEC"];


for(var i in BTC){
	$(selectBTC).append(`<option value="${BTC[i]}" >${BTC[i]}</option>`)
}



$("input").on("change", RESET);
$(selectBTC).on("change", RESET);
$("#RESET").on("click", RESET);



RESET();
function RESET(){
	var time = 5;
	for(i in inputTime){
		if(inputTime[i].checked)
			time = inputTime[i].value;
	}
	var date = $(".Date").val();
	if(!date)
		date =  moment().format('YYYY-MM-DD') 

	var timeStamp = new Date()
	socket.emit("data",{
		second: time,
		BTC: $(selectBTC).val(),
		date: date
	})

	return;
}



socket.on('data', function(data){
	console.log(data)
	var ohlc = [],
		volume = [],
		groupingUnits = [
		['second', [1, 2, 5, 10, 15, 30, 60, 90, 120] ],
		// ['mitute', [1, 2, 5, 10, 15, 30, 60, 90, 120] ],
		];

	for (let i = 0; i < data.length; i += 1) {
		ohlc.push([
			data[i][0], // the date
			data[i][1], // open
			data[i][2], // high
			data[i][3], // low
			data[i][4] // close
		]);

		volume.push([
			data[i][0], // the date
			data[i][5] // the volume
		]);
	}

	// create the chart
	Highcharts.stockChart( "content", {rangeSelector: {selected: 0, buttons: [{type: 'minute', count: 5, text: '5m'}, {type: 'minute', count: 10, text: '10m'}, {type: 'minute', count: 15, text: '15m'}, {type: 'minute', count: 20, text: '20m'}, {type: 'all', text: 'All'} ] }, chart: {backgroundColor: null, style: {fontFamily: 'Signika, serif'} }, title: {text: $(selectBTC).val(), style: {color: 'black', fontSize: '16px', fontWeight: 'bold'} }, colors: ['#a42015', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'], yAxis: [{labels: {align: 'right', x: -3 }, title: {text: 'OHLC'}, height: '60%', lineWidth: 2 }, {labels: {align: 'right', x: -3 }, title: {text: 'Volume'}, top: '65%', height: '35%', offset: 0, lineWidth: 2 }], tooltip: {split: true }, series: [{type: 'candlestick', allowPointSelect: true, name: 'AAPL', stack: 5, upColor: "#339349", data: ohlc, dataGrouping: {units: groupingUnits } }, {type: 'column', name: 'Volume', data: volume, yAxis: 1, dataGrouping: {units: groupingUnits } }] });
});
