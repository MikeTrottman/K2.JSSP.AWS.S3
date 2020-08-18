import '@k2oss/k2-broker-core';

metadata = {
    "systemName": "JSONPlaceholder",
    "displayName": "JSONPlaceholder Broker",
    "description": "Sample broker for JSONPlaceholder",
    "configuration": {
        "ServiceURL": {
            displayName: "JSONPlaceholder Service URL",
            type: "string",
            value: "https://jsonplaceholder.typicode.com/"
        }
    }
};

ondescribe = async function ({configuration}): Promise<void> {
    postSchema({
        objects: {
            "posts": {
                displayName: "Posts",
                description: "Manages Posts",
                properties: {
                    "id": {
                        displayName: "ID",
                        type: "number"
                    },
                    "userId": {
                        displayName: "User ID",
                        type: "number"
                    },
                    "title": {
                        displayName: "Title",
                        type: "string"
                    },
                    "body": {
                        displayName: "Body",
                        type: "string"
                    }
                },
                methods: {
                    "getList": {
                        displayName: "Get Posts List",
                        type: "list",
                        outputs: ["id", "userId", "title", "body"]
                    },
                    "getById": {
                        displayName: "Get Post By ID",
                        type: "read",
                        inputs: ["id"],
                        requiredInputs: ["id"],
                        outputs: ["id", "userId", "title", "body"]
                    },
                    "getByUserId": {
                        displayName: "Get Posts By User ID",
                        type: "list",
                        inputs: ["userId"],
                        requiredInputs: ["userId"],
                        outputs: ["id", "userId", "title", "body"]
                    },
                    "create": {
                        displayName: "Create Post",
                        type: "create",
                        inputs: ["userId", "title", "body"],
                        outputs: ["id", "userId", "title", "body"]
                    },
                    "update": {
                        displayName: "Update Post",
                        type: "update",
                        inputs: ["id", "userId", "title", "body"],
                        requiredInputs: ["id"],
                        outputs: ["id", "userId", "title", "body"]
                    },
                    "delete": {
                        displayName: "Delete Post",
                        type: "delete",
                        inputs: ["id"],
                        requiredInputs: ["id"]
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
    return new Promise<void>((resolve, reject) => {
        var urlValue = configuration["ServiceURL"] + 'posts/';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                //console.log(xhr.responseText);
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
