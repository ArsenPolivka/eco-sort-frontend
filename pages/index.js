import { useLoadScript } from "@react-google-maps/api";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

import { Map } from "../sections/Map/Map";

import 'normalize.css'

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCtSYwNr8WCyxcAc9vLQF6qgJ63Op5EaNc",
  });

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
      <>
        <Map />
      </>
  )
}
