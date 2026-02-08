
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Car, 
  MapPin, 
  ChevronRight, 
  Star, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  DollarSign
} from 'lucide-react';
import { ServiceCategory, BookingDetails, AppStep, CleanerBid, Location } from './types';
import { getCleanerBids } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('SERVICE_SELECT');
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<BookingDetails>({
    category: ServiceCategory.HOUSE,
    subType: '',
    userPrice: 0,
    location: { address: '' },
    additionalNotes: ''
  });
  const [bids, setBids] = useState<CleanerBid[]>([]);
  const [selectedBid, setSelectedBid] = useState<CleanerBid | null>(null);

  const handleServiceSelect = (cat: ServiceCategory) => {
    setDetails({ ...details, category: cat });
    setStep('DETAILS');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('LOCATION');
  };

  const handleLocationSubmit = async () => {
    setLoading(true);
    setStep('NEGOTIATION');
    const generatedBids = await getCleanerBids(details);
    setBids(generatedBids);
    setLoading(false);
  };

  const selectCleaner = (bid: CleanerBid) => {
    setSelectedBid(bid);
    setStep('CONFIRMED');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // In a real app, we would reverse geocode here
        setDetails(prev => ({
          ...prev,
          location: { address: `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})` }
        }));
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'SERVICE_SELECT':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">What do you need cleaned today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleServiceSelect(ServiceCategory.HOUSE)}
                className="p-6 bg-white border-2 border-transparent hover:border-blue-500 rounded-2xl shadow-sm transition-all group text-left"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Home className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">House Cleaning</h3>
                <p className="text-gray-500 text-sm">Professional home sanitation, dusting, and deep cleaning.</p>
              </button>
              <button 
                onClick={() => handleServiceSelect(ServiceCategory.CAR)}
                className="p-6 bg-white border-2 border-transparent hover:border-blue-500 rounded-2xl shadow-sm transition-all group text-left"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Car className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile Car Wash</h3>
                <p className="text-gray-500 text-sm">Exterior shine, interior detailing, and vacuuming at your spot.</p>
              </button>
            </div>
          </div>
        );

      case 'DETAILS':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-blue-600 cursor-pointer" onClick={() => setStep('SERVICE_SELECT')}>
              <ArrowLeft size={18} />
              <span className="font-medium">Change Service</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Service Details</h2>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {details.category === ServiceCategory.HOUSE ? 'Property Type/Size' : 'Vehicle Type'}
                </label>
                <input 
                  required
                  placeholder={details.category === ServiceCategory.HOUSE ? "e.g. 3 Bedroom Apartment" : "e.g. Toyota SUV"}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={details.subType}
                  onChange={e => setDetails({...details, subType: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number"
                    required
                    placeholder="Enter your budget"
                    className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={details.userPrice || ''}
                    onChange={e => setDetails({...details, userPrice: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Instructions (Optional)</label>
                <textarea 
                  placeholder="Any focus areas or special requests?"
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  value={details.additionalNotes}
                  onChange={e => setDetails({...details, additionalNotes: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </form>
          </div>
        );

      case 'LOCATION':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-2 text-blue-600 cursor-pointer" onClick={() => setStep('DETAILS')}>
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Details</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Where are you located?</h2>
            <div className="space-y-4">
              <button 
                onClick={getCurrentLocation}
                className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center gap-2 font-medium border border-blue-200"
              >
                <MapPin size={20} /> Use My Current Location
              </button>
              <div className="relative">
                <input 
                  placeholder="Enter street address manually"
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={details.location.address}
                  onChange={e => setDetails({...details, location: { address: e.target.value }})}
                />
              </div>
              <button 
                disabled={!details.location.address}
                onClick={handleLocationSubmit}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
              >
                Find Professional Cleaners <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case 'NEGOTIATION':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-800">Cleaner Offers</h2>
            <p className="text-gray-500">Professional cleaners in your area are bidding for your request.</p>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-gray-600 font-medium italic">Pa Spot is notifying nearby pros...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {bids.map((bid) => (
                  <div key={bid.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <img src={bid.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-blue-100" alt={bid.name} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg text-gray-800">{bid.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                <Star size={14} fill="currentColor" /> {bid.rating}
                              </span>
                              <span>{bid.completedJobs} jobs</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-blue-600">${bid.price}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock size={12} /> {bid.timeEstimate}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2 italic">"{bid.description}"</p>
                        <button 
                          onClick={() => selectCleaner(bid)}
                          className="mt-4 w-full bg-blue-50 text-blue-700 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all text-sm"
                        >
                          Accept Offer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && (
              <button 
                onClick={() => setStep('DETAILS')}
                className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Change your offer price
              </button>
            )}
          </div>
        );

      case 'CONFIRMED':
        return (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={64} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left max-w-sm mx-auto">
              <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Service Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Professional</span>
                  <span className="font-semibold">{selectedBid?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service</span>
                  <span className="font-semibold capitalize">{details.category.toLowerCase()} Clean</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-bold text-blue-600">${selectedBid?.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Address</span>
                  <span className="font-medium text-right max-w-[150px] truncate">{details.location.address}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Your cleaner is preparing and will arrive at the scheduled time. You can track their status in the app.</p>
            <button 
              onClick={() => {
                setStep('SERVICE_SELECT');
                setDetails({ category: ServiceCategory.HOUSE, subType: '', userPrice: 0, location: { address: '' }, additionalNotes: '' });
                setSelectedBid(null);
              }}
              className="w-full bg-gray-800 text-white p-4 rounded-xl font-semibold shadow-lg hover:bg-black transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Pa Spot <span className="text-blue-600 font-medium">Cleaning</span>
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
            <img src="https://picsum.photos/seed/user/100/100" alt="Profile" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-6 py-8">
        {renderStep()}
      </main>

      {/* Footer Nav (Simplified) */}
      <nav className="bg-white border-t border-gray-200 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto h-16 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <Home size={22} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Clock size={22} />
            <span className="text-[10px] font-medium">History</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Star size={22} />
            <span className="text-[10px] font-medium">Rewards</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
