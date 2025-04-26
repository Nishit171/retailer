import { useState, useEffect } from "react"
import { Search, PhoneIcon as WhatsApp, LocateOffIcon as LocationOn, ListFilterIcon as FilterList } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

// Mock data for retailers
const mockRetailers = [
  {
    id: 1,
    name: "Green Leaf Grocery",
    category: "Grocery",
    location: "Indiranagar, Bangalore",
    latitude: 12.9716,
    longitude: 77.6412,
    phoneNumber: "919812345001",
  },
  {
    id: 2,
    name: "ElectroMax",
    category: "Electronics",
    location: "Koramangala, Bangalore",
    latitude: 12.9352,
    longitude: 77.6141,
    phoneNumber: "919812345002",
  },
  {
    id: 3,
    name: "Daily Needs",
    category: "Grocery",
    location: "Whitefield, Bangalore",
    latitude: 12.9698,
    longitude: 77.7499,
    phoneNumber: "919812345003",
  },
  {
    id: 4,
    name: "Trendy Threads",
    category: "Clothing",
    location: "BTM Layout, Bangalore",
    latitude: 12.9166,
    longitude: 77.6101,
    phoneNumber: "919812345004",
  },
  {
    id: 5,
    name: "Fresh Mart",
    category: "Grocery",
    location: "Malleshwaram, Bangalore",
    latitude: 13.0058,
    longitude: 77.5701,
    phoneNumber: "919812345005",
  },
  {
    id: 6,
    name: "City Medicos",
    category: "Medicines",
    location: "Rajajinagar, Bangalore",
    latitude: 12.9916,
    longitude: 77.5521,
    phoneNumber: "919812345006",
  },
  {
    id: 7,
    name: "BookHub",
    category: "Stationery",
    location: "Hebbal, Bangalore",
    latitude: 13.0358,
    longitude: 77.597,
    phoneNumber: "919812345007",
  },
  {
    id: 8,
    name: "Mediplus",
    category: "Medicines",
    location: "Jayanagar, Bangalore",
    latitude: 12.925,
    longitude: 77.5938,
    phoneNumber: "919812345008",
  },
  {
    id: 9,
    name: "Gadget World",
    category: "Electronics",
    location: "HSR Layout, Bangalore",
    latitude: 12.9116,
    longitude: 77.6413,
    phoneNumber: "919812345009",
  },
  {
    id: 10,
    name: "Style Stop",
    category: "Clothing",
    location: "Electronic City, Bangalore",
    latitude: 12.8382,
    longitude: 77.6778,
    phoneNumber: "919812345010",
  },
  {
    id: 11,
    name: "Delhi Fresh Store",
    category: "Grocery",
    location: "Lajpat Nagar, Delhi",
    latitude: 28.5675,
    longitude: 77.2433,
    phoneNumber: "919812345011",
  },
  {
    id: 12,
    name: "Capital Pharmacy",
    category: "Medicines",
    location: "Karol Bagh, Delhi",
    latitude: 28.6512,
    longitude: 77.1909,
    phoneNumber: "919812345012",
  },
  {
    id: 13,
    name: "Gadget Hub",
    category: "Electronics",
    location: "Saket, Delhi",
    latitude: 28.5245,
    longitude: 77.2066,
    phoneNumber: "919812345013",
  },
  {
    id: 14,
    name: "Urban Styles",
    category: "Clothing",
    location: "Dwarka, Delhi",
    latitude: 28.5733,
    longitude: 77.0126,
    phoneNumber: "919812345014",
  },
  {
    id: 15,
    name: "EasyMart",
    category: "Grocery",
    location: "Connaught Place, Delhi",
    latitude: 28.6315,
    longitude: 77.2167,
    phoneNumber: "919812345015",
  },
  {
    id: 16,
    name: "Wellness Pharma",
    category: "Medicines",
    location: "Rohini, Delhi",
    latitude: 28.736,
    longitude: 77.1118,
    phoneNumber: "919812345016",
  },
  {
    id: 17,
    name: "Stationery Point",
    category: "Stationery",
    location: "Vasant Kunj, Delhi",
    latitude: 28.519,
    longitude: 77.1565,
    phoneNumber: "919812345017",
  },
  {
    id: 18,
    name: "24x7 Pharmacy",
    category: "Medicines",
    location: "Preet Vihar, Delhi",
    latitude: 28.6347,
    longitude: 77.2963,
    phoneNumber: "919812345018",
  },
  {
    id: 19,
    name: "Spice Mart",
    category: "Grocery",
    location: "Janakpuri, Delhi",
    latitude: 28.6237,
    longitude: 77.085,
    phoneNumber: "919812345019",
  },
  {
    id: 20,
    name: "Fashion Fiesta",
    category: "Clothing",
    location: "Shahdara, Delhi",
    latitude: 28.6786,
    longitude: 77.2892,
    phoneNumber: "919812345020",
  },
]

