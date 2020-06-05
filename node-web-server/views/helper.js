const hbs = require("hbs");
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});
hbs.registerHelper("uppercase", text => {
  return text.toUpperCase();
});
