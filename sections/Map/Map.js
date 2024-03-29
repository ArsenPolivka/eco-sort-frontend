import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

import styles from "./Map.module.css";

export const Map = () => {
	let map, infoWindow;
	const MARKER_LOCATION_URL="data:image/svg+xml,%3Csvg width='28' height='29' viewBox='0 0 28 29' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_60_18)'%3E%3Crect x='2' y='2.85' width='24' height='24' rx='12' fill='%2345C0F4'/%3E%3Crect x='4' y='4.85' width='20' height='20' rx='10' stroke='white' stroke-width='4'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_60_18' x='0' y='0.850002' width='28' height='28' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_60_18'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_60_18' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E "
  const MARKER_RECYCLE_URL="data:image/svg+xml;charset=UTF-8,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='24' height='24' rx='12' fill='%23A2FFA0'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.96681 14.1816H11.7002V18.0739C11.2517 18.0739 10.8019 18.0734 10.3519 18.0744C9.72745 18.0754 9.10177 18.0917 8.47825 18.0754C7.78753 18.0571 7.26625 17.7336 6.94345 17.1192C6.30217 15.9017 5.67265 14.6791 5.02777 13.464C4.71553 12.877 4.73209 12.3319 5.12089 11.7816C5.36089 11.4422 5.55697 11.0722 5.79481 10.679C5.31553 10.3862 4.84057 10.097 4.32001 9.77928C4.42177 9.76008 4.47433 9.74184 4.52713 9.74088C5.73193 9.72672 6.93913 9.70896 8.14153 9.71184C8.27881 9.71232 8.47513 9.79608 8.54353 9.90408C9.27529 11.0597 9.98593 12.2278 10.7018 13.3925C10.7083 13.4047 10.7028 13.4242 10.7028 13.4892L8.99041 12.4562L7.96561 14.1809M11.3755 14.5411C11.3357 14.5286 11.3105 14.5138 11.285 14.5138C10.1614 14.5109 9.03889 14.5073 7.91545 14.5157C7.83841 14.5166 7.73689 14.5942 7.69201 14.6652C7.53697 14.9088 7.40545 15.1673 7.25833 15.4166C6.65113 16.4426 7.31305 17.6887 8.50681 17.7461C8.96761 17.7686 9.42937 17.755 9.89065 17.7559C10.385 17.7574 10.8792 17.7559 11.3755 17.7559V14.5411Z' fill='%23009345'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.05985 15.228C7.05985 15.228 7.96321 15.4181 7.97545 15.4298C7.98769 15.4421 8.39977 16.6591 8.40817 16.6798C8.41657 16.6997 7.97545 17.9285 7.97545 17.9285L7.01545 16.9685L6.66913 15.6374L7.06081 15.229' fill='%23009345'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.6849 14.2176V18.0768C11.161 18.0768 10.638 18.0773 10.1141 18.0763C9.62716 18.0754 9.13924 18.0922 8.65228 18.065C7.39036 17.9959 6.69124 16.4995 7.33276 15.2678C7.48828 14.9688 7.62724 14.658 7.79188 14.3654C7.83892 14.2807 7.94668 14.1869 8.02684 14.1859C9.21436 14.1756 10.4016 14.1809 11.5887 14.1859C11.6156 14.1859 11.6424 14.2044 11.6849 14.2193' fill='%23076735'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.2952 7.07472C11.6998 8.2056 11.1319 9.28296 10.5555 10.3771C9.40009 9.76848 8.27185 9.17472 7.11145 8.5632C7.32049 8.16648 7.53073 7.76904 7.73953 7.37088C8.02945 6.81744 8.30641 6.25656 8.61169 5.71176C8.94961 5.10984 9.47857 4.8 10.1727 4.8C11.5481 4.8 12.9245 4.8132 14.2999 4.8084C14.9647 4.80816 15.4395 5.07432 15.7447 5.6748C15.9327 6.04536 16.1698 6.39072 16.4062 6.7848C16.8886 6.4968 17.3652 6.21168 17.8901 5.89872C17.8594 5.99784 17.851 6.05304 17.8265 6.0996C17.2769 7.17264 16.7319 8.2476 16.1679 9.31224C16.1038 9.43368 15.9389 9.56832 15.8102 9.57864C14.4475 9.68712 13.0829 9.77208 11.7183 9.8628C11.7046 9.8628 11.6906 9.84864 11.6333 9.81792L13.3447 8.784C13.002 8.22528 12.6641 7.6752 12.2959 7.07472M10.3879 9.92376C10.4179 9.89424 10.4431 9.87888 10.4554 9.85656C10.9803 8.86392 11.5068 7.872 12.0233 6.87384C12.0583 6.80664 12.037 6.67992 11.9947 6.60744C11.8517 6.35592 11.6839 6.11952 11.5315 5.87256C10.9071 4.8576 9.49609 4.86264 8.88913 5.89176C8.65441 6.28848 8.45209 6.70392 8.23633 7.11168C8.00449 7.54872 7.77505 7.98696 7.54417 8.42544C8.51953 8.93952 9.45481 9.432 10.3887 9.92376' fill='%23009345'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.7912 5.78376C11.7912 5.78376 11.2022 6.49416 11.1859 6.49968C11.1691 6.50472 9.90022 6.30336 9.87862 6.30048C9.8563 6.29832 8.9743 5.33568 8.9743 5.33568L10.2727 4.93368L11.6126 5.24784L11.7912 5.78424' fill='%23009345'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.529 10.3464C9.40823 9.75624 8.28551 9.1644 7.11359 8.5476C7.35863 8.0844 7.60151 7.62168 7.84583 7.15896C8.07455 6.72792 8.28647 6.28824 8.53703 5.8704C9.18671 4.78656 10.8369 4.86456 11.6273 6.00648C11.8188 6.28368 12.0302 6.55104 12.2124 6.8328C12.2647 6.91464 12.2976 7.05288 12.2606 7.12488C11.7161 8.17992 11.159 9.22824 10.6034 10.2761C10.5907 10.3001 10.5626 10.3154 10.529 10.3457' fill='%23076735'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M16.3368 14.2877L14.442 11.0707C15.5681 10.4081 16.6668 9.76104 17.7967 9.09576C18.0245 9.48216 18.2518 9.86976 18.4802 10.2576C18.7985 10.7945 19.1299 11.3261 19.4328 11.8714C19.7666 12.4757 19.7525 13.0884 19.3874 13.679C18.6626 14.849 17.929 16.0123 17.2106 17.1847C16.8634 17.7516 16.3848 18.0139 15.7138 17.9568C15.3 17.9222 14.8817 17.9419 14.4218 17.9364L14.3957 19.6637C14.327 19.5866 14.2841 19.5494 14.2574 19.5038C13.6339 18.4728 13.0068 17.4432 12.3972 16.4033C12.3281 16.2847 12.3012 16.0733 12.36 15.9593C12.9835 14.7432 13.6298 13.5377 14.2697 12.3305C14.2766 12.3192 14.2961 12.3142 14.353 12.2808C14.3465 12.9514 14.3393 13.5982 14.3323 14.2802C14.987 14.2836 15.6331 14.2855 16.3378 14.2886M14.9179 11.1662C14.9268 11.2073 14.9268 11.2363 14.9393 11.2586C15.5076 12.2282 16.0742 13.1978 16.6519 14.1602C16.6906 14.2255 16.8098 14.2745 16.8943 14.2771C17.1835 14.2874 17.4734 14.2687 17.7626 14.2697C18.9545 14.2726 19.6922 13.0697 19.1369 12.0113C18.9221 11.6033 18.6749 11.2121 18.4421 10.8144C18.192 10.3877 17.9402 9.96144 17.6887 9.53424C16.739 10.0939 15.828 10.6298 14.9191 11.1655' fill='%23009345'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.6995 14.538C17.6995 14.538 17.4048 13.6639 17.4086 13.6469C17.4134 13.6301 18.2524 12.6574 18.2664 12.6396C18.2788 12.6218 19.5621 12.3782 19.5621 12.3782L19.222 13.6939L18.2493 14.6686L17.6995 14.538Z' fill='%23009345'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M14.4816 11.0664L17.8078 9.10776C18.0737 9.5592 18.3403 10.0097 18.6041 10.4614C18.8503 10.8818 19.1127 11.2937 19.3361 11.7264C19.9162 12.8496 18.9823 14.2114 17.5951 14.2834C17.2587 14.3009 16.9203 14.3388 16.5852 14.346C16.4875 14.3462 16.3519 14.3028 16.3111 14.2332C15.7003 13.2154 15.1015 12.1903 14.502 11.1655C14.4886 11.1427 14.4905 11.1101 14.4816 11.0664Z' fill='%23076735'/%3e%3c/svg%3e"

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

	const svgDataUri = MARKER_RECYCLE_URL;

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
								url: MARKER_LOCATION_URL
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
