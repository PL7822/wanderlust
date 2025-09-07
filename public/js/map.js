
mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    style: "mapbox://style/mapbox/streets-v12",
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // Already [lng, lat]
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${listing.location}</h3><p>Exact Location will be provided after booking</p>`
        )

    )
    .addTo(map);
