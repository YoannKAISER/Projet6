fetch("http://localhost:5678/api/works")
	.then(response => response.json())
	.then(data => {
		let gallery = document.getElementsByClassName("gallery")[0];
		data.forEach(element => {
			let newDiv = document.createElement("div");
			newDiv.classList.add("galleryWork");
			newDiv.dataset.projetId = element.id;
			let img = document.createElement("img");
			img.src = element.imageUrl;
			img.dataset.categoryId = element.categoryId;
			newDiv.appendChild(img);
			let title = document.createElement("h3");
			title.innerHTML = element.title;
			newDiv.appendChild(title);
			gallery.appendChild(newDiv);
		});
	});

//Start modale
window.addEventListener("load", function (event) {
	const openModale = document.getElementsByClassName("modifier")[0];
	openModale.addEventListener("click", function (event) {
		modale.style.display = "grid";
		document.getElementsByTagName("body")[0].style.background = "rgb(0, 0, 0, 0.4)";
	});
});

function addPhotoToModale(element) {
	let photos = document.getElementsByClassName("photos")[0];
			let image = document.createElement("div");
			image.classList.add("projet");
			image.dataset.projetId = element.id;
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
			trashCan.addEventListener("click", fetchDeleteWork);
			trashCan.style.cursor = "pointer";
			remove.appendChild(trashCan);
}


fetch("http://localhost:5678/api/works")
	.then(response => response.json())
	.then(data => {
		data.forEach(element => {
		addPhotoToModale(element);
		});
	});

window.addEventListener("load", function (event) {
	const addPhotoButton = document.getElementsByClassName("addPhoto")[0];
	addPhotoButton.style.cursor = "pointer";
	addPhotoButton.addEventListener("click", function (event) {
		addPhotoModale.style.display = "flex";
		modale.style.display = "none";
	});
});

function fetchDeleteWork(event) {
	const token = sessionStorage.getItem("token");
	let projet = event.target.parentNode.parentNode;
	let id = projet.dataset.projetId;
	fetch("http://localhost:5678/api/works/" + id, {
		method: 'DELETE',
		headers: { "accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + token },
	})
		.then(response => {
			if (response.ok) {
				console.log("réussite");
				projet.style.display = "none";
				let gallerie = document.getElementsByClassName("gallery")[0];
				let workDelete = gallerie.querySelector("[data-projet-id='" + id + "']");
				console.log(workDelete);
				workDelete.style.display = "none";
			}
			else { console.log("échec"); }
		})
}

window.addEventListener("load", function (event) {
	const closeModale = document.getElementsByClassName("fa-xmark")[0];
	closeModale.addEventListener("click", function (event) {
		modale.style.display = "none";
		document.getElementsByTagName("body")[0].style.background = "rgb(255, 255, 255)";
	});
});
//End modale

//Start addPhotoModale
window.addEventListener("load", function (event) {
	const returnModale = document.getElementsByClassName("fa-arrow-left")[0];
	returnModale.style.cursor = "pointer";
	returnModale.addEventListener("click", function (event) {
		addPhotoModale.style.display = "none";
		modale.style.display = "grid";
	});
});

function addImage() {
	const img = document.querySelector(".addPhotoImg");
	const chooseFileInput = document.getElementsByClassName("chooseFile")[0];
	chooseFileInput.addEventListener("change", function (event) {
		const url = window.URL.createObjectURL(chooseFileInput.files[0])
		img.src = url;
		img.style.width = "220px";
		img.style.height = "170px";
		img.style.paddingTop = "0";
		img.style.zIndex = "1";
		checkFormComplete();
	})
};

window.addEventListener("load", function (event) {
	addImage();
	const titleInput = document.getElementById("title");
	const categorySelect = document.getElementById("categorie");
	const validButton = document.getElementsByClassName("validButton")[0];
	const addWorkForm = document.getElementById("addWorkForm");
	addWorkForm.addEventListener("change", function(event) {
		checkFormComplete();
		
	})
	fillSelectCategorieOptions();
});

function checkFormComplete() {
	const chooseFileInput = document.getElementsByClassName("chooseFile")[0];
	const titleInput = document.getElementById("title");
	const categorySelect = document.getElementById("categorie");
	const validButton = document.getElementsByClassName("validButton")[0];
		validButton.disabled = true;
		if (chooseFileInput.value !== "" && titleInput.value !== "" && categorySelect.value !== "") {
			validButton.style.background = "rgb(29, 97, 84, 1)";
			validButton.disabled = false;
			validButton.style.cursor = "pointer";
		}
		if (chooseFileInput.value === "" || titleInput.value === "" || categorySelect.value === "") {
			validButton.style.background = "rgb(167, 167, 167)";
			validButton.disabled = true;
			validButton.style.cursor = "default";
		}
		
};

function fillSelectCategorieOptions() {
	fetch("http://localhost:5678/api/categories", {
	method: 'GET',
	headers: {"accept": "application/json", "Content-Type": "application/json" }
	})
	.then(response => response.json())
	.then(data => {
		let inputSelect = document.getElementById("categorie");
		data.forEach(element => {
			let categorieSelect = document.createElement("option"); 
			categorieSelect.innerHTML = element.name;
			categorieSelect.value = element.id;
			inputSelect.appendChild(categorieSelect);
		});
	})
};

window.addEventListener("load", function(event) {
	let validButton = document.querySelector(".validButton");
	validButton.addEventListener("click", function(event) {
		const chooseFileInput = document.getElementsByClassName("chooseFile")[0];
		const titleInput = document.getElementById("title");
		const categorySelect = document.getElementById("categorie");
		if (chooseFileInput.value !== "" && titleInput.value !== "" && categorySelect.value !== "");
		sendWork(chooseFileInput.files[0], titleInput.value, categorySelect.value);
	});
});

function sendWork(image, title, categorie) {
	let formData = new FormData();
	formData.append("image", image);
	formData.append("title", title);
	formData.append("category", categorie);
	const token = sessionStorage.getItem("token");
	fetch("http://localhost:5678/api/works", {
		method: 'POST',
		body: formData,
		headers: { "accept": "application/json", "Authorization": "Bearer " + token },
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		else { throw new Error(response.statusText) }
	})
	.then(data => {
		console.log("réussite");
			let gallerie = document.getElementsByClassName("gallery")[0];
			let workAdd = document.createElement("div");
			workAdd.classList.add("galleryWork");
			gallerie.appendChild(workAdd);
			let imgAdd = document.createElement("img");
			imgAdd.src = data.imageUrl;
			workAdd.appendChild(imgAdd);
			workAdd.style.display = "grid";
			addPhotoModale.style.display = "none";
			modale.style.display = "grid";
			addPhotoToModale(data);
	})
	.catch(error => {
		console.error(error.message);
	})
};

window.addEventListener("load", function(event) {
	const closeModale = document.getElementsByClassName("fa-xmark")[1];
	closeModale.addEventListener("click", function (event) {
		addPhotoModale.style.display = "none";
		document.getElementsByTagName("body")[0].style.background = "rgb(255, 255, 255)";
	});
});
//End addPhotoModale