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
            }
        }
    }
    )
};

onexecute = async function ({objectName, methodName, parameters, properties, configuration}): Promise<void> {
    switch (objectName) {
        case "posts": await onexecutePosts(methodName, parameters, properties, configuration); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecutePosts(methodName: string, parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    switch (methodName) {
        case "getList": await onexecutePostsGetList(parameters, properties, configuration); break;
        case "getById": await onexecutePostsGetById(parameters, properties, configuration); break;
        case "getByUserId": await onexecutePostsGetByUserId(parameters, properties, configuration); break;
        case "create": await onexecutePostsCreate(parameters, properties, configuration); break;
        case "update": await onexecutePostsUpdate(parameters, properties, configuration); break;
        case "delete": await onexecutePostsDelete(parameters, properties, configuration); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecutePostsGetList(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    console.log("urlValue | AWSBucketName: " + metadata.configuration.AWSBucketName + 'AWSRegion: ' + metadata.configuration.AWSBucketName);
    return new Promise<void>((resolve, reject) => {
        try{
        var urlValue = 'https://' + metadata.configuration.AWSBucketName + '.s3.' + metadata.configuration.AWSRegion + '.amazonaws.com?list-type=2';
        }
        catch (e) {
            throw new Error("Error on the urlValue | AWSBucketName: " + metadata.configuration.AWSBucketName + 'AWSRegion: ' + metadata.configuration.AWSBucketName);
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                //console.log(xhr.responseText);
                var obj = JSON.parse(xhr.responseText);
                postResult(obj.map(x => {
                    return {
                        "key": x.key,
                        "lastModified": x.lastModified,
                        "etag": x.etag,
                        "size": x.size,
                        "storageClass": x.storageClass
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

function onexecutePostsGetById(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = configuration["ServiceURL"] + 'posts/';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                postResult({
                    "id": obj.id,
                    "userId": obj.userId,
                    "title": obj.title,
                    "body": obj.body
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        }

        if(typeof properties["id"] !== "number") throw new Error("properties[\"id\"] is not of type number");

        xhr.open("GET", urlValue + encodeURIComponent(properties["id"]));
        xhr.send();
    });
}

function onexecutePostsGetByUserId(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = configuration["ServiceURL"] + 'posts?userId=';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                postResult(obj.map(x => {
                    return {
                        "id": x.id,
                        "userId": x.userId,
                        "title": x.title,
                        "body": x.body
                    }
                }));
                resolve();
            } catch (e) {
                reject(e);
            }

        }

        if(typeof properties["userId"] !== "number") throw new Error("properties[\"userId\"] is not of type number");
        xhr.open("GET", urlValue + encodeURIComponent(properties["userId"]));
        xhr.send();
    });
}


function onexecutePostsCreate(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = configuration["ServiceURL"] + 'posts/';
        var data = JSON.stringify({
            "userId": properties["userId"],
            "title": properties["title"],
            "body": properties["body"]
        });

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                // look for 'created' code
                if (xhr.status !== 201) throw new Error("Failed with status " + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                postResult({
                    "id": obj.id,
                    "userId": obj.userId,
                    "title": obj.title,
                    "body": obj.body
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        xhr.open("POST", urlValue);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    });
}

function onexecutePostsUpdate(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = configuration["ServiceURL"] + 'posts/';
        var data = JSON.stringify({
            "userId": properties["userId"],
            "title": properties["title"],
            "body": properties["body"]
        });

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                var obj = JSON.parse(xhr.responseText);
                postResult({
                    "id": obj.id,
                    "userId": obj.userId,
                    "title": obj.title,
                    "body": obj.body
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        }

        if(typeof properties["id"] !== "number") throw new Error("properties[\"id\"] is not of type number");
        xhr.open("PUT", urlValue + encodeURIComponent(properties["id"]));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    });
}

function onexecutePostsDelete(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = configuration["ServiceURL"];
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);
                resolve();
            } catch (e) {
                reject(e);
            }
        }

        if(typeof properties["id"] !== "number") throw new Error("properties[\"id\"] is not of type number");
        xhr.open("DELETE", urlValue + 'posts/' + encodeURIComponent(properties["id"]));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
}
