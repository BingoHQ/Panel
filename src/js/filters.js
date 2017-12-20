Vue.filter('jalali', function (date, format) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss')
        .format(format);
});

Vue.filter('fromNow', function (date) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss')
        .fromNow();
});
Vue.filter('numberFormat', function (num) {
    if (typeof num == 'undefined') {
        return num;
    }
    // if(typeof num == 'undefined'){
    //     return 1916628;
    // }
    // return num.split('').reverse().join('');
    var sep = ',';
    var number = typeof num === "number" ? num.toString() : num;
    return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + sep);
    //return num;
});
Vue.filter('less', function (value, length = 20) {
    if (value.length < length) {
        return value;
    }
    let trimmedString = value.substr(0, length);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    return trimmedString + '...';
});

Vue.filter('ltrText', function (value) {
    return '\u200E' + value + '\u200F'
});
Vue.filter('month', function (value) {
    return value.substring(5);
});
Vue.filter('year', function (value) {
    return value.substring(2, 4);
});
Vue.filter('code', function (value) {
    let regex = /{کد}([\s\S]*?){\/کد}/g;
    return value.replace(regex, "<div class='code'>$1</div>");
});
Vue.filter('cardNumber', function (number) {
    // let text = number.replace(/[^\d]/g, "");
    let text = number;
    let result = [];
    while (text.length > 4) {
        result.push(text.substring(0, 4));
        text = text.substring(4);
    }
    result.push(text);
    return result.join("-");
});