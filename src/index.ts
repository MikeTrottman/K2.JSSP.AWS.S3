import '@k2oss/k2-broker-core';

metadata = {
    systemName: "com.k2.s3sample",
    displayName: "Example AWS S3 Broker",
    description: "An example broker that accesses AWS S3 Storage."
};

ondescribe = async function(): Promise<void> {
    postSchema({
        objects: {
            "File": {
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
                    "Get": {
                        displayName: "Get File",
                        type: "read",
                        inputs: [ "fileName" ],
                        requiredInputs: ["fileName"],
                        outputs: [ "fileName", "size", "contentType", "content" ]
                    }
                }
            }
        }
    });
}

onexecute = async function(objectName, methodName, parameters, properties): Promise<void> {
    switch (objectName)
    {
        case "File": await onexecuteFile(methodName, properties, parameters); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteFile(methodName: string, properties: SingleRecord, parameters: SingleRecord): Promise<void> {
    switch (methodName)
    {
        case "Get": await onexecuteGetFile(parameters, properties); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecuteGetFile(parameters: SingleRecord, properties: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        console.log('===htk in onexecuteGetFile');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            try {
                //console.log('=== htk readyState '+ xhr.readyState);
                //console.log('=== htk status '+ xhr.status);

                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                console.log('=== hdr '+xhr.getResponseHeader('Content-Type'));
                console.log('=== len '+xhr.getResponseHeader('Content-Length'));
                console.log('===  file '+ xhr.response);

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

        //xhr.setRequestHeader('test', 'test value');
        console.log("=== fn "+properties["fileName"]);
        xhr.open("GET", 'https://rag0scnz17.execute-api.us-east-1.amazonaws.com/test/files/'+properties['fileName']);
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