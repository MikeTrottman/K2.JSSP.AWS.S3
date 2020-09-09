'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var test = _interopDefault(require('ava'));
require('@k2oss/k2-broker-core/test-framework');
require('./index');

function mock(name, value) {
  global[name] = value;
}

test('gets list of documents', async t => {

  function pr(r) {
  }

  mock('postResult', pr);
  mock('XMLHttpRequest', XHR);
  await Promise.resolve(onexecute({
    objectName: 'bucket',
    methodName: 'getList',
    properties: {
      "key": '',
      "lastModified": '',
      "eTag": '',
      "size": '',
      "storageClass": ''
    },
    parameters: {},
    schema: {},
    configuration: {
      AWSRegion: "us-west-2",
      AWSBucketName: 'k2-jssp-bucket',
      AWSAccessKey: 'AKIATUIIRTY6YUP4K37S',
      AWSSecretKey: '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'
    }
  }));
});

class XHR {
  constructor(xhr) {
    xhr = this.recorder = {};
    this.recorder.headers = {};
    console.log('Starting XHR Test');
  }

  open(method, url) {
    this.recorder.opened = {
      method,
      url
    };
  }

  setRequestHeader(key, value) {
    this.recorder.headers[key] = value;
  }

  async send(payload) {
    const request = require('request');

    const options = {
      method: this.recorder.opened.method,
      url: this.recorder.opened.url,
      headers: this.recorder.headers,
      body: payload
    };
    let promise = new Promise((resolve, reject) => {
      try {
        request(options, (error, res, body) => {
          if (error) {
            console.error("error inside request:" + error);
            return;
          }

          this.responseText = body;
          this.readyState = 4;
          this.status = 200;
          this.onreadystatechange();
          resolve();
          delete this.responseText;
        });
      } catch (err) {
        console.log("error outside request" + err);
        reject();
      }
    }).catch(err => {
      console.log("Promise Error:" + err);
    });
  }

}
//# sourceMappingURL=test.js.map
