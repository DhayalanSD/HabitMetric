function getLocalDate(date = new Date()) {

  return date.toLocaleDateString("en-CA");

}

module.exports = getLocalDate;