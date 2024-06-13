<script setup >


import { onMounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster'
import axios from 'axios';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import Offcanvas from './components/Offcanvas.vue'
import ContactModal from './components/ContactModal.vue'
import TermsModal from './components/TermsModal.vue'
import PrivacyModal from './components/PrivacyModal.vue'
import AboutModal from './components/AboutModal.vue'
import { Modal } from 'bootstrap'
import HouseDetails from './components/HouseDetails.vue'
import {MarkerClusterGroup} from "leaflet.markercluster/src";

let map = ref(null)
let newMarker = ref(null)
let markersArray = ref([]) // Store markers data
let currentIndex = ref(0)  // Track the current marker index
let newMarkerData = ref({
  title: '',
  price: '',
  description: '',
  image: '',
  color: ''
})

function adjustMapHeight() {
  let screenHeight = document.documentElement.clientHeight;
  document.getElementById('map').style.height = `${screenHeight}px`;
}


function initiateMap(markers) {
  markersArray.value = markers.features;
  map.value = L.map('map').setView([36.8, 10], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map.value);

  const marker_group = new L1.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var childMarkers = cluster.getAllChildMarkers();

// Extract prices into an array
      var prices = [];
      for (var i = 0; i < childMarkers.length; i++) {
        prices.push(childMarkers[i].feature.properties.price);
      }

// Sort the prices array
      prices.sort(function (a, b) {
        return a - b;
      });

// Find the middle value
      var middleIndex = Math.floor(prices.length / 2);
      var mean = prices[middleIndex];
      return L.divIcon({
        html: '<div style="background-color: #a3b994;font-family: reddit mono,serif; border: 2px solid black; border-radius: 50%; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center;">' + 'د.ت' + Math.round(mean) + '</div>',
        className: 'custom-cluster-icon',
        iconSize: [30, 30]
      });
    }
  });

  let markerLayer = L.geoJSON(markers, {
    pointToLayer: (feature, latlng) => {
      const price = feature.properties.price;
      const customIcon = L.divIcon({
        className: 'custom-marker-icon',
        html: `<div style="position: absolute; visibility: visible;font-family: 'reddit mono',serif;  touch-action: pan-x pan-y;border-radius: 10px; background-color: #a3b994; border: 2px solid black;"><div class="text-sm rounded-3xl px-2 py-1 shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-bold font-averta relative  origin-center transition-transform flex items-center hover:z-10 hover:scale-110 text-black bg-[#D3DDCC]  css-0">د.ت${price}</div></div>`,
      });
      return L.marker(latlng, { icon: customIcon });
    },
    onEachFeature: (feature, layer) => {
      const index = markersArray.value.findIndex(m => m === feature);
      layer.on('click', () => {
        currentIndex.value = index;
        showPopup(layer.getLatLng(), feature, index);
      });
    },
  });


  marker_group.addLayer(markerLayer);
  map.value.addLayer(marker_group);


// Event listener for adding a new marker

  if (map.value) {
    map.value.on('click', (e) => {
      const { lat, lng } = e.latlng;
      addNewMarker(lat, lng);
    });
  } else {
    console.error('Map is not initialized');
  }
}






function addNewMarker(lat, lng) {
  if (newMarker.value) {
    newMarker.value.remove();
  }

  const customIcon = L.icon({
    iconUrl: 'public/images/home.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  newMarker.value = L.marker([lat, lng], { icon: customIcon }).addTo(map.value);

  // Open the marker form modal
  const modal = new Modal(document.getElementById('markerFormModal'));
  modal.show();
}

function openMarkerForm() {
  console.log('Opening marker form modal...')
  const modal = new Modal(document.getElementById('markerFormModal'));
  modal.show();
}
//drag and drop function
function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Add more extensions if needed
  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    const formData = new FormData();
    formData.append('image', file);

    axios.post('http://localhost:3001/save-image', formData)
        .then(response => {
          console.log('Image saved successfully:', response.data.url);

          newMarkerData.image = response.data.url;

          console.log(response.data.url)
          window.globalVariable = response.data.url;

          const preview = document.getElementById('preview-image');
          preview.src = response.data.url;
          preview.style.display = 'block';
        })
        .catch(error => {
          console.error('Error saving image:', error);
        });
  } else {
    console.error('Invalid file type. Please upload an image.');
  }
}


