let card_container = document.getElementById("card-container");
let current_page = 0;

// false if db results end
let can_add = true;
var youtube_player;
var youtube_video_done = false;
var throttle_timer;

const throttle = (callback, time) => {
  if (throttle_timer) return;

  throttle_timer = true;

  setTimeout(() => {
    callback();
    throttle_timer = false;
  }, time);
};
function onYoutubeReady(event) { 
	event.target.playVideo(); 
}
function onYoutubeStateChange(event) {
	 if (event.data == YT.PlayerState.PLAYING && !youtube_video_done) {
		setTimeout(stopYoutubeVideo, 6000); 
		youtube_video_done = true; 
	}
}
function stopYoutubeVideo() { 
	youtube_player.stopVideo(); 
}

const createCard = (data) => {
	// hidden prototype dom
	let card = document.getElementById("image-card-prototype").cloneNode(true);

	card.id = data._id;
	// card.querySelector(".card-link").setAttribute("href",`/image/?id=${data._id}&page=${current_page}`);
	card.querySelector(".card-link").setAttribute("data-bs-id",data._id);

	card.querySelector(".card-img-top").setAttribute("src",data.path);
	card.querySelector(".card-img-top").setAttribute("alt",data.filename);

	card.querySelector(".image-title").innerHTML = data.title;
	
	card.querySelector(".image-copyright").setAttribute("href",data.copyright_link);
	card.querySelector(".image-copyright").innerHTML = data.copyright_name;
	
	// data-bs-toggle="modal" data-bs-id="636a4d7e8f062b0af3a55af3" data-bs-target="#detailModal"

	card_container = document.getElementById("card-container");

	card_container.append(card);
};

const addCards = () => {
	// show graphics
	document.getElementById("loading-gfx").classList.remove("hidden");

	// if url has ?search= param
	const urlParams = new URLSearchParams(window.location.search);

	let img_params = {page:current_page};

	if(urlParams.has('search')){
		img_params.search = urlParams.get('search');
	}

	axios.get('/images', {params: img_params}).then(function (response) {

		// hide graphics
		document.getElementById("loading-gfx").classList.add("hidden");
		
		if(response.data.length == 0 ){
			can_add = false;
			// show page end dom
			document.getElementById("page-end").classList.remove("hidden");
		}
		response.data.forEach((data)=>{
			createCard(data);
		})
	}).catch(function (error) {
		console.log(error);
	}).then(function () {
		current_page+=1;
	});  
};

const handleInfiniteScroll = () => {
  throttle(() => {
	// scroll bar percentage
    const scroll_percentage = (window.innerHeight + window.pageYOffset)/document.body.offsetHeight;
	
	// 90% scrolled 
    if (scroll_percentage >= 0.9 && can_add) {
		addCards();
    }
  }, 500);
};

function modalSetup(){
	var detailModal = document.getElementById('detailModal');
	
	detailModal.addEventListener('hide.bs.modal', function (event) {
		window.history.pushState({urlPath:"/"},"Mitosis.pictures","/");
		document.title = "Mitosis.pictures";
	
		if(youtube_player != null){
			stopVideo();
		}
	
		detailModal.querySelector(".modal-title").innerHTML = "";
		detailModal.querySelector(".image-title-link").setAttribute("href","");
		detailModal.querySelector(".image-description").innerHTML = "";
		detailModal.querySelector('.card-img-top').setAttribute('src',"");
		detailModal.querySelector(".card-img-top").setAttribute("alt","");
		detailModal.querySelector(".image-copyright").setAttribute("href","");
		detailModal.querySelector(".image-copyright").innerHTML = "";
		detailModal.querySelector(".video-container").innerHTML = "";
	})

	detailModal.addEventListener('show.bs.modal', function (event) {

		var data_obj = event.relatedTarget

		axios.get('/detail', {params:{id:data_obj.getAttribute('data-bs-id')}}).then(function (response) {
			detailModal.querySelector(".modal-title").innerHTML = response.data.title;
			detailModal.querySelector(".image-title-link").setAttribute("href",`/image/${response.data._id}`);
			detailModal.querySelector(".image-description").innerHTML = response.data.description;
			detailModal.querySelector(".image-copyright").setAttribute("href",response.data.copyright_link);
			detailModal.querySelector(".image-copyright").innerHTML = response.data.copyright_name;
			
			if(typeof response.data.video_id === 'string' && response.data.video_id.length !== 0){
				if(response.data.video_type === 1){
					detailModal.querySelector(".video-container").innerHTML = `<div id="player"class="card-img-top border-25 soft-shadow"></div>`
					player = new YT.Player('player', { height: '360',  width: '640', videoId: response.data.video_id, events: {'onReady': onYoutubeReady,'onStateChange': onYoutubeStateChange }}); 
				}
				if(response.data.video_type === 2){
					detailModal.querySelector(".video-container").innerHTML = `<iframe src="https://player.vimeo.com/video/${ response.data.video_id}?h=87f80eda9b&color=000000&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen class="card-img-top border-25 soft-shadow" style="background: #000000;"></iframe>`
				}
			}else{
				detailModal.querySelector('.card-img-top').setAttribute('src',response.data.path);
				detailModal.querySelector(".card-img-top").setAttribute("alt",response.data.filename);
			}
			// update url
			window.history.pushState({urlPath:`image/${response.data._id}`},response.data.title,`image/${response.data._id}`);
			document.title = response.data.title;

	}).catch(function (error) {
		console.log(error);
	}).then(function () {
	
	});  
	})

}

function youtubeSetup(){
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
	
function syncState(){
	const urlParams = new URLSearchParams(window.location.search);
	if(urlParams.has('search')){
		document.getElementById("search-input").value = urlParams.get('search');
	}
}

window.onload = function () {
	// first page
	addCards();

	modalSetup();

	youtubeSetup();

	syncState();
};

window.addEventListener("scroll", handleInfiniteScroll);