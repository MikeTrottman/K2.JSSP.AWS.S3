metadata={systemName:"AWS-S3-Bucket",displayName:"AWS S3 Bucket",description:"Connect to your Amazon Web Services S3 Bucket.",configuration:{AWSRegion:{displayName:"AWS Region",type:"string",required:!0},AWSBucketName:{displayName:"AWS Bucket Name",type:"string",required:!0},AWSAccessKey:{displayName:"AWS IAM User Access Key",type:"string",required:!0},AWSSecretKey:{displayName:"AWS IAM User Secret Key",type:"string",required:!0}}},ondescribe=async function({configuration:e}){postSchema({objects:{bucket:{displayName:"Bucket",description:"Get S3 Bucket Contents",properties:{key:{displayName:"Key",type:"string"},lastModified:{displayName:"Last Modified",type:"dateTime"},eTag:{displayName:"Etag",type:"string"},size:{displayName:"Size",type:"number"},storageClass:{displayName:"Storage Class",type:"number"}},methods:{getList:{displayName:"Get List of Bucket Contents",type:"list",inputs:["prefix","max-keys","start-after"],outputs:["key","lastModified","eTag","size","storageClass"]}}}}})},onexecute=async function({objectName:e,methodName:t,parameters:s,properties:r,configuration:a}){switch(e){case"posts":await async function(e,t,s,r){switch(e){case"getList":await new Promise((e,t)=>{var s=new XMLHttpRequest;console.log("After xhr request is created"),s.onreadystatechange=function(){try{if(4!==s.readyState)return;if(200!==s.status)throw new Error("Failed with status "+s.status);var r=JSON.parse(s.responseText);postResult(r.map(e=>({key:e.key,lastModified:e.lastModified,etag:e.etag,size:e.size,storageClass:e.storageClass}))),e()}catch(e){t(e)}},s.open("GET","https://k2-jssp-bucket.s3.us-west-2.amazonaws.com?list-type=2&max-keys=50&prefix=Image&start-after=1"),s.send()});break;case"getById":await function(e,t,s){return new Promise((e,r)=>{var a=s.ServiceURL+"posts/",i=new XMLHttpRequest;if(i.onreadystatechange=function(){try{if(4!==i.readyState)return;if(200!==i.status)throw new Error("Failed with status "+i.status);var t=JSON.parse(i.responseText);postResult({id:t.id,userId:t.userId,title:t.title,body:t.body}),e()}catch(e){r(e)}},"number"!=typeof t.id)throw new Error('properties["id"] is not of type number');i.open("GET",a+encodeURIComponent(t.id)),i.send()})}(0,s,r);break;case"getByUserId":await function(e,t,s){return new Promise((e,r)=>{var a=s.ServiceURL+"posts?userId=",i=new XMLHttpRequest;if(i.onreadystatechange=function(){try{if(4!==i.readyState)return;if(200!==i.status)throw new Error("Failed with status "+i.status);var t=JSON.parse(i.responseText);postResult(t.map(e=>({id:e.id,userId:e.userId,title:e.title,body:e.body}))),e()}catch(e){r(e)}},"number"!=typeof t.userId)throw new Error('properties["userId"] is not of type number');i.open("GET",a+encodeURIComponent(t.userId)),i.send()})}(0,s,r);break;case"create":await function(e,t,s){return new Promise((e,r)=>{var a=s.ServiceURL+"posts/",i=JSON.stringify({userId:t.userId,title:t.title,body:t.body}),o=new XMLHttpRequest;o.onreadystatechange=function(){try{if(4!==o.readyState)return;if(201!==o.status)throw new Error("Failed with status "+o.status);var t=JSON.parse(o.responseText);postResult({id:t.id,userId:t.userId,title:t.title,body:t.body}),e()}catch(e){r(e)}},o.open("POST",a),o.setRequestHeader("Content-Type","application/json"),o.send(i)})}(0,s,r);break;case"update":await function(e,t,s){return new Promise((e,r)=>{var a=s.ServiceURL+"posts/",i=JSON.stringify({userId:t.userId,title:t.title,body:t.body}),o=new XMLHttpRequest;if(o.onreadystatechange=function(){try{if(4!==o.readyState)return;if(200!==o.status)throw new Error("Failed with status "+o.status);var t=JSON.parse(o.responseText);postResult({id:t.id,userId:t.userId,title:t.title,body:t.body}),e()}catch(e){r(e)}},"number"!=typeof t.id)throw new Error('properties["id"] is not of type number');o.open("PUT",a+encodeURIComponent(t.id)),o.setRequestHeader("Content-Type","application/json"),o.send(i)})}(0,s,r);break;case"delete":await function(e,t,s){return new Promise((e,r)=>{var a=s.ServiceURL,i=new XMLHttpRequest;if(i.onreadystatechange=function(){try{if(4!==i.readyState)return;if(200!==i.status)throw new Error("Failed with status "+i.status);e()}catch(e){r(e)}},"number"!=typeof t.id)throw new Error('properties["id"] is not of type number');i.open("DELETE",a+"posts/"+encodeURIComponent(t.id)),i.setRequestHeader("Content-Type","application/json"),i.send()})}(0,s,r);break;default:throw new Error("The method "+e+" is not supported.")}}(t,0,r,a);break;default:throw new Error("The object "+e+" is not supported.")}};
//# sourceMappingURL=index.js.map
