/**
 * @todo log file and line no.
 */

require('pretty-error').start();
import { console } from "global";
import _ from 'lodash';

let pkgName = 'english-adventures'; // @todo make dynamic

export const separator = ':';
export const prefix = [pkgName, process.browser ? 'browser' : 'server'].join(separator);

/*======================================================
=            Minilog Formatting & Filtering            =
======================================================*/

var Minilog = require('minilog');

Minilog.enable();

if(process.browser) {
	// Minilog(prefix).warn(Minilog);

	// Minilog.pipe(Minilog.backends.console.formatWithStack)
	//        .pipe(Minilog.backends.console);

	// Minilog.suggest.clear().deny(/.*/, 'warn');
}

/*=====  End of Minilog Formatting & Filtering  ======*/

module.exports = function(...args) {
	let namespace = (args[0] && typeof args[0] === 'string') ? args[0] : '';
	namespace = namespace.replace(new RegExp(`${prefix}${separator}*`, 'g'), '');
	namespace = prefix + (namespace && (separator + namespace));
	args[0] = namespace;

	let logger = Minilog(...args);

	function logLevelGroup(name, level, ...args) {
		if(this.suggest.test(name, level)) {
			console.group.apply(console, args);
		}
	}

	for(let level of ['debug', 'log', 'info', 'warn', 'error']) {
		_.set(logger, [level, 'group'], logLevelGroup.bind(logger, namespace, level));
	}

	logger.debug.group = logLevelGroup.bind(logger, namespace, 'debug');
	logger.log.group = logLevelGroup.bind(logger, namespace, 'log');
	logger.info.group = logLevelGroup.bind(logger, namespace, 'info');
	logger.warn.group = logLevelGroup.bind(logger, namespace, 'warn');
	logger.error.group = logLevelGroup.bind(logger, namespace, 'error');

	_.mixin(logger, {
		enable: Minilog.enable,
		disable: Minilog.disable,

		group: logLevelGroup.bind(logger, namespace, 'debug'),
		groupEnd: console.groupEnd,
	});

	return logger;
};
