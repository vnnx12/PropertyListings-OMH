"use client"
import { useState, useEffect } from 'react';
import CircleLoader from './CircleLoader';
import '../assets/css/custom-radio.css';

type Property = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageurl: string;
  type: number;
};

const PropertyList = () => {
  // State management
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [selectedType, setSelectedType] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false); // State for controlling the visibility of the button

  const sortProperties = (properties: Property[], sortOrder: string) => {
    const sortedProperties = [...properties];
    if (sortOrder === "lowest") {
      return sortedProperties.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highest") {
      return sortedProperties.sort((a, b) => b.price - a.price);
    }
    return sortedProperties;
  };
// Fetch properties 
  const fetchProperties = (limit: number, offset: number, loadmore: boolean) => {
    setLoading(true);
    let api_url = selectedType > -1 ? 
      `https://m9ojazlunf.execute-api.ap-southeast-1.amazonaws.com/test?limit=${limit}&offset=${offset}&type=${selectedType}` : 
      `https://m9ojazlunf.execute-api.ap-southeast-1.amazonaws.com/test?limit=${limit}&offset=${offset}`; 
    
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        let newProperties = loadmore ? [...displayedProperties, ...data.list] : data.list;
        if (sortOption) {
          newProperties = sortProperties(newProperties, sortOption);
        }
        setDisplayedProperties(newProperties);
        setTotalProperties(data.totalProperties);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  //smoothly scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);


  //sorting option changes
  useEffect(() => {
    const sortedProperties = sortProperties(displayedProperties, sortOption);
    setDisplayedProperties(sortedProperties);
  }, [sortOption]);

  //the selected type
  useEffect(() => {
    fetchProperties(10, 0, false);
  }, [selectedType]);

  //infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile || loading || displayedProperties.length >= totalProperties) {
        return;
      }
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
        return;
      }
      loadMore();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, displayedProperties, isMobile]);


  //screen width for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadMore = () => {
    fetchProperties(4, displayedProperties.length, true);
  };

  const selectType = (type: number) => {
    setSelectedType(type);
  };

  //error handling
  if (error) return <p>Error: {error}</p>;


  function getTypeLabel(type: number): string {
    switch(type) {
      case 0: return "Studio";
      case 1: return "1-Bedroom";
      case 2: return "2-Bedroom";
      case 3: return "3-Bedroom";
      case 4: return "4-Bedroom";
      default: return "Unknown Type";
    }
  }
  

  return (
    <>  
      {!loading && (  
        <div className="w-full m-auto">
          <div className='mt-10 text-center flex flex-wrap justify-center'>
            <input type="radio" className='button-radio' name="room_type" id="all" value="-1" onChange={() => selectType(-1)} checked={selectedType === -1} />
            <label htmlFor="all">All</label>
            <input type="radio" className='button-radio' name="room_type" id="studio" value="0" onChange={() => selectType(0)} checked={selectedType === 0}/>
            <label htmlFor="studio">Studio</label>
            <input type="radio" className='button-radio' name="room_type" id="1_bedroom" value="1" onChange={() => selectType(1)} checked={selectedType === 1}/>
            <label htmlFor="1_bedroom">1 Bedroom</label>
            <input type="radio" className='button-radio' name="room_type" id="2_bedroom" value="2" onChange={() => selectType(2)} checked={selectedType === 2}/>
            <label htmlFor="2_bedroom">2 Bedroom</label>
            <input type="radio" className='button-radio' name="room_type" id="3_bedroom" value="3" onChange={() => selectType(3)} checked={selectedType === 3}/>
            <label htmlFor="3_bedroom">3 Bedroom</label>
            <input type="radio" className='button-radio' name="room_type" id="4_bedroom" value="4" onChange={() => selectType(4)} checked={selectedType === 4}/>
            <label htmlFor="4_bedroom">4 Bedroom or more</label>
          </div>
          
        </div>
      )}
        <div className="mt-7 text-gray-400 flex justify-between items-center w-full mx-auto">
            <div>
                <span className="text-orange-500 font-semibold"> {displayedProperties.length} </span> of
                <span className="text-orange-500 font-semibold"> {totalProperties} </span> Listings
            </div>
            <div>
                <select
                    onChange={(e) => setSortOption(e.target.value)}  
                    id="sort"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="" disabled selected>Sort by</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                </select>
            </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-5">
          {displayedProperties.map((property) => (
              <div key={property.id} className="transform transition duration-300 hover:scale-90">
                  <img
                      className="rounded-md object-cover mb-4 mt-5"
                      src={property.imageurl}
                      alt={property.title}
                      style={{ height: '300px', width: '100%' }}
                  />
                  
                  <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{property.title}</h2>
                      <span className="text-sm font-normal text-orange-500">{getTypeLabel(property.type)}</span>
                  </div>
                  <p className="text-gray-500 ">{property.description}</p>
                  <p className="text-orange-500" >${property.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
          ))}
        </div>


      {loading && (
        <div><CircleLoader/></div>
      )}

      {!isMobile && !loading && displayedProperties.length < totalProperties && (
        <>
          <div className='mt-10'>
            <button 
              type="button"
              className="text-base bg-orange-500 text-white rounded-md p-3 hover:bg-white hover:text-orange-500 border border-orange-500 hover:border-orange-500 transition duration-300 ease-in-out"
              onClick={loadMore}
            >
              Load More
            </button>
          </div>
        </>
        
      )}
       {showScrollTop && (
        <button 
          onClick={scrollToTop}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
          className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 focus:outline-none"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default PropertyList;














