import L from "leaflet";

function initiateMap(markers) {
    markersArray.value = markers.features;
    map.value = L.map('map').setView([36.8, 10], 10);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map.value);



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
    }).addTo(map.value);


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
L.Marker.prototype._animateZoom = function (opt) {
    if (!this._map) {
        return;
    }
    const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
    this._setPos(pos);
}