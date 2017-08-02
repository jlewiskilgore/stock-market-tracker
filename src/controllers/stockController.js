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
}

module.exports = new stockController();