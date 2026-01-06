import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Grid,
  Button,
  Tabs,
  Tab,
  Skeleton,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  DeliveryDining as DeliveryIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import api from '../services/mockApi';

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [openFilters, setOpenFilters] = useState(false);

  // Fetch restaurants from mock API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await api.getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter and sort restaurants
  const filteredRestaurants = React.useMemo(() => {
    return restaurants
      .filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'offers') return matchesSearch && restaurant.discount > 0;
        return matchesSearch && restaurant.cuisine.toLowerCase().includes(activeTab);
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'deliveryTime') {
          const timeA = parseInt(a.deliveryTime.split('-')[0]);
          const timeB = parseInt(b.deliveryTime.split('-')[0]);
          return timeA - timeB;
        }
        return 0;
      });
  }, [restaurants, searchTerm, activeTab, sortBy]);

  // Get unique cuisines for filter tabs
  const cuisines = React.useMemo(() => {
    const allCuisines = new Set();
    restaurants.forEach(restaurant => {
      restaurant.cuisine.split(',').forEach(cuisine => {
        allCuisines.add(cuisine.trim());
      });
    });
    return Array.from(allCuisines);
  }, [restaurants]);

  // Handle restaurant click
  const handleRestaurantClick = (restaurantId) => {
    navigate(`/menu?restaurant=${restaurantId}`);
  };

  // Render loading skeleton
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant="rectangular" height={140} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
            <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  // Render restaurant cards
  const renderRestaurants = () => {
    if (filteredRestaurants.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8, width: '100%' }}>
          <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No restaurants found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter to find what you're looking for.
          </Typography>
        </Box>
      );
    }

    return filteredRestaurants.map((restaurant) => (
      <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3,
            }
          }}
        >
          <CardActionArea 
            onClick={() => handleRestaurantClick(restaurant.id)}
            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <CardMedia
              component="img"
              height="140"
              image={restaurant.image}
              alt={restaurant.name}
              sx={{ width: '100%' }}
            />
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {restaurant.name}
                </Typography>
                <Chip 
                  icon={<StarIcon fontSize="small" />} 
                  label={restaurant.rating} 
                  size="small" 
                  color="primary"
                  sx={{ ml: 1, fontWeight: 'bold' }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" noWrap>
                {restaurant.cuisine}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DeliveryIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {restaurant.deliveryTime}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    ₹{restaurant.minOrder} min order
                  </Typography>
                </Box>
              </Box>
              
              {restaurant.discount > 0 && (
                <Chip 
                  icon={<OfferIcon fontSize="small" />}
                  label={`${restaurant.discount}% OFF`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        borderRadius: 2, 
        p: 4, 
        mb: 4,
        backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
        boxShadow: 3
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Hungry? You're in the right place
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px' }}>
          Order from your favorite restaurants and track your food in real-time
        </Typography>
        
        {/* Search Bar */}
        <Paper 
          component="form" 
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            maxWidth: '600px',
            bgcolor: 'white',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 1
          }}
        >
          <InputAdornment position="start" sx={{ pl: 2, color: 'text.secondary' }}>
            <SearchIcon />
          </InputAdornment>
          <TextField
            fullWidth
            placeholder="Search for restaurants and food"
            variant="standard"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              '& .MuiInputBase-input': {
                p: 2,
              },
              '& .MuiInput-underline:before': {
                borderBottom: 'none',
              },
              '& .MuiInput-underline:after': {
                borderBottom: 'none',
              },
              '&:hover .MuiInput-underline:before': {
                borderBottom: 'none',
              },
            }}
          />
        </Paper>
      </Box>

      {/* Filters and Sort */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Tab 
            label="All" 
            value="all" 
            sx={{ 
              minWidth: 'auto', 
              px: 2,
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              }
            }} 
          />
          <Tab 
            label="Offers" 
            value="offers" 
            icon={<OfferIcon fontSize="small" />} 
            iconPosition="start"
            sx={{ 
              minWidth: 'auto',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              }
            }}
          />
          {cuisines.slice(0, 6).map((cuisine) => (
            <Tab 
              key={cuisine} 
              label={cuisine} 
              value={cuisine.toLowerCase()}
              sx={{ 
                minWidth: 'auto',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 'bold'
                }
              }}
            />
          ))}
        </Tabs>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<SortIcon />}
            onClick={() => setSortBy(prev => prev === 'rating' ? 'deliveryTime' : 'rating')}
            sx={{ 
              textTransform: 'none',
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'action.hover'
              }
            }}
          >
            {sortBy === 'rating' ? 'Top Rated' : 'Fastest Delivery'}
          </Button>
          
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<FilterIcon />}
            onClick={() => setOpenFilters(!openFilters)}
            sx={{ 
              textTransform: 'none',
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'action.hover'
              }
            }}
          >
            Filters
          </Button>
        </Box>
      </Box>

      {/* Additional Filters (Collapsible) */}
      {openFilters && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            MORE FILTERS
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['Pure Veg', 'Non-Veg', '₹0-₹300', '₹300-₹600', 'Above ₹600', 'Ratings 4.0+'].map((filter) => (
              <Chip 
                key={filter} 
                label={filter} 
                variant="outlined"
                onClick={() => {}}
                sx={{ 
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              />
            ))}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={() => setOpenFilters(false)}>
              Cancel
            </Button>
            <Button variant="contained" size="small" onClick={() => setOpenFilters(false)}>
              Apply
            </Button>
          </Box>
        </Paper>
      )}

      {/* Restaurant Grid */}
      <Grid container spacing={3}>
        {loading ? renderSkeletons() : renderRestaurants()}
      </Grid>
    </Container>
  );
};

export default Home;