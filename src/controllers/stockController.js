function stockController() {
	this.getStockIndex = function(req, stockSymbol, stockArray, callback) {
		for(var i=0; i < stockArray.length; i++) {
			if(stockArray[i].symbol == stockSymbol) {
				callback(i);
				return;
			}
		}

		callback(-1);
	};

	this.deleteStockBySymbol = function(stockArr, symbol, callback) {
		console.log(stockArr);
		console.log(symbol);

		var updatedStockArr = stockArr.filter(function(obj) {
			return obj.symbol !== symbol;
		});

		callback(updatedStockArr);
	};
}

module.exports = new stockController();