/*
 * AWS S3 integration for K2 using JSSP
 * Special thanks to Kevinsee15 - https://github.com/kevinsee15 
 */

import '@k2oss/k2-broker-core';

const AWSS3Bucket = "AWSS3Bucket";

const Key = "Key";
const LastModified = "LastModified";
const ETag = "ETag";
const Size = "Size";
const StorageClass = "StorageClass";
const RequestStatus = "status";

const GetBucketContents = "GetBucketContents";

const AWSS3File = "AWSS3File";

const CreateFile = "CreateFile";

const DeleteFile = "DeleteFile";

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
            [AWSS3Bucket]: {
                displayName: "AWS S3 Bucket",
                description: "Get S3 Bucket Content List of Objects",
                properties: {
                    [Key]: {
                        displayName: "Key",
                        type: "string",
                    },
                    [LastModified]: {
                        displayName: "Last Modified",
                        type: "dateTime"
                    },
                    [ETag]: {
                        displayName: "Etag",
                        type: "string"
                    },
                    [Size]: {
                        displayName: "Size",
                        type: "number"
                    },
                    [StorageClass]: {
                        displayName: "Storage Class",
                        type: "number"
                    }
                },
                methods: {
                    [GetBucketContents]: {
                        displayName: "Get Bucket Contents",
                        type: "list",
                        parameters: {
                            "prefix" : { displayName: "Prefix", description: "Directory Path", type: "string"},
                            "max-keys" : { displayName: "Max Keys", description: "Number of Records to List. The Take.", type: "number"},
                            "start-after" : { displayName: "Start After", description: "Key to Start After for Pagination. The Skip.", type: "string"}
                        },
                        inputs: ["prefix", "max-keys", "start-after"],
                        outputs: [ "Key", "LastModified", "ETag", "Size", "StorageClass" ]
                    }
                }
            },
            [AWSS3File]: {
                displayName: "AWS S3 File",
                description: "Add or Delete AWS S3 Files",
                properties: {
                    "Key": {
                        displayName: "Key",
                        type: "string",
                    }
                },
                methods: {
                    [CreateFile]: {
                        displayName: "Persist a file to S3",
                        type: "execute",
                        parameters: {
                            "Key" : { displayName: "Key", description: "File Path, Name and Extension (Ex: ParentDirectory/Directory/DocumentName.ext)", type: "string"} 
                        },
                        inputs: ["Key", "File"],
                        requiredInputs: ["Key", "File"],
                        outputs: ["Key"]
                    },
                    [DeleteFile]: {
                        displayName: "Remove a file from S3",
                        type: "delete",
                        parameters: {
                            "Key" : { displayName: "Key", description: "File Path, Name and Extension (Ex: ParentDirectory/Directory/DocumentName.ext)", type: "string"} 
                        },
                        inputs: ["Key"],
                        requiredInputs: ["Key"],
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
        case AWSS3Bucket: await onexecuteBucket(methodName, properties, parameters); break;
        case AWSS3File: await onexecuteFile(methodName, properties, parameters); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteBucket(methodName: string, properties: SingleRecord, parameters: SingleRecord): Promise<void> {
    switch (methodName)
    {
        case GetBucketContents: await onexecuteGetBucketContents(properties, parameters); break;
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

function onexecuteGetBucketContents(properties: SingleRecord, parameters: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        var parameterData : {[key: string]: string} = {
            "max-keys": <string> parameters["max-keys"],
            "prefix": <string> parameters["prefix"],
            "start-after": <string> parameters["start-after"],
        };

        var propertyData : {[key: string]: string} = {
            "Key": <string> properties.Key,
            "LastModified": <string> properties.LastModified,
            "ETag": <string> properties.ETag,
            "Size": <string> properties.Size,
            "StorageClass": <string> properties.StorageClass
        };
        
        _executeXHRRequest(_buildURL(parameterData), propertyData, "GET", function(responseObj) {
            postResult({
                [RequestStatus]: responseObj["status"]
            });
            resolve();
        });
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

// Execute XHR Request Helper
function _executeXHRRequest(url: string, propertiesData: {[key: string]: string}, requestType: string, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4)
            return;
        if (xhr.status == 201 || xhr.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            if (typeof cb === 'function')
                cb(obj);
        }
        else if (xhr.status == 400 || xhr.status == 404) {
            var obj = JSON.parse(xhr.responseText);
            throw new Error(obj.code + ": " + obj.message + ". Data: " + propertiesData);
        }
        else {
            postResult({
            });
            var obj = JSON.parse(xhr.responseText);
            throw new Error(obj.code + ": " + obj.message + ". Data: " + propertiesData);
        }
    };
    
    var body = _encodeQueryData(propertiesData);

    xhr.open(requestType.toUpperCase(), url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.send(body);
}

// Encoding Query Data Helper
function _encodeQueryData(data: {[key: string]: string}) {
    const ret = [];
    for(let key in data){
        let value = data[key];
        ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    return ret.join('&');
}

// Build URL Helper
function _buildURL(data: {[key: string]: string}){

    let constructedURL = 'https://' + metadata.configuration.AWSBucketName + '.s3.' + metadata.configuration.AWSRegion + '.amazonaws.com?list-type=2&max-keys='

    for(let key in data){
        let value = data[key];
        constructedURL += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    return constructedURL;
}