async function saveNewMarker() {
  if (!newMarker.value) {
    console.error('New marker not set');
    return;
  }

  const { title, price, description, image, color } = newMarkerData.value;
  // image array to stock the image on it
  let imageArray=[]
  imageArray.push(globalVariable)

  const newMarkerObject = {
    type: "Feature",
    properties: {
      title: title,
      price: price,
      description: description,
      image: imageArray,
      color: color
    },
    geometry: {
      type: 'Point',
      coordinates: [newMarker.value.getLatLng().lng, newMarker.value.getLatLng().lat]
    }
  };

  try {
    const response = await fetch('http://localhost:3001/save-marker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMarkerObject)
    });

    if (!response.ok) {
      throw new Error('Failed to save marker data');
    }
    console.log('Marker saved successfully');
    const markerFormModal = new Modal(document.getElementById('markerFormModal'));
    markerFormModal.hide();
  } catch (error) {
    console.error('Error saving marker data:', error);
  }
}
window.deleteMarker = async function (longitude, latitude) {
  try {
    const response = await axios.delete(`http://localhost:3001/delete-marker/${longitude}/${latitude}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Marker deleted successfully:', response.data);

  } catch (error) {
    console.error('Error deleting marker:', error);
  }
};



function createPopupContent(marker, index) {
  const { title, price, description } = marker.properties;
  console.log(marker.properties.image);

  const prevIndex = index > 0 ? index - 1 : markersArray.value.length - 1;
  const nextIndex = index < markersArray.value.length - 1 ? index + 1 : 0;

  let carouselItems = '';
  let images = marker.properties.image;

  if (Array.isArray(images) && images.length > 0) {
    carouselItems = images.map((image, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <div class="image-container" style="width: 100%; height: auto; overflow: hidden;">
          <img src="${image}" class="d-block w-100 img-fluid" style="border-radius: 10px; object-fit: cover;">
        </div>
      </div>
    `).join('');
  } else {
    carouselItems = `
      <div class="carousel-item active">
        <img src="/images/bg.jpg" class="d-block w-100 img-fluid" style="border-radius: 10px; object-fit: cover;">
      </div>
    `;
  }

  return `
    <!-- Bootstrap Carousel for Image Slider -->
    <div id="carousel-${index}" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        ${carouselItems}
      </div>
      <a class="carousel-control-prev" href="#carousel-${index}" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </a>
      <a class="carousel-control-next" href="#carousel-${index}" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </a>
    </div>
    <h5 class="card-title" style="font-family: 'Antic Didone',sans-serif;font-weight: 600;">${price} <img src="images/dinar.png" alt="Tunisian Dinar" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px;">/mo</h5>
    <div class="d-flex justify-content-between">
      <button class="btn btn-outline-dark" onclick="moveToMarker(${prevIndex})">Previous</button>
      <button class="btn btn-outline-dark" onclick="moveToMarker(${nextIndex})">Next</button>
      <button class="btn btn-danger" onclick="deleteMarker(${marker.geometry.coordinates[0]}, ${marker.geometry.coordinates[1]})">Delete</button>
      <router-link :to="\`/houseDetails/${encodeURIComponent(title)}/${price}/${encodeURIComponent(description)}/${encodeURIComponent(JSON.stringify(images))}\`" class="btn btn-info">Details</router-link>
    </div>
  `;
}




window.moveToMarker = function(index) {
  const marker = markersArray.value[index];
  const latlng = [marker.geometry.coordinates[1], marker.geometry.coordinates[0]];
  showPopup(latlng, marker, index);
  map.value.setView(latlng);
};


function showPopup(latlng, marker, index) {
  const content = createPopupContent(marker, index);

  L.popup()
      .setLatLng(latlng)
      .setContent(content)
      .openOn(map.value);
}



// Inside your Vue component
onMounted(async () => {
  adjustMapHeight();
  try {
    axios.get("http://" + location.hostname + ':3001/data')
        .then(response => {
          initiateMap(response.data); //  response.data is the marker data

        })
        .catch(error => {
          console.error('Error fetching marker data:', error);
        });
  } catch (error) {
    console.error('Error fetching marker data:', error);
  }
});
</script>

