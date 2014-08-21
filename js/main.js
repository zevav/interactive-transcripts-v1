function startTranscriptionService(options, whenreadyfunction){
	$.get(options.transcript , function(data){
		var str = "";
		var videoid = options.videoelementID;

		for (var i = 0; i < options.video.length; i++) {
			 ele = options.video[i];
			 str += "<source src='"+ele.vi+"' type='"+ele.type+"'>";
		};

		str = str+"Your browser does not support the video tag.";
		$("#"+videoid).html(str);

		$("#"+options.transcriptContainerID).html(data);
		var dataset = [];
			var videoele = document.getElementById(videoid);
			var scrollparent = $("#"+options.transcriptContainerID);
			var nowtime = 0;
			var x = 0;

		$(videoele).on("timeupdate", function(event){
		     var time = parseInt(this.currentTime*1000);
		     if(time < nowtime){
		     		adjuest(time);
		     }
		     nowtime = time;

		     for (var i = x; i < dataset.length; i++) {
			     	var datael = dataset[i];
			     	if((datael.start <= time) ){
			     				if(i > 0){
			     					var datae2 = dataset[i-1];
			     					$("#"+datae2.elementid).removeClass("onmovecolor");
			     				}
			     				var eleid = datael.elementid;
			     				$("#"+eleid).addClass("onmovecolor");
			     				scrollingdiv(scrollparent,$("#"+eleid));
			     				++x;
			     				break;
			     	}
		     };
		});

		$("body").delegate(".normalcolor", "click" , function(){
			var idval = $(this).attr("id");
			 for (var i = 0; i < dataset.length; i++) {
			     	var datael = dataset[i];
			     	var eleid = datael.elementid;
			     	if(idval == eleid){
			     			videoele.currentTime = datael.start/1000;
			     			adjuest(datael.start);
			     			break;
			     	}
		     };

		});

		function adjuest(time){
			var lastval = 0;
			 for (var i = 0; i < dataset.length; i++) {
			     	var datael = dataset[i];
			     	var eleid = datael.elementid;
			     	if((datael.start <= time) ){
			     			//$("#"+eleid).addClass("onmovecolor");
			     			$("#"+eleid).removeClass("onmovecolor");
			     			lastval = i;
			     	}else{
			     			$("#"+eleid).removeClass("onmovecolor");
			     	}
		     };
		     x= lastval;
		}

		function scrollingdiv(parent, movingelement){
		        parent.animate({
		            scrollTop: movingelement.parent().scrollTop() + movingelement.offset().top - movingelement.parent().offset().top
		        }, {
		            duration: 500,
		            specialEasing: {
		                width: 'linear',
		                height: 'easeOutBounce'
		            },
		            complete: function (e) {
		                //console.log("animation completed");
		            }
		        });
		}


		videoele.onloadedmetadata =  function(){
			videoele.play();

			$("#"+options.transcriptContainerID+" p").each(function(i){
				var len = $(this).find("a").length;
				var elem1 = $(this).find("a")[0];
				var elem2 = $(this).find("a")[len-1];
				$(this).attr("id",i+"id");
				$(this).addClass("normalcolor");
				
				var starttime = parseInt($(elem1).data("m"));
				var endtime = parseInt($(elem2).data("m"));
				if(starttime == endtime){
					endtime = videoele.duration;
				}

				var eledata = {
					elementid : i+"id",
					start : starttime,
					end : endtime
				}

				dataset.push(eledata);
				
			});
		}

	}).success(function(){

		whenreadyfunction();
	});
}
