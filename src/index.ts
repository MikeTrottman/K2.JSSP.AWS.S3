/*
 * AWS S3 integration for K2 using JSSP
 */

import '@k2oss/k2-broker-core';

metadata = {
    "systemName": "AWS-S3",
    "displayName": "AWS S3",
    "description": "Connect to your Amazon Web Services S3 Bucket.",
    "configuration": {
        "AWSRegion": {
            displayName: "AWS Region",
            type: "string",
            value: "ex: us-west-2",
            required: true
        },
        "AWSBucketName": {
            displayName: "AWS Bucket Name",
            type: "string",
            value: "s3-bucket-name",
            required: true
        },
        "AWSAccessKey": {
            displayName: "AWS IAM User Access Key",
            type: "string",
            value: "IAM User Access Key",
            required: true
        },
        "AWSSecretKey": {
            displayName: "AWS IAM User Secret Key",
            type: "string",
            value: "IAM User Secret Key",
            required: true
        }
    }
};

ondescribe = async function({configuration}): Promise<void> {
    postSchema({
        objects: {
            "AWSS3Bucket": {
                displayName: "AWS S3 Bucket",
                description: "Get S3 Bucket Content List of Objects",
                properties: {
                    "Key": {
                        displayName: "Key",
                        type: "string",
                    },
                    "LastModified": {
                        displayName: "Last Modified",
                        type: "dateTime"
                    },
                    "ETag": {
                        displayName: "Etag",
                        type: "string"
                    },
                    "Size": {
                        displayName: "Size",
                        type: "number"
                    },
                    "StorageClass": {
                        displayName: "Storage Class",
                        type: "number"
                    }
                },
                methods: {
                    "GetBucketContents": {
                        displayName: "Get Bucket Contents",
                        type: "list",
                        parameters: {
                            "prefix" : { displayName: "Prefix", description: "Directory Path", type: "string"},
                            "max-keys" : { displayName: "Max Keys", description: "Number of Records to List. The Take.", type: "number"},
                            "start-after" : { displayName: "Start After", description: "Key to Start After for Pagination. The Skip.", type: "string"}
                        },
                        inputs: ["prefix", "max-keys", "start-after"],
                        outputs: [ "key", "lastModified", "eTag", "size", "storageClass" ]
                    }
                }
            }
        }
    });
}

onexecute = async function({objectName, methodName, parameters, properties, configuration}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = 'https://' + metadata["configuration"]["AWSBucketName"] + '.s3.' + metadata["configuration"]["AWSRegion"] + '.amazonaws.com?list-type=2&max-keys='
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) {
                    var obj = JSON.parse(xhr.responseText);
                    throw new Error("Ready State Fail - Failed with status " + xhr.status + " | " + obj.code + ": " + obj.message + " | URL: " + urlValue);
                }
                
                if (xhr.status !== 200) {
                    var obj = JSON.parse(xhr.responseText);
                    throw new Error("Failed with status " + xhr.status + " | " + obj.code + ": " + obj.message + " | URL: " + urlValue);
                }

                //console.log(xhr.responseText);
                var obj = JSON.parse(xhr.responseText);
                postResult(obj.map(x => {
                    return {
                        "max-keys": <string> parameters["max-keys"],
                        "prefix": <string> parameters["prefix"],
                        "start-after": <string> parameters["start-after"],
                    }
                }));
                resolve();
            } catch (e) {
                reject(e);
            }
        }

        xhr.open("GET", urlValue);
        xhr.send();
    });
    // switch (objectName)
    // {
    //     case "AWSS3Bucket": await onexecuteBucket(methodName, properties, parameters, configuration); break;
    //     // case AWSS3File: await onexecuteFile(methodName, properties, parameters); break;
    //     default: throw new Error("The object " + objectName + " is not supported.");
    // }
}

async function onexecuteBucket(methodName: string, properties: SingleRecord, parameters: SingleRecord, configuration: SingleRecord): Promise<void> {
    switch (methodName)
    {
        case "GetBucketContents": await onexecuteGetBucketContents(parameters, properties, configuration); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecuteGetBucketContents(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = 'https://' + metadata["configuration"]["AWSBucketName"] + '.s3.' + metadata["configuration"]["AWSRegion"] + '.amazonaws.com?list-type=2&max-keys='
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) {
                    var obj = JSON.parse(xhr.responseText);
                    throw new Error("Ready State Fail - Failed with status " + xhr.status + " | " + obj.code + ": " + obj.message + " | URL: " + urlValue);
                }
                
                if (xhr.status !== 200) {
                    var obj = JSON.parse(xhr.responseText);
                    throw new Error("Failed with status " + xhr.status + " | " + obj.code + ": " + obj.message + " | URL: " + urlValue);
                }

                //console.log(xhr.responseText);
                var obj = JSON.parse(xhr.responseText);
                postResult(obj.map(x => {
                    return {
                        "max-keys": <string> parameters["max-keys"],
                        "prefix": <string> parameters["prefix"],
                        "start-after": <string> parameters["start-after"],
                    }
                }));
                resolve();
            } catch (e) {
                reject(e);
            }
        }

        xhr.open("GET", urlValue);
        xhr.send();
    });

}
