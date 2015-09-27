window.onload = function() {
	reset();
	xmlLoad();
	MapMain();
        createtag()
	if (selectC.addEventListener) {
		selectC.addEventListener('change', ABRequest, false);
	}
};
/*function chang(){
var se = document.getElementById("selectC");
selectC.addEventListener('change', al, false);
}*/

// -------------------------------------------------
// 初期設定（いったんHTMLを空にする）
// -------------------------------------------------
function reset() {
	$("select").html("");
}

// -------------------------------------------------
// XML読み込み
// -------------------------------------------------

function xmlLoad() {
	$.ajax({
		url : 'CountryData.xml',
		type : 'get',
		dataType : 'xml',
		timeout : 500,
		success : parse_xml
	});
}

// -------------------------------------------------
// XMLデータを取得
// -------------------------------------------------

function parse_xml(xml, status) {
	if (status != 'success')
		return;
	$(xml).find('Country').each(CreatePull);
}

// -------------------------------------------------
// HTML生成関数
// -------------------------------------------------

function CreatePull() {
	//各要素を変数に格納
	var $Name = $(this).find('Name').text();
	var $Code = $(this).find('Code').text();
	//HTMLを生成
	$('<option value=' + $Code + '>' + $Name + '</option>').appendTo('select');
}

// -------------------------------------------------
// AB-ROAD
// -------------------------------------------------
function loadJS(src) {
             var script = document.createElement('script');
             script.src=src;
             document.body.appendChild(script);
}
function ABRequest() {
	var val = document.form.selectC.value;
	if (val != "def") {
		var src = "http://webservice.recruit.co.jp/ab-road/spot/v1?key=fa351e46076b26be&country=" + val + "&count=10&format=jsonp&callback=CreateMarker";
		loadJS(src);
		//document.getElementById("aa").innerHTML = val;//デバッグ用
	}
        //document.getElementById("aa").innerHTML += "http://webservice.recruit.co.jp/ab-road/spot/v1?key=fa351e46076b26be&country=" + val + "&count=10"+"</br>";//デバッグ用
}

CityNum=0;
/*緯度経度を配列へ入れる*/
function CreateMarker(data) {
	Markers = [10];
        
	for (var i = 0; i <data.results.spot.length ; i++) {
		Markers[i] = {
			Name : data.results.spot[i].name,
			Lat : data.results.spot[i].lat,
			Lng : data.results.spot[i].lng
		};
                if (i==10) { CityNum=i;break;}
                CityNum=i+1;
	}
	var val = document.form.selectC.selectedIndex;
	//document.getElementById("aa").innerHTML = CityNum;//デバッグ用
	update();
}

// -------------------------------------------------
// Panoramio
// -------------------------------------------------
function PARequest(i) {
	//document.getElementById("aa").innerHTML = "http://www.panoramio.com/map/get_panoramas.php?set=full&from=0&to=5&minx="+(Markers[i].Lng-2)+"&miny="+(Markers[i].Lat-2)+"&maxx="+(Markers[i].Lng+2)+"&maxy="+(Markers[i].Lat+2)+"&size=medium&mapfilter=true"
	//デバッグ用
        rewrite();
	var src = "http://www.panoramio.com/map/get_panoramas.php?set=full&from=0&to=5&minx="+(Markers[i].Lng-2)+"&miny="+(Markers[i].Lat-2)+"&maxx="+(Markers[i].Lng+2)+"&maxy="+(Markers[i].Lat+2)+"&size=medium&mapfilter=true&callback=getPhoto"
	//"http://www.panoramio.com/map/get_panoramas.php?set=fulls&from=0&to=5&minx="+(Markers[i].Lat-2)+"&miny="+(Markers[i].Lng-2)+"&maxx="+(Markers[i].Lat+2)+"&maxy="+(Markers[i].Lng+2)+"&size=square&mapfilter=true&callback=getPhoto"
        loadJS(src);
        //document.getElementById("aa").innerHTML="yomi";
}

Count=0;
function getPhoto(data,a) {
            //document.getElementById("aa").innerHTML+="call";
	for (i=0 ;i<data.photos.length; i++) {
		var img = document.getElementById("'"+(i+Count*5)+"'");
                img.src =data.photos[i].photo_file_url;
                img.title= data.photos[i].title;
                img.data = new google.maps.LatLng(data.photos[i].latitude,data.photos[i].longitude );
                img.addEventListener("click",function(){select(this)},false);
               
        }
            Count++;　
            if (Count==CityNum) {
                     Coverflow(); 
            }
/*var script = document.createElement('script');
        script.src ="horizontal.js" ;
        document.getElementById("body").appendChild(script);
        li.style.backgroundImage="url(data.photos[i].photo_file_url)"//  no-repeat";//data.photos[i].photo_file_url
                li.style.backgroundSize="contain";*/
         
}

function createtag(){
            for(var i=0;i<50;i++){
            var img = document.createElement("img");
                var cover =document.getElementById("coverflow");
                img.id="'"+i+"'";
                img.width="300";
                img.height="200";
		cover.appendChild(img);
            }
            var scriptcity = document.createElement('script');
            scriptcity.id = "cityReq";
            document.body.appendChild(scriptcity);    
}
function rewrite(){
            for (var i=0;i<50;i++) {
                       var img=document.getElementsByTagName("img");
                       img.src="";
                        
            }
}

// -------------------------------------------------
// GoogleMap
// -------------------------------------------------

function MapMain() {

	var iti = new google.maps.LatLng(35.608614,139.555373);
	var myOptions = {
		zoom : 3,
		center : iti,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	mymap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	markers = [];
	markers[0] = new google.maps.Marker({
		position : iti,
		map : mymap,
		title : "専修大学生田キャンパス"
	});
}

function update() {
	//document.getElementById("aa").innerHTML = ;
	for ( i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
		//document.getElementById("aa").innerHTML = "gg";//デバッグ用
	}
	mymap.panTo(new google.maps.LatLng(Markers[0].Lat, Markers[0].Lng));
	for ( i = 0; i < CityNum; i++) {
		markers[i] = new google.maps.Marker({
			position : new google.maps.LatLng(Markers[i].Lat, Markers[i].Lng),
			map : mymap,
			title : Markers[i].Name
		});
	}
	for (var i = 0; i < CityNum; i++) {
            Count=0;
	    PARequest(i);
	}
}

function select(img){
            mymap.panTo(img.data);
            markerimg=new google.maps.Marker({
                        position: img.data,
                        map:mymap,
                        title:img.title,
                        animation:google.maps.Animation.BOUNCE
            })
}

// -------------------------------------------------
// Coverflow
// -------------------------------------------------


function Coverflow() {
    $('#coverflow').coverflow({
        active : 4,
        perspectiveY : 50,
        scale : 0.8,
        overlap : 0.1,
    });
}

/*
 document.getElementById("0").style.background="url('11.jpg') no-repeat";
        document.getElementById("0").style.backgroundSize="contain";
        */








/*googleMap Marker*/
/*function initialize() {
 var mapOptions = {
 zoom: 4,
 center:new google.maps.LatLng(35.6581, 139.7414)//(Markers[0].Lat,Markers[0].Lng)
 }
 var mymap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
 var marker=[10];
 for(i=0;i<LatArray.length;i++){
 marker[i] = new google.maps.Marker({
 position: new google.maps.LatLng(Markers[i].Lat,Markers[i].Lng),
 map: mymap,
 title: Markers[i].Name
 });
 }
 }*/

