'use strict';

angular.module('newappApp')
    .controller('ScanController', function ($scope, Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });
              

        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady);
        var DWObject;
        
		function Dynamsoft_OnReady() {
            DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
    
            DWObject.IfShowUI = true;
           
		}
		
		$scope.btnLoad_onclick = function() {
			var OnSuccess = function() {};
			var OnFailure = function(errorCode, errorString) {};
			DWObject.IfShowFileDialog = true;
			DWObject.LoadImageEx("", EnumDWT_ImageType.IT_ALL, OnSuccess, OnFailure);
		}

		$scope.AcquireImage =function () {
			if (DWObject) {

					var OnAcquireImageSuccess, OnAcquireImageFailure;
					OnAcquireImageSuccess = OnAcquireImageSuccess = function () {
                        console.log("YES");
                    DWObject.CloseSource();
                    
                    };
                    

                    OnAcquireImageFailure = OnAcquireImageFailure = function () {
                        console.log("NOO");
					DWObject.CloseSource();
					};

                    var t = document.getElementById("source");
                    var selectedText = t.options[t.selectedIndex].text;
                    var i;
                    for (i= 0; i< DWObject.SourceCount;i++){ 
                        if (DWObject.GetSourceNameItems(i)==selectedText )  //TWAIN2 FreeImage Software Scanner
                            {
                                DWObject.SelectSourceByIndex (i); //select the specific source
                                 //if can't find the specified source, it'll select default source
                                console.log(i+"----"+selectedText);
                        }
                     
                    }



                    DWObject.IfShowUI = false;
                    //DWObject.IfDisableSourceAfterAcquire = false;  //Scanner source will be disabled/closed automatically after the scan.
                    DWObject.AcquireImage(OnAcquireImageSuccess, OnAcquireImageFailure);
                     
				//}
			}
		}
	
		$scope.btnUpload_onclick = function () {
			var strHTTPServer = location.hostname;
			DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;
			var _strPort = location.port == "" ? 80 : location.port;
			if (Dynamsoft.Lib.detect.ssl == true)
				_strPort = location.port == "" ? 443 : location.port;
			DWObject.HTTPPort = _strPort;
			var CurrentPathName = unescape(location.pathname); // get current PathName in plain ASCII
			var CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1);
			var strActionPage = CurrentPath + "upload";
			var sFun = function(){
				alert('successfully uploaded a file');
			}, fFun = function(){
				alert('failed to upload!');
			};
			var Digital = new Date();
            var uploadfilename = Digital.getMilliseconds();
            
            //save image to pdf


			/*DWObject.HTTPUploadThroughPost(
				strHTTPServer,
				DWObject.CurrentImageIndexInBuffer,
				strActionPage,
				uploadfilename + ".jpg",
				sFun, fFun
			);*/
		}


        $scope.toPDF = function (){

         var strFileName;
         var Digital = new Date();
         var Month = Digital.getMonth() + 1;
         var Day = Digital.getDate();
         var Hour = Digital.getHours();
         var Minute = Digital.getMinutes();
         var Second = Digital.getSeconds();
         var CurrentTime = Month + "_" + Day + "_" + Hour + "_" + Minute + "_" + Second;
         strFileName = "E:/temp/"+CurrentTime + ".pdf";
         console.log(strFileName);
         DWObject.SaveAsPDF(strFileName,DWObject.CurrentImageIndexInBuffer); //save each scanned image as a different PDF file 
         if (DWObject.ErrorCode != 0) {  
             alert (DWObject.ErrorString);
         }
        }



        /****************/
        $scope.LoadDefaultSource = function() {
   // load info from cookie as string value
   var strCookie = document.cookie;
   // check if a pre-scan settings has been saved before
   if(strCookie != "") {
      // spilt the cookie string into several name/value pair
      var arrCookie = strCookie.split("; ");
      // iterate through the array
      // locate the cookie named "DefaultSourceName", and get the value
      for (var i = 0; i < arrCookie.length; i++) {
         var arr = arrCookie[i].split("=");
         if ("DefaultSourceName" == arr[0]) {
            DWObject.IfUseTWAINDSM = true;
            DWObject.DefaultSourceName = arr[1];
            var sourceList = document.getElementById("source");
            console.log(sourceList);
            for (var j = 0; j < sourceList.length; j++) {
               if(document.getElementById("source").options[j].innerText == arr[1]){
                  document.getElementById("source").options.selectedIndex = j;
               }
            }      
         break;
         }
      }
   }
}
/****************/


 $scope.load = function(){

        var test = Dynamsoft.WebTwainEnv.
            GetWebTwain('dwtcontrolContainer');
  if (test) {
                var count = test.SourceCount; // Populate how many sources are installed in the system
                console.log("count");
                console.log(count);
                for (var i = 0; i < count; i++)
                    document.getElementById("source").options.add(new Option(test.GetSourceNameItems(i), i));  // Add the sources in a drop-down list
            }




 }




    });
