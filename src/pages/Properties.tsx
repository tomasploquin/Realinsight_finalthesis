
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomButton } from '@/components/ui/CustomButton';
import { Search, Filter, MapPin, Calendar, ArrowUpRight, Bookmark, Building, Home, Warehouse, Building2 } from 'lucide-react';

// Mock data for previously analyzed properties
const propertyData = [
  {
    id: "prop-001",
    address: "123 Main Street, Springfield",
    propertyType: "singleFamily",
    price: "$450,000",
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2200,
    yearBuilt: 2002,
    dateAnalyzed: "May 15, 2023",
    score: 78,
    capRate: "5.6%",
    cashOnCash: "8.2%",
    status: "High Potential",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "prop-002",
    address: "456 Oak Avenue, Riverdale",
    propertyType: "multiFamily",
    price: "$780,000",
    bedrooms: 8,
    bathrooms: 5,
    squareFeet: 4500,
    yearBuilt: 1995,
    dateAnalyzed: "June 2, 2023",
    score: 62,
    capRate: "4.8%",
    cashOnCash: "7.1%",
    status: "Medium Potential",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "prop-003",
    address: "789 Pine Road, Lakeside",
    propertyType: "commercial",
    price: "$1,250,000",
    bedrooms: 0,
    bathrooms: 4,
    squareFeet: 6800,
    yearBuilt: 2010,
    dateAnalyzed: "June 23, 2023",
    score: 85,
    capRate: "6.3%",
    cashOnCash: "9.4%",
    status: "High Potential",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "prop-004",
    address: "321 Maple Court, Hillcrest",
    propertyType: "singleFamily",
    price: "$525,000",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1950,
    yearBuilt: 2015,
    dateAnalyzed: "July 10, 2023",
    score: 73,
    capRate: "5.1%",
    cashOnCash: "7.8%",
    status: "Medium Potential",
    image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
  },
  {
    id: "prop-005",
    address: "987 Cedar Lane, Westfield",
    propertyType: "industrial",
    price: "$1,750,000",
    bedrooms: 0,
    bathrooms: 2,
    squareFeet: 12000,
    yearBuilt: 2005,
    dateAnalyzed: "August 5, 2023",
    score: 81,
    capRate: "7.2%",
    cashOnCash: "10.5%",
    status: "High Potential",
    image: "https://images.unsplash.com/photo-1581922814484-0b48460b7010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "prop-006",
    address: "654 Birch Street, Eastdale",
    propertyType: "land",
    price: "$350,000",
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 45000,
    yearBuilt: 0,
    dateAnalyzed: "September 12, 2023",
    score: 68,
    capRate: "3.8%",
    cashOnCash: "5.7%",
    status: "Medium Potential",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80"
  }
];

