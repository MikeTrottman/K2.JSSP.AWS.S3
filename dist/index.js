metadata={systemName:"AWS-S3-Bucket",displayName:"AWS S3 Bucket",description:"Connect to your Amazon Web Services S3 Bucket.",configuration:{AWSRegion:{displayName:"AWS Region",type:"string",required:!0},AWSBucketName:{displayName:"AWS Bucket Name",type:"string",required:!0},AWSAccessKey:{displayName:"AWS IAM User Access Key",type:"string",required:!0},AWSSecretKey:{displayName:"AWS IAM User Secret Key",type:"string",required:!0}}},ondescribe=async function({configuration:e}){postSchema({objects:{bucket:{displayName:"Bucket",description:"Get S3 Bucket Contents",properties:{key:{displayName:"Key",type:"string"},lastModified:{displayName:"Last Modified",type:"dateTime"},eTag:{displayName:"Etag",type:"string"},size:{displayName:"Size",type:"number"},storageClass:{displayName:"Storage Class",type:"number"}},methods:{getList:{displayName:"Get List of Bucket Contents",type:"list",inputs:["prefix","max-keys","start-after"],outputs:["key","lastModified","eTag","size","storageClass"]}}},file:{displayName:"File",description:"Manages Files on AWS S3",properties:{fileName:{displayName:"File Name",type:"string"},size:{displayName:"File Size",type:"string"},contentType:{displayName:"Content Type",type:"string"},content:{displayName:"File Content",type:"attachment"}},methods:{getFile:{displayName:"Get File",type:"read",inputs:["fileName"],requiredInputs:["fileName"],outputs:["fileName","size","contentType","content"]}}}}})},onexecute=async function({objectName:e,methodName:t,parameters:s,properties:a,configuration:r}){try{switch(e){case"bucket":await async function(e,t,s,a){try{switch(e){case"getList":await function(e,t,s){return new Promise((e,t)=>{try{var a=new XMLHttpRequest;a.withCredentials=!0,console.log("After xhr request is created")}catch(e){console.log("Stacktrace: "+e.stack)}a.onreadystatechange=function(){try{if(4!==a.readyState)return;if(200!==a.status)throw new Error("Failed with status "+a.status);var s=JSON.parse(a.response);postResult(s),e()}catch(e){t(e)}};var r,n=function(e){for(var t=[":","-"],s=0;s<t.length;s++)for(;-1!=e.indexOf(t[s]);)e=e.replace(t[s],"");return e=e.split(".")[0]+"Z"}((new Date).toISOString()),o=n.split("T")[0];a.open("GET","https://"+s.AWSBucketName+".s3."+s.AWSRegion+".amazonaws.com?list-type=2&max-keys=50&prefix=Image&start-after=1"),a.setRequestHeader("host",s.AWSBucketName+".s3.amazonaws.com"),a.setRequestHeader("X-Amz-Content-Sha256",(r="",require("crypto-js").SHA256(r).toString(r))),a.setRequestHeader("X-Amz-Date",n),a.setRequestHeader("Authorization","AWS4-HMAC-SHA256 Credential="+s.AWSAccessKey+"/"+o+"/"+s.AWSRegion+"/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature="+function(e,t){var s=require("crypto-js"),a=s.HmacSHA256(t,"AWS4"+e.AWSSecretKey),r=s.HmacSHA256(e.AWSRegion,a),n=s.HmacSHA256("s3",r);return s.HmacSHA256("aws4_request",n)}(s,dateString)),a.responseType="json",a.send()})}(0,0,a);break;default:throw new Error("The method "+e+" is not supported.")}}catch(e){throw new Error("Stacktrace: "+e.stack)}}(t,0,0,r);break;case"file":await async function(e,t,s){try{switch(e){case"getFile":await function(e,t){return new Promise((e,s)=>{console.log("===htk in onexecuteGetFile");var a=new XMLHttpRequest;a.onreadystatechange=function(){try{if(4!==a.readyState)return;if(200!==a.status)throw new Error("Failed with status "+a.status);console.log("=== hdr "+a.getResponseHeader("Content-Type")),console.log("=== len "+a.getResponseHeader("Content-Length")),console.log("===  file "+a.response),postResult({fileName:t.fileName,size:a.getResponseHeader("Content-Length"),contentType:a.getResponseHeader("Content-Type"),content:a.response}),e()}catch(e){s(e)}},console.log("=== fn "+t.fileName),a.open("GET","https://k2-public-bucket.s3.us-west-2.amazonaws.com/Images/IDontThinkThatMemes.jpg"),a.responseType="blob",a.send()})}(0,t);break;default:throw new Error("The method "+e+" is not supported.")}}catch(e){throw new Error("Stacktrace: "+e.stack)}}(t,a);break;default:throw new Error("The object "+e+" is not supported.")}}catch(e){throw new Error("Stacktrace: "+e.stack)}};
//# sourceMappingURL=index.js.map