// Get all unique categories from the mock data
const allCategories = ["All", ...new Set(mockRetailers.map((retailer) => retailer.category))]

// Get all unique cities from the mock data
const getCityFromLocation = (location) => {
  return location.split(", ")[1]
}

// Function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

export default function RetailerList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCity, setSelectedCity] = useState("All")
  const [userLocation, setUserLocation] = useState(null)
  const [retailers, setRetailers] = useState(mockRetailers)
  const [isLoading, setIsLoading] = useState(true)

  // Get user's geolocation
  useEffect(() => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoading(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLoading(false)
    }
  }, [])

  // Calculate distances when user location is available
  useEffect(() => {
    if (userLocation) {
      const retailersWithDistance = mockRetailers.map((retailer) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          retailer.latitude,
          retailer.longitude,
        )
        return { ...retailer, distance }
      })
      setRetailers(retailersWithDistance)
    }
  }, [userLocation])

  // Filter retailers based on search query and selected category
  useEffect(() => {
    let filteredRetailers = userLocation
      ? mockRetailers.map((retailer) => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            retailer.latitude,
            retailer.longitude,
          )
          return { ...retailer, distance }
        })
      : mockRetailers

    // Filter by search query
    if (searchQuery) {
      filteredRetailers = filteredRetailers.filter((retailer) =>
        retailer.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filteredRetailers = filteredRetailers.filter((retailer) => retailer.category === selectedCategory)
    }

    // Filter by city
    if (selectedCity !== "All") {
      filteredRetailers = filteredRetailers.filter(
        (retailer) => getCityFromLocation(retailer.location) === selectedCity,
      )
    }

    // Sort by distance if user location is available
    if (userLocation) {
      filteredRetailers.sort((a, b) => a.distance - b.distance)
    }

    setRetailers(filteredRetailers)
  }, [searchQuery, selectedCategory, selectedCity, userLocation])

  // Get all unique cities
  const cities = ["All", ...new Set(mockRetailers.map((retailer) => getCityFromLocation(retailer.location)))]

  // Group retailers by location area (not city)
  const getLocationArea = (location) => {
    return location.split(", ")[0]
  }

  const retailersByArea = retailers.reduce((acc, retailer) => {
    const area = getLocationArea(retailer.location)
    if (!acc[area]) {
      acc[area] = []
    }
    acc[area].push(retailer)
    return acc
  }, {})

  // Handle WhatsApp click
  const handleWhatsAppClick = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}?text=Hi`, "_blank")
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Retailers</h1>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search retailers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FilterList className="h-5 w-5" />
          <span className="font-medium">Filter:</span>
        </div>

        <div className="flex gap-2">
          {/* Category Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedCategory} <FilterList className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Filter by Category</SheetTitle>
                <SheetDescription>Select a category to filter retailers</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {allCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => {
                      setSelectedCategory(category)
                    }}
                    className="justify-start"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* City Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedCity} <LocationOn className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Filter by City</SheetTitle>
                <SheetDescription>Select a city to filter retailers</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {cities.map((city) => (
                  <Button
                    key={city}
                    variant={selectedCity === city ? "default" : "outline"}
                    onClick={() => {
                      setSelectedCity(city)
                    }}
                    className="justify-start"
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Retailer List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">Loading retailers...</div>
        ) : retailers.length === 0 ? (
          <div className="text-center py-8">No retailers found</div>
        ) : (
          Object.entries(retailersByArea).map(([area, areaRetailers]) => (
            <div key={area}>
              <div className="flex items-center gap-2 mb-2">
                <LocationOn className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">{area}</h2>
              </div>
              <div className="space-y-3">
                {areaRetailers.map((retailer) => (
                  <Card key={retailer.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{retailer.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {retailer.category}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <LocationOn className="h-3 w-3 mr-1" />
                            {retailer.location}
                          </p>
                          {userLocation && retailer.distance && (
                            <p className="text-xs text-muted-foreground mt-1">{retailer.distance.toFixed(1)} km away</p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white border-0"
                          onClick={() => handleWhatsAppClick(retailer.phoneNumber)}
                        >
                          <WhatsApp className="h-5 w-5" />
                          <span className="sr-only">Contact on WhatsApp</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
