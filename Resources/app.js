//Include data load file
Ti.include('data.js');

//Fire load function
load('http://www.winewebdesign.com/appcelerator/articles.php?','num=6');

//Place window build in the loadWndow function to be controled by data load file
function loadWindow(){

    view = Ti.UI.createView({
        layout:'vertical'
    });

    var dataView0 = Ti.UI.createView({
        layout:'horizontal',
        height:dataArr[0].height/2,
        top:10
    });

    var data0 = Ti.UI.createLabel({
        text:dataArr[0].body,
        height:dataArr[0].height/2,
        width:'auto',
        left:10
    });

    var image0 = Ti.UI.createImageView({
        image:dataArr[0].image,
        width:dataArr[0].width/2,
        height:dataArr[0].height/2
    });

    dataView0.add(image0);
    dataView0.add(data0);
	cacheRemoteURL(image0, dataArr[0].image);

 	var dataView1 = Ti.UI.createView({
       	height:dataArr[1].height/2,
        layout:'horizontal',
        top:10
    });

    var data1 = Ti.UI.createLabel({
        text:dataArr[1].body,
        height:dataArr[1].height/2,
        width:'auto',
        left:10
    });

    var image1 = Ti.UI.createImageView({
        width:dataArr[1].width/2,
        height:dataArr[1].height/2
    });

    dataView1.add(image1);
    dataView1.add(data1);
    cacheRemoteURL(image1, dataArr[1].image);

    var dataView2 = Ti.UI.createView({
        layout:'horizontal',
        height:dataArr[2].height/2,
        top:10
    });

    var data2 = Ti.UI.createLabel({
        text:dataArr[2].body,
        height:dataArr[2].height/2,
        width:'auto',
        left:10
    });

    var image2 = Ti.UI.createImageView({
        image:dataArr[2].image,
        width:dataArr[2].width/2,
        height:dataArr[2].height/2
    });

    dataView2.add(image2);
    dataView2.add(data2);
 	cacheRemoteURL(image2, dataArr[2].image);
 	
 	var dataView3 = Ti.UI.createView({
        layout:'horizontal',
        height:dataArr[3].height/2,
        top:10
    });

    var data3 = Ti.UI.createLabel({
        text:dataArr[3].body,
        height:dataArr[3].height/2,
        width:'auto',
        left:10
    });

    var image3 = Ti.UI.createImageView({
        image:dataArr[3].image,
        width:dataArr[3].width/2,
        height:dataArr[3].height/2
    });

    dataView3.add(image3);
    dataView3.add(data3);
 	cacheRemoteURL(image3, dataArr[3].image);
 	
 	var dataView4 = Ti.UI.createView({
        layout:'horizontal',
        height:dataArr[4].height/2,
        top:10
    });

    var data4 = Ti.UI.createLabel({
        text:dataArr[4].body,
        height:dataArr[4].height/2,
        width:'auto',
        left:10
    });

    var image4 = Ti.UI.createImageView({
        image:dataArr[4].image,
        width:dataArr[4].width/2,
        height:dataArr[4].height/2
    });

    dataView4.add(image4);
    dataView4.add(data4);
 	cacheRemoteURL(image4, dataArr[4].image);
    
	var dataView5 = Ti.UI.createView({
        layout:'horizontal',
        height:dataArr[5].height/2,
        top:10
    });

    var data5 = Ti.UI.createLabel({
        text:dataArr[5].body,
        height:dataArr[5].height/2,
        width:'auto',
        left:10
    });

    var image5 = Ti.UI.createImageView({
        image:dataArr[5].image,
        width:dataArr[5].width/2,
        height:dataArr[5].height/2
    });

    dataView5.add(image5);
    dataView5.add(data5);
 	cacheRemoteURL(image5, dataArr[5].image);

    view.add(dataView0);
    view.add(dataView1);
	view.add(dataView2);
	view.add(dataView3);
	view.add(dataView4);
	view.add(dataView5);

    win.add(view);
    win.open();
    
    bootTime = (new Date() - startTime)/1000;
    Ti.API.info('**Timer** App Boot Time: '+ bootTime +' seconds.');
};

