function filterColor(activeFilter) {
	let categories = document.querySelector(".categories");
	let colorSpan = categories.getElementsByTagName("span");
		Array.from(colorSpan).forEach((element) => {
			element.style.backgroundColor = "#FFFFFF"
			element.style.color = "#1D6154"
		})
		activeFilter.style.backgroundColor = "#1D6154";
		activeFilter.style.color = "#FFFFFF";
}

fetch("http://localhost:5678/api/categories")
	.then(response => response.json())
	.then(data => {
		let portfolio = document.getElementById("portfolio");
		const token = sessionStorage.getItem("token");
		let categories = document.createElement("div");
		categories.classList.add("categories");
		if (token !== null) {
		categories.style.display = "none";}
		portfolio.appendChild(categories);
		let Tous = document.createElement("span");
		Tous.innerHTML = "Tous";
		Tous.style.cursor = "pointer";
		Tous.style.backgroundColor = "#1D6154";
		Tous.style.color = "#FFFFFF";
		Tous.addEventListener("click", function(event) {
			let gallery = document.getElementsByClassName("gallery");
			let galleryWork = document.getElementsByClassName("galleryWork");
			Array.from(galleryWork).filter(function(work) {
				let img = work.getElementsByTagName("img")[0];
				work.classList.remove("unshow");
			});
			filterColor(Tous);
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
				filterColor(span);
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
		document.getElementsByTagName("html")[0].style.overflow = "hidden";
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
		document.getElementsByTagName("html")[0].style.overflow = "hidden";
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
		document.getElementsByTagName("html")[0].style.overflow = "visible";
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
		document.getElementsByTagName("html")[0].style.overflow = "visible";
	});
});

function addImage() {
	const img = document.querySelector(".addPhotoImg");
	const chooseFileInput = document.getElementsByClassName("chooseFile")[0];
	chooseFileInput.addEventListener("change", function (event) {
		const newFile = chooseFileInput.files[0];
		if(newFile.size > 4194304) {
			document.querySelector(".errorMaxSizeFile").style.display = "block";
		}
		else{
			const url = window.URL.createObjectURL(chooseFileInput.files[0])
			img.src = url;
			img.style.width = "220px";
			img.style.height = "170px";
			img.style.paddingTop = "0";
			img.style.zIndex = "1";
			checkFormComplete();
		}
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
			emptyForm();
			addPhotoToModale(data);
	})
	.catch(error => {
		console.error(error.message);
	})
};

function emptyForm() {
	const chooseFileInput = document.getElementsByClassName("chooseFile")[0];
	const titleInput = document.getElementById("title");
	const categorySelect = document.getElementById("categorie");
	chooseFileInput.value = "";
	titleInput.value = "";
	categorySelect.value = "";
	const img = document.querySelector(".addPhotoImg");
	img.src = "assets/Group.png";
	img.style.width = "70px";
	img.style.height = "55px";
	img.style.paddingTop = "20px";

}

window.addEventListener("load", function(event) {
	const closeModale = document.getElementsByClassName("fa-xmark")[1];
	closeModale.addEventListener("click", function (event) {
		addPhotoModale.style.display = "none";
		document.getElementsByTagName("html")[0].style.overflow = "visible";
		document.getElementsByTagName("body")[0].style.background = "rgb(255, 255, 255)";
		emptyForm();
	});
});
//End addPhotoModale


function verifyToken() {
	const token = sessionStorage.getItem("token");
	const headerEdit = document.querySelector(".headerEdit");
	const login = document.querySelector(".login");
	const logout = document.querySelector(".logout");
	const modifier = document.getElementsByClassName("modifierDiv")[0];
	const modifie = document.getElementsByClassName("modifierDiv")[1];

	if (token == null) {
		console.log("non connecté");
		headerEdit.style.display = "none";
		login.style.display = "flex";
		logout.style.display = "none";
		modifier.style.display = "none";
		modifie.style.display = "none";
	}
	else {console.log("connecté")
		login.style.display = "none";
		logout.style.display = "flex";
	}
};

function logout() {
	let logout = document.querySelector(".logout");
	logout.addEventListener("click", function(event) {
		sessionStorage.removeItem("token");
		location.reload();
	})
};

window.addEventListener("load", function(event) {
	verifyToken();
	logout();
});