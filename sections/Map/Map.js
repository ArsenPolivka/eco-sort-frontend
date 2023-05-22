import { useMemo } from "react";
import { GoogleMap, Marker } from '@react-google-maps/api';

import styles from "./Map.module.css";

export const Map = () => {
	const center = useMemo(() => ({lat: 49.836, lng: 24}), []);

	return (
			<GoogleMap
					zoom={10}
					center={center}
					mapContainerClassName={styles['map-container']}
			>
				<Marker position={center} />
			</GoogleMap>
	)
}
