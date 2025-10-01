// Common route stops database for Kerala KSRTC routes
const ROUTE_STOPS = {
  // Iritty - Thalassery route
  'IRT-TLY': {
    name: 'Iritty to Thalassery',
    stops: [
      { name: 'Iritty', lat: 11.9833, lng: 75.6167 },
      { name: 'Peravoor', lat: 11.9500, lng: 75.5833 },
      { name: 'Koothparamba', lat: 11.9333, lng: 75.5667 },
      { name: 'Mattannur', lat: 11.9167, lng: 75.5500 },
      { name: 'Panoor', lat: 11.8833, lng: 75.5167 },
      { name: 'Thalassery', lat: 11.7500, lng: 75.4833 }
    ]
  },
  // Kannur - Thalassery route
  'KNR-TLY': {
    name: 'Kannur to Thalassery',
    stops: [
      { name: 'Kannur', lat: 11.8745, lng: 75.3704 },
      { name: 'Thalassery', lat: 11.7500, lng: 75.4833 }
    ]
  },
  // Kannur - Kozhikode route
  'KNR-KKD': {
    name: 'Kannur to Kozhikode',
    stops: [
      { name: 'Kannur', lat: 11.8745, lng: 75.3704 },
      { name: 'Thalassery', lat: 11.7500, lng: 75.4833 },
      { name: 'Vadakara', lat: 11.6067, lng: 75.5950 },
      { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 }
    ]
  },
  // Thiruvananthapuram - Kochi route
  'TVM-EKM': {
    name: 'Thiruvananthapuram to Kochi',
    stops: [
      { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
      { name: 'Kollam', lat: 8.8932, lng: 76.6141 },
      { name: 'Alappuzha', lat: 9.4981, lng: 76.3388 },
      { name: 'Cherthala', lat: 9.6843, lng: 76.3350 },
      { name: 'Ernakulam', lat: 9.9312, lng: 76.2673 }
    ]
  },
  // Ernakulam - Thrissur route
  'EKM-TRS': {
    name: 'Ernakulam to Thrissur',
    stops: [
      { name: 'Ernakulam', lat: 9.9312, lng: 76.2673 },
      { name: 'Aluva', lat: 10.1081, lng: 76.3522 },
      { name: 'Chalakudy', lat: 10.3051, lng: 76.3310 },
      { name: 'Thrissur', lat: 10.5276, lng: 76.2144 }
    ]
  }
};

// Export for use in frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROUTE_STOPS };
}
