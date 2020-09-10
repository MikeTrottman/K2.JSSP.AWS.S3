import test from 'ava';
import '@k2oss/k2-broker-core/test-framework';
import './index';

function mock(name: string, value: any) {
    global[name] = value;
}

test('gets list of documents', async t => {

    let result: any = null;
    function pr(r: any) { result = r; }
    mock('postResult', pr!);

    mock('XMLHttpRequest', XHR);

    await Promise.resolve<void>(onexecute(
        {
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
                AWSRegion: "region",
                AWSBucketName: 'bucket',
                AWSAccessKey: 'accessKey',
                AWSSecretKey: 'secretKey'
            }
        }
    ))

    // t.deepEqual(result, {}) -fill this out when we know what the result will be.

})

class XHR {
    public onreadystatechange: () => void;
    public readyState: number;
    public status: number;
    public responseText: string;
    private recorder: { [key: string]: any };

    constructor(xhr) {
        xhr = this.recorder = {}; this.recorder.headers = {};
        console.log('Starting XHR Test');
    }
    open(method: string, url: string) { this.recorder.opened = { method, url }; }
    setRequestHeader(key: string, value: string) { this.recorder.headers[key] = value; }

    async send(payload) {
        const request = require('request')
        const options = { method: this.recorder.opened.method, url: this.recorder.opened.url, headers: this.recorder.headers, body: payload };
        let promise = new Promise((resolve, reject) => {
            try {
                request(options, (error, res, body) => {
                    if (error) { console.error("error inside request:" + error)
                    return } this.responseText = body;
                    this.readyState = 4; this.status = 200; this.onreadystatechange(); resolve()
                    delete this.responseText;
                });
            } catch (err) {
                console.log("error outside request" + err); reject()
            }
        }).catch((err) => { console.log("Promise Error:" + err); });
        // let v = await promise;
    }
}