const format = function format(text) {
  return function() {
    let str = text.toString();
    if (arguments.length) {
      const t = typeof arguments[0];
      let key;
      const args = ("string" === t || "number" === t) ?
        Array.prototype.slice.call(arguments) :
        arguments[0];

      for (key in args) {
        let repVal;
        if (args[key] === undefined || args[key] === null || args[key] === '') {
          repVal = 'NULL';
        } else {
          repVal = typeof args[key] === "object" ? 
                  `'${JSON.stringify(args[key])}'` :
                  `'${args[key]}'`;
        }
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), repVal);
      }
    }
    return str;
    };
  }

module.exports = { format };
