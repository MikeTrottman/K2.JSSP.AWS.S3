metadata={systemName:"AWS-S3-Bucket",displayName:"AWS S3 Bucket",description:"Connect to your Amazon Web Services S3 Bucket.",configuration:{AWSRegion:{displayName:"AWS Region",type:"string",required:!0},AWSBucketName:{displayName:"AWS Bucket Name",type:"string",required:!0},AWSAccessKey:{displayName:"AWS IAM User Access Key",type:"string",required:!0},AWSSecretKey:{displayName:"AWS IAM User Secret Key",type:"string",required:!0}}},ondescribe=async function({configuration:e}){postSchema({objects:{bucket:{displayName:"Bucket",description:"Get S3 Bucket Contents",properties:{key:{displayName:"Key",type:"string"},lastModified:{displayName:"Last Modified",type:"dateTime"},eTag:{displayName:"Etag",type:"string"},size:{displayName:"Size",type:"number"},storageClass:{displayName:"Storage Class",type:"number"}},methods:{getList:{displayName:"Get List of Bucket Contents",type:"list",inputs:["prefix","max-keys","start-after"],outputs:["key","lastModified","eTag","size","storageClass"]}}},file:{displayName:"File",description:"Manages Files on AWS S3",properties:{fileName:{displayName:"File Name",type:"string"},size:{displayName:"File Size",type:"string"},contentType:{displayName:"Content Type",type:"string"},content:{displayName:"File Content",type:"attachment"}},methods:{getFile:{displayName:"Get File",type:"read",inputs:["fileName"],requiredInputs:["fileName"],outputs:["fileName","size","contentType","content"]}}}}})},onexecute=async function({objectName:e,methodName:t,parameters:a,properties:s,configuration:r}){try{switch(e){case"bucket":await async function(e,t,a,s){try{switch(e){case"getList":await function(e,t,a){return new Promise((e,t)=>{try{var s=new XMLHttpRequest;s.withCredentials=!0,console.log("After xhr request is created")}catch(e){console.log("Stacktrace: "+e.stack)}s.onreadystatechange=function(){try{if(4!==s.readyState)return;if(200!==s.status)throw new Error("Failed with status "+s.status);var a=JSON.parse(s.responseText);postResult(a.map(e=>({key:e.key,lastModified:e.lastModified,etag:e.etag,size:e.size,storageClass:e.storageClass}))),e()}catch(e){t(e)}};var r,n=function(e){for(var t=[":","-"],a=0;a<t.length;a++)for(;-1!=e.indexOf(t[a]);)e=e.replace(t[a],"");return e=e.split(".")[0]+"Z"}((new Date).toISOString()),i=n.split("T")[0];s.open("GET","https://"+a.AWSBucketName+".s3."+a.AWSRegion+".amazonaws.com?list-type=2&max-keys=50&prefix=Image&start-after=1"),s.setRequestHeader("host",a.AWSBucketName+".s3.amazonaws.com"),s.setRequestHeader("X-Amz-Content-Sha256",(r="",require("crypto-js").SHA256(r).toString(r))),s.setRequestHeader("X-Amz-Date",n),s.setRequestHeader("Authorization","AWS4-HMAC-SHA256 Credential="+a.AWSAccessKey+"/"+i+"/"+a.AWSRegion+"/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature="+function(e,t){var a=require("crypto-js"),s=a.HmacSHA256(t,"AWS4"+e.AWSSecretKey),r=a.HmacSHA256(e.AWSRegion,s),n=a.HmacSHA256("s3",r);return a.HmacSHA256("aws4_request",n)}(a,dateString)),s.send()})}(0,0,s);break;default:throw new Error("The method "+e+" is not supported.")}}catch(e){throw new Error("Stacktrace: "+e.stack)}}(t,0,0,r);break;case"file":await async function(e,t,a){try{switch(e){case"getFile":await function(e,t){return new Promise((e,a)=>{console.log("===htk in onexecuteGetFile");var s=new XMLHttpRequest;s.onreadystatechange=function(){try{if(4!==s.readyState)return;if(200!==s.status)throw new Error("Failed with status "+s.status);console.log("=== hdr "+s.getResponseHeader("Content-Type")),console.log("=== len "+s.getResponseHeader("Content-Length")),console.log("===  file "+s.response),postResult({fileName:t.fileName,size:s.getResponseHeader("Content-Length"),contentType:s.getResponseHeader("Content-Type"),content:s.response}),e()}catch(e){a(e)}},console.log("=== fn "+t.fileName),s.open("GET","https://k2-public-bucket.s3.us-west-2.amazonaws.com/Images/IDontThinkThatMemes.jpg"),s.responseType="blob",s.send()})}(0,t);break;default:throw new Error("The method "+e+" is not supported.")}}catch(e){throw new Error("Stacktrace: "+e.stack)}}(t,s);break;default:throw new Error("The object "+e+" is not supported.")}}catch(e){throw new Error("Stacktrace: "+e.stack)}};
//# sourceMappingURL=index.js.map
