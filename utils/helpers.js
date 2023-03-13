module.exports = { // Inputs the Month, Day, Year, and military time for the moment a review was posted
    format_date: date => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
  };