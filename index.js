'use strict';
const googleapis = require('googleapis');
const prependHttp = require('prepend-http');
const pify = require('pify');
const output = require('./lib/output');

const pagespeed = pify(googleapis.google.pagespeedonline('v4').pagespeedapi);

function handleOpts(url, opts) {
  opts = Object.assign({strategy: 'mobile'}, opts);
  opts.nokey = opts.key === undefined;
  opts.url = prependHttp(url);
  return opts;
}

const psi = (url, opts) => Promise.resolve().then(() => {
  if (!url) {
    throw new Error('URL required');
  }

  return pagespeed.runpagespeed(handleOpts(url, opts));
});

module.exports = psi;

module.exports.output = (url, opts) => psi(url, opts).then(data => output(handleOpts(url, opts), data.data));
