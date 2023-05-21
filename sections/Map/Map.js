import { GoogleMap, Marker } from '@react-google-maps/api';
import styles from "./Map.module.css";
import {useMemo} from "react";


export const Map = () => {
	const center = useMemo(() => ({lat: 44, lng: -80}), []);

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