const getPropertyTypeIcon = (type: string) => {
  switch (type) {
    case 'singleFamily':
      return <Home className="h-4 w-4" />;
    case 'multiFamily':
      return <Building className="h-4 w-4" />;
    case 'commercial':
      return <Building2 className="h-4 w-4" />;
    case 'industrial':
      return <Warehouse className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
};

const Properties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("dateDesc");
  
  // Filter and sort properties
  const filteredProperties = propertyData
    .filter(property => 
      // Search filter
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
      // Type filter
      (filterType === "all" || property.propertyType === filterType)
    )
    .sort((a, b) => {
      // Sort logic
      switch (sortBy) {
        case "scoreDesc":
          return b.score - a.score;
        case "scoreAsc":
          return a.score - b.score;
        case "priceDesc":
          return parseFloat(b.price.replace(/[^0-9.-]+/g, "")) - parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
        case "priceAsc":
          return parseFloat(a.price.replace(/[^0-9.-]+/g, "")) - parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
        case "dateAsc":
          return new Date(a.dateAnalyzed).getTime() - new Date(b.dateAnalyzed).getTime();
        case "dateDesc":
        default:
          return new Date(b.dateAnalyzed).getTime() - new Date(a.dateAnalyzed).getTime();
      }
    });

  return (
    <Layout>
      <section className="py-8 px-4">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Property Analysis Dashboard</h1>
            <p className="text-muted-foreground">Review and compare your previous property analyses</p>
          </div>
          
          {/* Filters and search */}
          <div className="mb-8 glass-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search by address" 
                  className="pl-10 bg-white/80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              
              {/* Property Type Filter */}
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-white/80">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="singleFamily">Single Family</SelectItem>
                    <SelectItem value="multiFamily">Multi Family</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sort */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateDesc">Newest First</SelectItem>
                    <SelectItem value="dateAsc">Oldest First</SelectItem>
                    <SelectItem value="scoreDesc">Highest Score</SelectItem>
                    <SelectItem value="scoreAsc">Lowest Score</SelectItem>
                    <SelectItem value="priceDesc">Price (High to Low)</SelectItem>
                    <SelectItem value="priceAsc">Price (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* View Tabs */}
          <Tabs defaultValue="grid" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>
            
            {/* Grid View */}
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-on-scroll animate-fade-in-up">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.address} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <div className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-white ${property.score >= 80 ? 'bg-green-500' : property.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}>
                          {property.score}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-black/0 text-white p-3">
                        <div className="flex items-center text-sm">
                          {getPropertyTypeIcon(property.propertyType)}
                          <span className="ml-1 capitalize">
                            {property.propertyType === 'singleFamily' ? 'Single Family' : 
                             property.propertyType === 'multiFamily' ? 'Multi Family' : 
                             property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg truncate">{property.address}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1" /> 
                        Analyzed: {property.dateAnalyzed}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-medium">{property.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cap Rate</p>
                          <p className="font-medium">{property.capRate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CoC Return</p>
                          <p className="font-medium">{property.cashOnCash}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium">{property.status}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <CustomButton
                        variant="accent"
                        size="sm"
                        className="w-full text-center justify-center rounded-md"
                      >
                        View Analysis <ArrowUpRight className="ml-1 h-4 w-4" />
                      </CustomButton>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Detailed View */}
            <TabsContent value="detailed">
              <div className="space-y-4">
                {filteredProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden animate-on-scroll animate-fade-in-up">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-48 relative">
                        <img 
                          src={property.image} 
                          alt={property.address} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <div className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-white ${property.score >= 80 ? 'bg-green-500' : property.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}>
                            {property.score}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="mb-3">
                          <h3 className="text-xl font-semibold mb-1">{property.address}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            {getPropertyTypeIcon(property.propertyType)}
                            <span className="ml-1 mr-3 capitalize">
                              {property.propertyType === 'singleFamily' ? 'Single Family' : 
                               property.propertyType === 'multiFamily' ? 'Multi Family' : 
                               property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                            </span>
                            <Calendar className="h-3.5 w-3.5 ml-1 mr-1" /> 
                            Analyzed: {property.dateAnalyzed}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-muted-foreground text-sm">Price</p>
                            <p className="font-medium">{property.price}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">Size</p>
                            <p className="font-medium">{property.squareFeet.toLocaleString()} sq ft</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">Cap Rate</p>
                            <p className="font-medium">{property.capRate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">Cash on Cash</p>
                            <p className="font-medium">{property.cashOnCash}</p>
                          </div>
                        </div>
                        
                        <div className="md:flex items-center justify-between">
                          <div className="mb-3 md:mb-0">
                            <span className="text-sm mr-3">
                              <span className="text-muted-foreground">Status:</span> {property.status}
                            </span>
                            {property.bedrooms > 0 && (
                              <span className="text-sm mr-3">
                                <span className="text-muted-foreground">Beds:</span> {property.bedrooms}
                              </span>
                            )}
                            {property.bathrooms > 0 && (
                              <span className="text-sm">
                                <span className="text-muted-foreground">Baths:</span> {property.bathrooms}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <CustomButton
                              variant="outline"
                              size="sm"
                              className="rounded-md"
                            >
                              <Bookmark className="mr-1 h-4 w-4" /> Save
                            </CustomButton>
                            <CustomButton
                              variant="accent"
                              size="sm"
                              className="rounded-md"
                            >
                              View Analysis <ArrowUpRight className="ml-1 h-4 w-4" />
                            </CustomButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Properties;