<template>
  <div class="main-page">
  <div class="position-relative" id="map-section">
    <!-- Bootstrap Navbar -->
    <!-- Bootstrap Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-2 fancy-navbar">
      <div class="container-fluid">
        <!-- Navbar brand -->
        <a class="navbar-brand" href="#">
          <img src="../logo.png" alt="not only a doors and windows" style="width: 60px; height: auto;">
        </a>
        <!-- Navbar toggler button -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Navbar menu items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-auto">
            <!-- Search form -->
            <li class="nav-item d-flex align-items-center">
              <input class="form-control search-input me-2" type="search" placeholder="Search" aria-label="Search">
              <button class="button">
                <span class="span"><img src="/public/images/search (1).png" ></span>
              </button>
            </li>
            <!-- Menu button -->
            <li class="nav-item">
              <button class="nav-link btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                Menu
              </button>
            </li>
            <!-- Add Custom Marker button -->
            <li class="nav-item">
              <button class="nav-link btn" @click="openMarkerForm">Add Home</button>
            </li>
            <!-- Contact button -->
            <li class="nav-item">
              <button class="nav-link btn btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">Contact</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  </div>
    <!-- Map section -->
  <div id="map"></div>

  <!-- Additional elements
  <div class="position-absolute end-0 bottom-0 mb-4 me-2" style="z-index: 1000;">
    <a type="button" class="" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <img src="/images/customer-service.png" class="rounded-2 border border-3 border-green" alt="no image" id="banner-image">
    </a>
  </div>-->

  <!-- Marker Form Modal -->
  <div class="modal fade" id="markerFormModal" tabindex="-1" aria-labelledby="markerFormModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header">
          <h5 class="modal-title" id="markerFormModalLabel">Add Custom Marker</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveNewMarker">
            <div class="mb-3">
              <label for="markerTitle" class="form-label">Title</label>
              <input type="text" class="form-control bg-secondary text-white custom-input" id="markerTitle" v-model="newMarkerData.title">
            </div>
            <div class="mb-3">
              <label for="markerPrice" class="form-label">Price</label>
              <input type="text" class="form-control bg-secondary text-white custom-input" id="markerPrice" v-model="newMarkerData.price">
            </div>
            <div class="mb-3">
              <label for="markerDescription" id="form-label" class="form-label">Description</label>
              <textarea class="form-control bg-secondary text-white custom-input" id="markerDescription" rows="3" v-model="newMarkerData.description"></textarea>
            </div>
            <div class="mb-3">
              <label for="markerImage" class="form-label">Image</label>
              <div id="drop-area" class="drop-area" @dragover.prevent @drop="handleDrop">
              <div id="drop-area" class="drop-area">
                <img id="preview-image" src="" class="img-fluid pb-2" style="width: 200px; border-radius: 10px; display: none;">
                <p class="drop-area-text">Drag & Drop Image Here</p>
                <input type="file" id="markerImage" accept="image/*" style="display: none;">
              </div>
            </div>
            </div>
            <button type="submit" class="btn btn-primary">Save Marker</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>

  <Offcanvas id="offcanvasExample"/>
  <ContactModal />
  <PrivacyModal />
  <TermsModal />
  <AboutModal />


</template>

<style scoped>
#map {
  width: 100%;
  height: 100vh; /* the map takes full viewport height */
}
.main-page {
  width: 100%;
  height: 100vh;}
@media (max-width: 720px) {
  #banner-image {
    height: 90px;
  }

}

@media (min-width: 721px) {
  #banner-image {
    height: 140px;
  }

}
.drop-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  position: relative;
}

.form-label {
  background-color: rgba(127, 140, 159, 0)

}
.drop-area:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.drop-area-text {
  color: #ccc;
}

.drop-area img {
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 10px;
}





.custom-input:focus {
  border-color: white;
  box-shadow: 0 0 0 0.2rem rgb(255, 255, 255);
}

.fancy-navbar {
  z-index: 1000;
  position: relative;
  height: 64px;
  //border-radius: 0 0 22px 22px;
  //box-shadow: 0 4px 8px rgb(255, 255, 255);
  background: linear-gradient(135deg, #ffffff 0%, rgb(255, 255, 255) 100%);
border: 1px solid rgba(199, 187, 187, 0.84);
}
.navbar-nav .nav-link.btn {
  --color: rgb(163 185 148 / 42%);
  font-family: "Reddit Mono",fantasy;
  display: inline-block;
  width: 8em;
  height: 2.6em;
  line-height: 2.5em;
  margin: 25px;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--color);
  transition: color .5s;
  z-index: 1;
  font-size: 17px;
  border-radius: 122px;
  font-weight: 500;
  color: rgb(163 185 148);
}

.navbar-nav .nav-link.btn:before {
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--color);
  height: 150px;
  width: 200px;
  border-radius: 50%;
}

.navbar-nav .nav-link.btn:hover {
  color: rgb(46, 168, 139);
}

.navbar-nav .nav-link.btn:before {
  top: 100%;
  left: 100%;
  transition: all .7s;
}

.navbar-nav .nav-link.btn:hover:before {
  top: -30px;
  left: -30px;
}

.navbar-nav .nav-link.btn:active:before {
  background: #0a0a0a;
  transition: background 0s;
}

.button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e8e8e8;
  background-color: #ffffff;
  width: 60px;
  height: 37px;
  font-size: 24px;
  text-transform: uppercase;
  border: 2px solid #d8e2d2;
  border-radius: 10px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  box-shadow: 5px 5px 2px rgba(187, 152, 152, 0.15),
  2px 2px 2px rgba(0, 0, 0, 0.1),
  -3px -3px 2px rgba(255, 255, 255, 0.05),
  -2px -2px 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  cursor: pointer;
}

.button .span {
  position: relative;
  z-index: 2;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.button::before {
  content: "";
  position: absolute;
  background-color: #e8e8e8;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;
  transform: translate(-100%, 100%);
  border-radius: 10px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.button:hover::before {
  transform: translate(0,0);
  transition-delay: 0.4s;
}

.button:hover .span {
  scale: 1.2;
}

.button:hover {
  box-shadow: none;
}

.button:active {
  scale: 0.95;
}



</style>
