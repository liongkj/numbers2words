/**
 * vi_VN locale
 * @constructor
 
 */

T2W.VI_VN = function () { };

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */

T2W.VI_VN.DICTIONARY = {
    zero: "không",
    ones: ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
    onees: ["", "mốt", "hai", "ba", "bốn", "lăm", "sáu", "bảy", "tám", "chín"], //not casual
    teens: ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"],
    tens: ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"],
    hundred: "trăm",
    radix: ["", "nghìn", "triệu", "tỷ",],
    delimiters: [" ", "lẻ"] // Space for general separation, "lẻ" for numbers like 101 (một trăm lẻ một)
};


/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.VI_VN.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.VI_VN.MAX_NUMBERS = 21;



/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.VI_VN.prototype.translate = function (numbers) {

    // Check max value	
    if (numbers.length * T2W.VI_VN.TOKEN_LENGTH > T2W.VI_VN.MAX_NUMBERS) {
        throw {
            name: "Error",
            message: "The length of numbers is longer than the maximum value(" + T2W.VI_VN.MAX_NUMBERS + ")."
        };
    }

    // Deal with zero value	
    if (numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1) {
        return T2W.VI_VN.DICTIONARY.zero;
    }

    var words = [];
    for (var idx = 0, max = numbers.length; idx < max; idx++) {
        words.unshift(this._getTrio(this.tokenize(numbers[idx], 1), idx, max));
    }

    return this.joinNonEmptyParts(words)
};


/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the Vietnamese language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.VI_VN.prototype._getTrio = function (numbers, index, max) {
    var hundred = '';
    var ten = '';
    var single = '';
    var radixidx = '';

    var radix = this._getRadix(numbers, index);
    // handle hundred index value
    if (numbers[T2W.HUNDRED_INDEX]) {
        var hundredValue = this._getOnes(numbers[T2W.HUNDRED_INDEX]);
        var hundredWord = T2W.VI_VN.DICTIONARY.hundred;
        var delimiter = T2W.VI_VN.DICTIONARY.delimiters[1];

        // Check if there are numbers in the tens or singles place
        if (!numbers[T2W.TEN_INDEX] && numbers[T2W.SINGLE_INDEX]) {
            hundred = this.joinNonEmptyParts([hundredValue, hundredWord, delimiter])
        }
        else {
            // hundred = hundredValue + " " + hundredWord + " ";
            hundred = this.joinNonEmptyParts([hundredValue, hundredWord])
        }
    }

    // handle ten index value
    if (numbers[T2W.TEN_INDEX]) {
        ten = this._getTeens(numbers[T2W.SINGLE_INDEX]);
    }

    // handle tex index value after 2. etc. 20,21,22,23,24,25,26,27,28,29
    if (numbers[T2W.TEN_INDEX] >= 2) {
        ten = this._getTens(numbers[T2W.TEN_INDEX]);
        radixidx = T2W.VI_VN.DICTIONARY.radix.indexOf(radix);
        if (numbers.length <= 2 && radixidx >= 1) {
            ten += " " + this._getOnes(numbers[T2W.SINGLE_INDEX]);
            // Use "mốt" in regular contexts
        } else {
            ten += " " + this._getOnees(numbers[T2W.SINGLE_INDEX]);
        }

    }
    // only has single digit, 1,2,3,4,5,6,7,8,9
    if (!numbers[T2W.TEN_INDEX]) {
        single = this._getOnes(numbers[T2W.SINGLE_INDEX]);
    }


    if (index === 0 && index + 1 < max && !numbers[T2W.TEN_INDEX] && (numbers[T2W.SINGLE_INDEX])) {
        hundred = T2W.VI_VN.DICTIONARY.delimiters[1];
    }
    return this.joinNonEmptyParts([hundred, ten, single, radix])

};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.VI_VN.prototype._getOnes = function (number) {
    return T2W.VI_VN.DICTIONARY.ones[number];
};

/**
 * Get onees
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.VI_VN.prototype._getOnees = function (number) {
    return T2W.VI_VN.DICTIONARY.onees[number];
};


/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.VI_VN.prototype._getTens = function (number) {
    return T2W.VI_VN.DICTIONARY.tens[number];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.VI_VN.prototype._getTeens = function (number) {
    return T2W.VI_VN.DICTIONARY.teens[number];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.VI_VN.prototype._getRadix = function (numbers, index) {
    var radix = '';
    if (index > 0 && (index >= 2 || numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])) {
        radix = T2W.VI_VN.DICTIONARY.radix[index];
    }

    return radix;
};
