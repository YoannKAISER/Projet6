fetch("http://localhost:5678/api/categories")
	.then(response => response.json())
	.then(data => {
		let portfolio = document.getElementById("portfolio");
		let categories = document.createElement("div");
		categories.classList.add("categories");
		portfolio.appendChild(categories);
		let Tous = document.createElement("span");
		Tous.innerHTML = "Tous";
		Tous.style.cursor = "pointer";
		Tous.addEventListener("click", function(event) {
			let gallery = document.getElementsByClassName("gallery");
			let galleryWork = document.getElementsByClassName("galleryWork");
			Array.from(galleryWork).filter(function(work) {
				let img = work.getElementsByTagName("img")[0];
				work.classList.remove("unshow");
			});
		});
		categories.appendChild(Tous);
		data.forEach(element => {
			let span = document.createElement("span");
			span.innerHTML = element.name;
			span.dataset.idCategory = element.id;
			span.style.cursor = "pointer";
			span.addEventListener("click", function(event) {
				let gallery = document.getElementsByClassName("gallery");
				let galleryWork = document.getElementsByClassName("galleryWork");
				Array.from(galleryWork).filter(function(work) {
					let img = work.getElementsByTagName("img")[0];
					if (img.dataset.categoryId != event.target.dataset.idCategory) {
						work.classList.add("unshow")
					}
					else {work.classList.remove("unshow")};
				});
			});
			categories.appendChild(span);
		});
	});

fetch("http://localhost:5678/api/works")
	.then(response => response.json())
	.then(data => {
		let gallery = document.getElementsByClassName("gallery")[0];
		data.forEach(element => {
			let newDiv = document.createElement("div");
			newDiv.classList.add("galleryWork");
			let img = document.createElement("img");
			img.src = element.imageUrl;
			img.dataset.categoryId = element.categoryId;
			newDiv.appendChild(img);
			let title = document.createElement("h3");
			title.innerHTML = element.title;
			newDiv.appendChild(title);
			gallery.appendChild(newDiv);
		}); 
	})


//Start modale

window.addEventListener("load", function(event) {
	const openModale = document.getElementsByClassName("modifier")[0];
	openModale.addEventListener("click", function(event) {
	modale.style.display = "flex";
	document.getElementsByTagName("body")[0].style.background = "rgb(0, 0, 0, 0.4)";
	});
});

fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then(data => {
    let photos = document.getElementsByClassName("photos")[0];
    data.forEach(element => {
        let image = document.createElement("div");
        image.classList.add("projet");
        photos.appendChild(image);
        let img = document.createElement("img");
        img.src = element.imageUrl;
        image.appendChild(img);
        let edit = document.createElement("span");
        edit.innerHTML = "éditer";
        image.appendChild(edit);
        let remove = document.createElement("div");
        remove.classList.add("remove");
        image.appendChild(remove);
		let trashCan = document.createElement("i");
		trashCan.classList.add("fa-solid");
		trashCan.classList.add("fa-trash-can");
		remove.appendChild(trashCan);
    }); 
})

window.addEventListener("load", function(event) {
	const closeModale = document.getElementsByClassName("fa-xmark")[0];
	closeModale.addEventListener("click", function(event) {
	modale.style.display = "none";
	document.getElementsByTagName("body")[0].style.background = "rgb(255, 255, 255)";
	});
});

//End modale