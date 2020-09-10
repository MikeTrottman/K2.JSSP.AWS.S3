import '@k2oss/k2-broker-core';

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
            case "file": await onexecuteFile(methodName, properties, parameters); break;
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

async function onexecuteFile(methodName: string, properties: SingleRecord, parameters: SingleRecord): Promise<void> {
    try{
        switch (methodName)
        {
            case "getFile": await onexecuteGetFile(parameters, properties); break;
            default: throw new Error("The method " + methodName + " is not supported.");
        }
    }
    catch (e){
        throw new Error("Stacktrace: " + e.stack);
    }
}

async function onexecuteBucketGetList(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord) {

    try{
        var bucketItemsList = await getBucketListItems(configuration);

        console.log('BucketItemsList: ', bucketItemsList);

        var obj:any = bucketItemsList;
        var result = postResult({
            'Key': obj.Key,
            'LastModified': obj.LastModified,
            'ETag': obj.ETag,
            'Size': obj.Size,
            'StorageClass': obj.StorageClass,
        });
        console.log('BucketItemsList: ', bucketItemsList);

    }
    catch (e) {
        console.log('Error: ', e);
    }
    
    return result;
    
}

async function getBucketListItems(configuration): Promise<void> {
    try {
        var aws = require('aws-sdk');
        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId: configuration['AWSAccessKey'],
            secretAccessKey: configuration["AWSSecretKey"],
            region: configuration["AWSRegion"]
        });

        var s3 = new aws.S3();

        var bucketItems = await s3.listObjectsV2({
            Bucket: configuration['AWSBucketName']
        }).promise();

        console.log('BucketItems: ', bucketItems);
    } catch (e) {
        console.log('Error getBucketListItems: ', e);
    }
    return bucketItems.Contents;
}


function onexecuteGetFile(parameters: SingleRecord, properties: SingleRecord): Promise<void> {
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
        
        xhr.open("GET", 'https://k2-public-bucket.s3.us-west-2.amazonaws.com/Images/IDontThinkThatMemes.jpg');
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