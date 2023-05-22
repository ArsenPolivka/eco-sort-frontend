import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

import styles from "./Map.module.css";

export const Map = () => {
	let map, infoWindow;

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey)

	const [recyclingCenters, setRecyclingCenters] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let { data: recycling_centers } = await supabase
						.from("recycling_centers")
						.select("*");

				setRecyclingCenters(recycling_centers);
			} catch (error) {
				console.error("Error: " + error);
			}
		};
		fetchData()
	}, []);

	const svgDataUri = process.env.NEXT_PUBLIC_MARKER_RECYCLE_URL;

	function initMap() {
		map = new google.maps.Map(document.getElementById("map"), {
			center: { lat: 49, lng: 27 },
			zoom: 6,
			mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
		});

		infoWindow = new google.maps.InfoWindow();

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
					(position) => {
						const userLocation = {
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						};

						map.setCenter(userLocation);
						map.setZoom(14);

						const userMarker = new google.maps.Marker({
							position: userLocation,
							map: map,
							icon: {
								url: process.env.NEXT_PUBLIC_MARKER_LOCATION_URL
							},
						});
					},
					() => {
						console.error("Error getting user location");
					}
			);
		} else {
			console.error("Geolocation is not supported by this browser");
		}

		recyclingCenters.forEach(({name, address, position}) => {
			const coordinates = position.substring(1, position.length - 1).split(',');

			const lat = parseFloat(coordinates[0].trim());
			const lng = parseFloat(coordinates[1].trim());

			const marker = new google.maps.Marker({
				position: {lat, lng},
				map: map,
				icon: {
					url: svgDataUri
				},
			});

			marker.addListener("click", () => {
				infoWindow.setContent(`<div><strong>${name}</strong><br>${address}</div>`);
				infoWindow.open(map, marker);
				map.setCenter(marker.getPosition());
				map.setZoom(15);
			});
		});
	}

	useEffect(() => {
		if (recyclingCenters.length > 0) {
			const script = document.createElement("script");

			script.src = process.env.NEXT_PUBLIC_SCRIPT_SRC;
			script.defer = true;
			script.async = true;
			window.initMap = initMap;
			document.head.appendChild(script);

			return () => {
				document.head.removeChild(script);
				delete window.initMap;
			};
		}
	}, [recyclingCenters]);

	return <div id="map" className={styles["map-container"]}></div>;
};
