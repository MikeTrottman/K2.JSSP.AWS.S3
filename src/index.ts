import '@k2oss/k2-broker-core';

metadata = {
    systemName: "AWS-S3-Bucket",
    displayName: "AWS S3 Bucket",
    description: "Connect to your Amazon Web Services S3 Bucket.",
    configuration: {
        AWSRegion: {
            displayName: "AWS Region",
            type: "string",
            value: "us-west-2",
            required: true
        },
        AWSBucketName: {
            displayName: "AWS Bucket Name",
            type: "string",
            value: "s3-bucket-name",
            required: true
        },
        AWSAccessKey: {
            displayName: "AWS IAM User Access Key",
            type: "string",
            value: "IAM User Access Key",
            required: true
        },
        AWSSecretKey: {
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
            "AWS-S3-Bucket": {
                displayName: "AWS S3 Bucket Contents",
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
                    "getBucketContents": {
                        displayName: "Get Bucket Contents",
                        type: "list",
                        parameters: {
                            "prefix" : { displayName: "Prefix", description: "Directory Path", type: "string"},
                            "max-keys" : { displayName: "Max Keys", description: "Number of Records to List. The Take.", type: "number"},
                            "start-after" : { displayName: "Start After", description: "Key to Start After for Pagination. The Skip.", type: "string"}
                        },
                        outputs: [ "Key", "LastModified", "ETag", "Size", "StorageClass" ]
                    }
                }
            },
            "AWS-S3-File": {
                displayName: "AWS S3 Bucket Contents",
                description: "Get S3 Bucket Content List of Objects",
                properties: {
                    "Key": {
                        displayName: "Key",
                        type: "string",
                    }
                },
                methods: {
                    "create": {
                        displayName: "Persist a file to S3",
                        type: "read",
                        parameters: {
                            "Key" : { displayName: "Key", description: "File Path, Name and Extension", type: "string"} 
                        },
                        outputs: ["Key"]
                    },
                    "delete": {
                        displayName: "Remove a file from S3",
                        type: "delete",
                        parameters: {
                            "Key" : { displayName: "Key", description: "File Path, Name and Extension", type: "string"} 
                        },
                        outputs: ["Key"]
                    }
                }
            }
        }
    });
}

onexecute = async function({objectName, methodName, parameters, properties, configuration, schema}): Promise<void> {
    switch (objectName)
    {
        case "AWS-S3-Bucket": await onexecuteBucket(methodName, properties, parameters); break;
        case "AWS-S3-File": await onexecuteFile(methodName, properties, parameters); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteBucket(methodName: string, properties: SingleRecord, parameters: SingleRecord): Promise<void> {
    switch (methodName)
    {
        case "getBucketContents": await onexecuteGetBucketContents(properties, parameters); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

async function onexecuteFile(methodName: string, properties: SingleRecord, parameters: SingleRecord): Promise<void> {
    switch (methodName)
    {
        case "create": await onexecuteCreateFile(properties, parameters); break;
        case "delete": await onexecuteDeleteFile(properties, parameters); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecuteGetBucketContents(properties: SingleRecord, parameters): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                postResult({
                    "Key": obj.Key,
                    "LastModified": obj.LastModified,
                    "ETag": obj.ETag,
                    "Size": obj.Size,
                    "StorageClass": obj.StorageClass
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        };
        
        if(typeof properties["Key"] !== "string") throw new Error("properties[\"Key\"] is not of type string");
        xhr.open("GET", 'https://' + metadata.configuration.AWSBucketName + '.s3.' + metadata.configuration.AWSRegion + '.amazonaws.com?list-type=2&max-keys=' + encodeURIComponent(parameters['max-keys']) + '&prefix=' + encodeURIComponent(parameters['prefix']) + '&start-after=' + encodeURIComponent(parameters['start=after']) + encodeURIComponent(properties["Key"]));
        xhr.setRequestHeader('aws', 'aws s3 k2 jssp test');
        xhr.send();
    });
}

function onexecuteCreateFile(properties: SingleRecord, parameters): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            try {
                postResult({
                    "Key": parameters["Key"]
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        
        if(typeof properties["Key"] !== "string") throw new Error("properties[\"Key\"] is not of type string");
        xhr.open("POST", 'https://' + metadata.configuration.AWSBucketName + '.s3.' + metadata.configuration.AWSRegion + '.amazonaws.com?list-type=2&max-keys=' + encodeURIComponent(parameters['max-keys']) + '&prefix=' + encodeURIComponent(parameters['prefix']) + '&start-after=' + encodeURIComponent(parameters['start=after']) + encodeURIComponent(properties["Key"]));
        xhr.setRequestHeader('aws', 'aws s3 k2 jssp test');
        xhr.send();
    });
}

function onexecuteDeleteFile(properties: SingleRecord, parameters): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            try {
                postResult({
                    "Key": parameters["Key"]
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        
        if(typeof properties["Key"] !== "string") throw new Error("properties[\"Key\"] is not of type string");
        xhr.open("DELETE", 'https://' + metadata.configuration.AWSBucketName + '.s3.' + metadata.configuration.AWSRegion + '.amazonaws.com?list-type=2&max-keys=' + encodeURIComponent(parameters['max-keys']) + '&prefix=' + encodeURIComponent(parameters['prefix']) + '&start-after=' + encodeURIComponent(parameters['start=after']) + encodeURIComponent(properties["Key"]));
        xhr.setRequestHeader('aws', 'aws s3 k2 jssp test');
        xhr.send();
    });
}