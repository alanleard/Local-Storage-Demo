var win = Ti.UI.createWindow({backgroundColor:'#fff'});

//Start performance timer
var startTime=new Date();

//Log application Data Directory
Ti.API.info(Ti.Filesystem.applicationDataDirectory);

//Create Data Array
var dataArr=[];

//Create or open Data Store JSON file
var dataStore = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'data.json');

//Create Image Store Directory Path
var ImageStore = Ti.Filesystem.applicationDataDirectory + '/CachedImages';

//Check to see if ImageStore exisits, if not create it
var dir = Ti.Filesystem.getFile(ImageStore);
if (!dir.exists()) {
    dir.createDirectory();
}

//Function to parse data from JSON into the Data Array
function dataParse(data){
    var json = JSON.parse(data);
        
    if (!json) { 
        Titanium.API.info('Error - Null return!'); 
        return;
    }	
                
    for(var i=0; i<json.length; i++){
        dataArr.push({
            body:json[i].body, 
            title:json[i].title,
            image: json[i].image, 
            height: json[i].height, 
            width: json[i].width
        });
    }
}

var downloadTime = 0;

//Function to sync data from remote URL, includes seperate parameter variable, passes dats to be parsed after downloaded
function dataSync(URL){
    
    Ti.API.info('Data Store does not exist, downloading new data.');
    
    //Download new Data
    var downloadTimeStart = new Date();
        
    var xhr = Titanium.Network.createHTTPClient();

    xhr.onload = function(){
		
		downloadTime = (new Date() - downloadTimeStart)/1000;
		
		Ti.API.info('**Timer** Data download time: '+ downloadTime+' seconds.');
        
        dataParse(this.responseText);
        
        loadWindow();
            
        //Write data to local dataStore (Images are still stored as URLs)
        dataStore.write(this.responseText);

    };
    xhr.open('GET', URL);
    xhr.send();
}

//Function to cache remote images after they are displayed from remote URL
function cacheRemoteURL(image, imageURL) {
    if (imageURL) {
        var hashedSource = Ti.Utils.md5HexDigest(imageURL + '') + '.' + imageURL.split('.').pop();
        var localImage = Ti.Filesystem.getFile(ImageStore, hashedSource);
        if (localImage.exists()) {
            image.image = localImage.nativePath;
        }
        else {
            image.image = imageURL;
            image.addEventListener('load', function() {
                localImage.write(image.toImage());
            });
        }
    }
}
   
//Function to download images directly to filesystem
function getImage(params) {

	var request = Ti.Network.createHTTPClient();
	var url = params.url;
	var callback = params.callback;
	
	var hashedSource = Ti.Utils.md5HexDigest(url + '') + '.' + url.split('.').pop();
	var localImage = Ti.Filesystem.getFile(ImageStore, hashedSource); 
	  
	  request.onload = function() {
	    localImage.write(request.responseData);
	    callback(true);
	    
	    request = null;
	    url = null;
	    callback = null;
	  };
	  
	  request.onerror = function() {
	    callback(false);
	    
	    request = null;
	    url = null;
	    callback = null;
	  };
	  
	  request.open('GET', url);
	  request.send(null);
}
var imageQueue = [];
function downloadImage(status) {
  if (status==true) {
		imageQueue.shift();
  }
 else if(status == 'start') {
    for(var i=0; i<dataArr.length; i++){
			imageQueue.push(getImage({ url:dataArr[i].image, callback:downloadImage }));
 	}
 	imageQueue.shift();
  }
}

//Function to download new data in the background 
//***FIXES NEEDED: only one image gets stored and page refresh needs to be addressed
function dataDownload(URL){
    
    Ti.API.info('Downloading new data in the background.');
    
    //Download new Data
    xhr = Titanium.Network.createHTTPClient();

    xhr.onload = function(){
            
        //Write data to local dataStore (Images are still stored as URLs)
        dataStore.write(this.responseText);
        
        //Parse data into dataArr Array (data is now in memory, ready to be refreshed onto page)
        dataParse(dataStore.read());
       
        xhr = null;
       	downloadImage(status='start');

	}
    xhr.open('GET', URL);
    xhr.send();
}

//If statement to determine if the the data should be parsed locally or downloaded. 

function load(url, params){
	if(!dataStore.exists()){
		 dataSync(url+params);
	   //Download new data every 20 Mins
	 	setInterval(function(){
	    	dataDownload(url+params);
		}, 1200000);
	} else {
		dataParse(dataStore.read());
	   	loadWindow();
	  	//Immdiately download newest data
	  	dataDownload(url+params);
	  	//Download new data every 20 Mins
	  	setInterval(function(){
	    	dataDownload(url+params);
	   }, 1200000);
	}
}

//Debug event listener to show times and allow clearing the cache.  App will Exit on Suspend, so you can reopen to run again.
win.addEventListener('click',function(){
	var dialog = Titanium.UI.createAlertDialog({
    	title: 'Boot Time: \n'+ bootTime +' seconds.\n\nDownload Time: \n'+ downloadTime+' seconds.\n\nProccess Time: \n'+(bootTime - downloadTime)+' seconds.\n\nWhat would you like to do next?',
    	buttonNames: ['Clear Cache','Cancel']
	});
	dialog.show();
	dialog.addEventListener('click',function(e){
		if(e.index ==0){
			dir.deleteDirectory(true);
			dataStore.deleteFile();
		}
	});
});

/* ~~~~~~Design Notes~~~~~~~

If previous cached data exists:
	Open app and display any cached data
	Immediately check for newer data
	Start download directly to disk in background
If no cached data exists:
	Open app and download new data directly to display
		-parse JSON directly to labels
		-display remote imageViews
	Once data displays, cache data in background
*/
