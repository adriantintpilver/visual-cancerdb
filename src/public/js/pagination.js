let card_container = document.getElementById("card-container");
let current_page = 0;

let can_add = true;

var throttle_timer;
const throttle = (callback, time) => {
  if (throttle_timer) return;

  throttle_timer = true;

  setTimeout(() => {
    callback();
    throttle_timer = false;
  }, time);
};


const createCard = (data) => {
	// hidden prototype dom
	let card = document.getElementById("image-card-prototype").cloneNode(true);

	card.id = "";
	card.querySelector(".card-link").setAttribute("href",`/image/${data._id}`);
	
	card.querySelector(".card-img-top").setAttribute("src",data.path);
	card.querySelector(".card-img-top").setAttribute("alt",data.filename);

	card.querySelector(".image-title").innerHTML = data.title;
	
	card.querySelector(".image-copyright").setAttribute("href",data.copyright_link);
	card.querySelector(".image-copyright").innerHTML = data.copyright_name;
	
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
		current_page+=1;
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

window.onload = function () {
  addCards();
};

window.addEventListener("scroll", handleInfiniteScroll);