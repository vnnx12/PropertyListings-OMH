import Image from 'next/image';
import PropertyList from '../components/PropertyListing';

export default function Home() {
  return (
    <main className=" bg-white flex min-h-screen flex-col items-center p-12">
      <img src="/OMH.png" alt="OMH Image" className="w-45 h-45 -mt-20 -mb-20" />       
      <PropertyList/>
    </main>
  )
}
