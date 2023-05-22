import { useEffect } from "react";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

import styles from "./Map.module.css";

export const Map = () => {
	let map, infoWindow;

	function initMap() {
		map = new google.maps.Map(document.getElementById("map"), {
			center: { lat: 49, lng: 27 },
			zoom: 6,
		});
		infoWindow = new google.maps.InfoWindow();

		const locationButton = document.createElement("button");

		locationButton.textContent = "Pan to Current Location";
		locationButton.classList.add("custom-map-control-button");
		map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
		locationButton.addEventListener("click", () => {
			// Try HTML5 geolocation.
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
						(position) => {
							const pos = {
								lat: position.coords.latitude,
								lng: position.coords.longitude,
							};

							infoWindow.setPosition(pos);
							infoWindow.setContent("Location found.");
							infoWindow.open(map);
							map.setCenter(pos);
						},
						() => {
							handleLocationError(true, infoWindow, map.getCenter());
						}
				);
			} else {
				// Browser doesn't support Geolocation
				handleLocationError(false, infoWindow, map.getCenter());
			}
		});
	}

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(
				browserHasGeolocation
						? "Error: The Geolocation service failed."
						: "Error: Your browser doesn't support geolocation."
		);
		infoWindow.open(map);
	}

	useEffect(() => {
		// Load the Google Maps JavaScript API script
		const script = document.createElement("script");
		script.src = process.env.NEXT_PUBLIC_SCRIPT_SRC;
		script.defer = true;
		script.async = true;
		window.initMap = initMap;
		document.head.appendChild(script);

		return () => {
			// Clean up the Google Maps JavaScript API script
			document.head.removeChild(script);
			delete window.initMap;
		};
	}, []);

	return (
			<div id="map" className={styles['map-container']}></div>
	);
}
