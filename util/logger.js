const log4js = require('log4js')

log4js.configure({
	appenders: { everything: { type: 'file', filename: 'logs/deploy-all.log', maxLogSize: 1024, backups: 3 } },
	categories: { default: { appenders: ['everything'], level: 'info' } }
});

let log = log4js.getLogger();

module.exports = log