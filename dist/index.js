metadata={systemName:"AWS-S3-Bucket",displayName:"AWS S3 Bucket",description:"Connect to your Amazon Web Services S3 Bucket.",configuration:{AWSRegion:{displayName:"AWS Region",type:"string",required:!0},AWSBucketName:{displayName:"AWS Bucket Name",type:"string",required:!0},AWSAccessKey:{displayName:"AWS IAM User Access Key",type:"string",required:!0},AWSSecretKey:{displayName:"AWS IAM User Secret Key",type:"string",required:!0}}},ondescribe=async function({configuration:e}){postSchema({objects:{bucket:{displayName:"Bucket",description:"Get S3 Bucket Contents",properties:{key:{displayName:"Key",type:"string"},lastModified:{displayName:"Last Modified",type:"dateTime"},eTag:{displayName:"Etag",type:"string"},size:{displayName:"Size",type:"number"},storageClass:{displayName:"Storage Class",type:"number"}},methods:{getList:{displayName:"Get List of Bucket Contents",type:"list",inputs:["prefix","max-keys","start-after"],outputs:["key","lastModified","eTag","size","storageClass"]}}},file:{displayName:"File",description:"Manages Files on AWS S3",properties:{fileName:{displayName:"File Name",type:"string"},size:{displayName:"File Size",type:"string"},contentType:{displayName:"Content Type",type:"string"},content:{displayName:"File Content",type:"attachment"}},methods:{getFile:{displayName:"Get File",type:"read",inputs:["fileName"],requiredInputs:["fileName"],outputs:["fileName","size","contentType","content"]}}}}})},onexecute=async function({objectName:e,methodName:t,parameters:s,properties:a,configuration:i}){switch(e){case"bucket":await async function(e,t,s,a){switch(e){case"getList":await new Promise((e,t)=>{var s=new XMLHttpRequest;console.log("After xhr request is created"),s.onreadystatechange=function(){try{if(4!==s.readyState)return;if(200!==s.status)throw new Error("Failed with status "+s.status);var a=JSON.parse(s.responseText);postResult(a.map(e=>({key:e.key,lastModified:e.lastModified,etag:e.etag,size:e.size,storageClass:e.storageClass}))),e()}catch(e){t(e)}},s.open("GET","https://k2-jssp-bucket.s3.us-west-2.amazonaws.com?list-type=2&max-keys=50&prefix=Image&start-after=1"),s.send()});break;default:throw new Error("The method "+e+" is not supported.")}}(t);break;case"file":await async function(e,t,s){switch(e){case"getFile":await function(e,t){return new Promise((e,s)=>{console.log("===htk in onexecuteGetFile");var a=new XMLHttpRequest;a.onreadystatechange=function(){try{if(4!==a.readyState)return;if(200!==a.status)throw new Error("Failed with status "+a.status);console.log("=== hdr "+a.getResponseHeader("Content-Type")),console.log("=== len "+a.getResponseHeader("Content-Length")),console.log("===  file "+a.response),postResult({fileName:t.fileName,size:a.getResponseHeader("Content-Length"),contentType:a.getResponseHeader("Content-Type"),content:a.response}),e()}catch(e){s(e)}},console.log("=== fn "+t.fileName),a.open("GET","https://k2-jssp-bucket.s3.us-west-2.amazonaws.com/Images/IDontThinkThatMemes.jpg"),a.responseType="blob",a.send()})}(0,t);break;default:throw new Error("The method "+e+" is not supported.")}}(t,a);break;default:throw new Error("The object "+e+" is not supported.")}};
//# sourceMappingURL=index.js.map
