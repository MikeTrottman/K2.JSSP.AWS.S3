import '@k2oss/k2-broker-core';

// NOTE: Currently (September 10th, 2020), K2 Nexus does not allow you to add dependencies to package.json.
// This means we can't use npm aws-sdk. This also means we can't do this with the exampled xhr based method
// since we would need to import crypto-js to generate the signature. Below is what I think is the closest thing
// to a working example using xhr, however the restulting query comes back with an "Access Denied" response regardless
// of the CORS or permissions settings in the S3 Bucket. As long as the bucket is not publicly accessable, then
// we cannot access AWS S3 resources as of yet. I'm leaving this where if we have an update to K2 JSSP in the future
// we can pick up with the code from there.
// TLDR: This don't work, maybe try again later.

metadata = {
    "systemName": "AWS-S3-Bucket",
    "displayName": "AWS S3 Bucket",
    "description": "Connect to your Amazon Web Services S3 Bucket.",
    "configuration": {
        "AWSRegion": {
            displayName: "AWS Region",
            type: "string",
            required: true
        },
        "AWSBucketName": {
            displayName: "AWS Bucket Name",
            type: "string",
            required: true
        },
        "AWSAccessKey": {
            displayName: "AWS IAM User Access Key",
            type: "string",
            required: true
        },
        "AWSSecretKey": {
            displayName: "AWS IAM User Secret Key",
            type: "string",
            required: true
        }
    }
};

ondescribe = async function ({configuration}): Promise<void> {
    postSchema({
        objects: {
            "bucket": {
                displayName: "Bucket",
                description: "Get S3 Bucket Contents",
                properties: {
                    "key": {
                        displayName: "Key",
                        type: "string",
                    },
                    "lastModified": {
                        displayName: "Last Modified",
                        type: "dateTime"
                    },
                    "eTag": {
                        displayName: "Etag",
                        type: "string"
                    },
                    "size": {
                        displayName: "Size",
                        type: "number"
                    },
                    "storageClass": {
                        displayName: "Storage Class",
                        type: "number"
                    }
                },
                methods: {
                    "getList": {
                        displayName: "Get List of Bucket Contents",
                        type: "list",
                        inputs: ["prefix", "max-keys", "start-after"],
                        outputs: ["key", "lastModified", "eTag", "size", "storageClass"]
                    }
                }
            },
            "file": {
                displayName: "File",
                description: "Manages Files on AWS S3",
                properties: {
                    "fileName": {
                        displayName: "File Name",
                        type: "string"
                    },
                    "size": {
                        displayName: "File Size",
                        type: "string"
                    },
                    "contentType": {
                        displayName: "Content Type",
                        type: "string"
                    },
                    "content": {
                        displayName: "File Content",
                        type: "attachment"
                    }
                },
                methods: {
                    "getFile": {
                        displayName: "Get File",
                        type: "read",
                        inputs: [ "fileName" ],
                        requiredInputs: ["fileName"],
                        outputs: [ "fileName", "size", "contentType", "content" ]
                    }
                }
            }
        }
    }
    )
};

onexecute = async function ({objectName, methodName, parameters, properties, configuration}): Promise<void> {
    try{
        switch (objectName) {
            case "bucket": await onexecuteBucket(methodName, parameters, properties, configuration); break;
            case "file": await onexecuteFile(methodName, properties, parameters, configuration); break;
            default: throw new Error("The object " + objectName + " is not supported.");
        }
    }
    catch (e){
        throw new Error("Stacktrace: " + e.stack);
    }
}

async function onexecuteBucket(methodName: string, parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    try{
        switch (methodName) {
            case "getList": await onexecuteBucketGetList(parameters, properties, configuration); break;
            default: throw new Error("The method " + methodName + " is not supported.");
        }
    }
    catch (e){
        throw new Error("Stacktrace: " + e.stack);
    }
}

async function onexecuteFile(methodName: string, properties: SingleRecord, parameters: SingleRecord, configuration: SingleRecord): Promise<void> {
    try{
        switch (methodName)
        {
            case "getFile": await onexecuteGetFile(parameters, properties, configuration); break;
            default: throw new Error("The method " + methodName + " is not supported.");
        }
    }
    catch (e){
        throw new Error("Stacktrace: " + e.stack);
    }
}

function onexecuteBucketGetList(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord) {
    return new Promise<void>((resolve, reject) => {
        try{
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
        }
        catch (e){
            console.log("Stacktrace: " + e.stack);
        }

        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                postResult(obj.map(x => {
                    return {
                        "key": x.ListBucketResult.Contents.Key,
                        "lastModified": x.ListBucketResult.Contents.LastModified,
                        "etag": x.ListBucketResult.Contents.Etag,
                        "size": x.ListBucketResult.Contents.Size,
                        "storageClass": x.ListBucketResult.Contents.StorageClass
                    }
                }));
                resolve();
            } catch (e) {
                reject(e);
            }
        }

        var amzDate = getAmzDate(new Date().toISOString());
        var authDate = amzDate.split("T")[0];

        xhr.open("GET", 'https://' + configuration["AWSBucketName"] + '.s3.' + configuration["AWSRegion"] + '.amazonaws.com?list-type=2&max-keys=50&prefix=Images&start-after=1');
        
        //Apply these headers to the request. Note that these headers will be different then what you may see in Postman. Those results are likely using aws-sdk.
        xhr.setRequestHeader("host", configuration["AWSBucketName"] + ".s3.amazonaws.com");
        xhr.setRequestHeader("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
        xhr.setRequestHeader("X-Amz-Date", amzDate);
        xhr.setRequestHeader("X-Amz-Credential", configuration['AWSAccessKey'] + "/" + authDate + "/s3/" + configuration["AWSRegion"]);
        xhr.setRequestHeader("X-Amz-Signature", getSignatureKey(configuration, authDate));
        xhr.setRequestHeader("X-Amz-Content-Sha256", getPayload(''));

        xhr.send();
    }); 
}

//Get the date in the format Amazon requests
function getAmzDate(dateStr) {
    var chars = [":","-"];
    for (var i=0;i<chars.length;i++) {
        while (dateStr.indexOf(chars[i]) != -1) {
            dateStr = dateStr.replace(chars[i],"");
        }
    }
    dateStr = dateStr.split(".")[0] + "Z";
    console.log('dateStr: ' + dateStr);
    return dateStr;
}

//Encrypt the Payload for the request
function getPayload(payload) {
    var crypto = require("crypto-js");

    return crypto.SHA256(payload).toString(payload);
}

//Sign the key according to Amazon's documentation
function getSignatureKey(configuration, dateString) {
    
    var crypto = require("crypto-js");

    var kDate = crypto.HmacSHA256(dateString, "AWS4" + configuration["AWSSecretKey"]);
    var kRegion = crypto.HmacSHA256(configuration["AWSRegion"], kDate);
    var kService = crypto.HmacSHA256('s3', kRegion);
    var kSigning = crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}

function onexecuteGetFile(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            try {

                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                postResult({
                    "fileName": properties["fileName"],
                    "size": xhr.getResponseHeader('Content-Length'),
                    "contentType": xhr.getResponseHeader('Content-Type'),
                    "content": xhr.response
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        };

        xhr.open("GET", 'https://' + configuration["AWSBucketName"] + '.s3.' + configuration["AWSRegion"] + '.amazonaws.com');
        xhr.responseType = 'blob';

        xhr.send();
    });
}

function onexecuteTodoGetWithParams(parameters: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        try {
            postResult({
                "id": parameters["pid"]
            });
            resolve();
        } catch (e) {
            reject(e);
        }
        
    });
}