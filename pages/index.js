import { useLoadScript } from "@react-google-maps/api";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

import { Map } from "../sections/Map/Map";

import 'normalize.css'

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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
