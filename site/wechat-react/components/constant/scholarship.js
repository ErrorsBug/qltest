export const scholarship = {
    letters: [
        '只有20份，不来抢一个吗？',
        '别紧张，领个奖学金再走',
        '千聊奖学金到账******',
        '红包抢的好，听课没烦恼',
        '悄悄告诉你，新人抢的奖学金最多！'
    ],
    randomChoose: function () {
        let length = this.letters.length;
        let random = Math.floor(Math.random()* length );
        if (random > length - 1) {
            random = length - 1
        }
        return this.letters[random]
    }
} 