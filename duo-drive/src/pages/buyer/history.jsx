import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Car, 
  MessageSquare, 
  Clock, 
  Search, 
  ChevronRight,
  Phone,
  Mail,
  History as HistoryIcon,
  Sparkles,
  
  User
} from "lucide-react";
import { getContacts, getFilterHistory, deleteFilterHistory } from "../../utils/api";

const BuyerHistory = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [filterHistory, setFilterHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentUser, setCurrentUser] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem("userName");
      
      if (!username) {
        console.error("No username in localStorage");
        setCurrentUser("");
        setLoading(false);
        return;
      }
      
      setCurrentUser(username);
      console.log(` Fetching history for user: ${username}`);
      
      // 1. FETCH AND PROCESS CONTACTS (Test Drives & Inquiries)
      const contactsData = await getContacts();
      console.log(" Raw contacts data:", contactsData);
      
      // Filter contacts by username (case-insensitive)
      const userContacts = contactsData.filter(contact => {
        if (!contact.name) return false;
        return contact.name.toLowerCase().trim() === username.toLowerCase().trim();
      });
      
      console.log(`👤 Found ${userContacts.length} contacts for user ${username}`);
      
      // Separate test drives and inquiries
      const testDrivesList = userContacts.filter(contact => {
        // Check subject_type field
        if (contact.subject_type) {
          const subjectLower = contact.subject_type.toLowerCase();
          return subjectLower.includes("test") || subjectLower.includes("drive");
        }
        // Check message field
        if (contact.message) {
          return contact.message.toLowerCase().includes("test drive");
        }
        return false;
      });
      
      const inquiriesList = userContacts.filter(contact => {
        // If it's not a test drive, it's an inquiry
        if (contact.subject_type) {
          const subjectLower = contact.subject_type.toLowerCase();
          return !subjectLower.includes("test") && !subjectLower.includes("drive");
        }
        return true;
      });
      
      console.log(`Test drives: ${testDrivesList.length}`);
      console.log(`Inquiries: ${inquiriesList.length}`);
      
      setTestDrives(testDrivesList);
      setInquiries(inquiriesList);
      
      // 2. FETCH AND PROCESS SEARCH HISTORY FROM YOUR API
      try {
        const apiHistoryData = await getFilterHistory();
        console.log(" API search history:", apiHistoryData);
        
        // Filter searches by username (your API includes username field)
        const userSearches = apiHistoryData.filter(item => {
          // Check if username matches (case-insensitive)
          if (item.username && item.username.toLowerCase() === username.toLowerCase()) {
            return true;
          }
          return false;
        });
        
        console.log(` Found ${userSearches.length} searches for user ${username}`);
        
        // Sort by most recent and limit to 10
        const sortedHistory = userSearches.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        }).slice(0, 10);
        
        setFilterHistory(sortedHistory);
        
      } catch (apiError) {
        console.error(" Error fetching search history:", apiError);
        setFilterHistory([]);
      }
      
      // Set debug info
      setDebugInfo(`
        User: ${username}
        Total Contacts: ${contactsData.length}
        Your Contacts: ${userContacts.length}
        Your Test Drives: ${testDrivesList.length}
        Your Inquiries: ${inquiriesList.length}
        Your Searches: ${filterHistory.length}
      `);
      
    } catch (error) {
      console.error(" Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteFilterHistory(id);
      setFilterHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting history:", error);
      alert("Failed to delete history item");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const allActivities = [
    ...testDrives.map(td => ({ 
      ...td, 
      type: 'test_drive', 
      icon: Car, 
      color: 'teal', 
      sortDate: td.created_at || td.date,
      car_name: td.car_name || td.car_model || td.subject || "Vehicle"
    })),
    ...inquiries.map(inq => ({ 
      ...inq, 
      type: 'inquiry', 
      icon: MessageSquare, 
      color: 'blue', 
      sortDate: inq.created_at || inq.date,
      car_name: inq.car_name || inq.car_model || inq.subject || "Vehicle"
    })),
    ...filterHistory.map(fh => ({ 
      ...fh, 
      type: 'search', 
      icon: Search, 
      color: 'gray', 
      sortDate: fh.created_at,
      source: 'api'
    }))
  ].sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));

  const filteredActivities = activeTab === "all" 
    ? allActivities 
    : allActivities.filter(activity => {
        if (activeTab === "drives") return activity.type === "test_drive";
        if (activeTab === "inquiries") return activity.type === "inquiry";
        if (activeTab === "searches") return activity.type === "search";
        return true;
      });

  const stats = {
    testDrives: testDrives.length,
    inquiries: inquiries.length,
    searches: filterHistory.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your activity history...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="text-red-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Please Sign In</h3>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your history
          </p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors w-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-700 p-3 rounded-xl">
              <HistoryIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Activity History</h1>
              <p className="text-gray-600">Track your car search journey</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                  <User size={14} />
                  <span className="text-sm font-bold">{currentUser}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {testDrives.length + inquiries.length + filterHistory.length} total activities
                </span>
              </div>
            </div>
          </div>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <details>
                <summary className="cursor-pointer text-sm text-gray-600 font-medium">Debug Info</summary>
                <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">{debugInfo}</pre>
              </details>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Test Drives</p>
                <p className="text-4xl font-bold text-teal-700">{stats.testDrives}</p>
              </div>
              <div className="bg-teal-50 text-teal-700 p-4 rounded-xl">
                <Car size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Inquiries</p>
                <p className="text-4xl font-bold text-blue-700">{stats.inquiries}</p>
              </div>
              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl">
                <MessageSquare size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Saved Searches</p>
                <p className="text-4xl font-bold text-gray-700">{stats.searches}</p>
              </div>
              <div className="bg-gray-100 text-gray-700 p-4 rounded-xl">
                <Search size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2">
          <div className="flex gap-2">
            {[
              { id: "all", label: "All Activity", icon: <Sparkles size={18} /> },
              { id: "drives", label: "Test Drives", icon: <Car size={18} /> },
              { id: "inquiries", label: "Inquiries", icon: <MessageSquare size={18} /> },
              { id: "searches", label: "Searches", icon: <Search size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id 
                    ? "bg-teal-700 text-white shadow-lg" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activity Found</h3>
              <p className="text-gray-600 mb-3">
                Start searching for cars or contacting sellers to see your history here.
              </p>
              <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full">
                <User size={14} className="text-teal-700" />
                <span className="text-sm font-bold text-teal-800">{currentUser}</span>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Your search history comes from our database and is tied to your account.
                </p>
              </div>
            </div>
          ) : (
            filteredActivities.map((activity, index) => (
              <ActivityCard 
                key={`${activity.type}-${activity.id || index}-${index}`}
                activity={activity}
                getTimeAgo={getTimeAgo}
                formatDate={formatDate}
                onDelete={activity.type === 'search' ? handleDeleteHistory : null}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Activity Card Component
const ActivityCard = ({ activity, getTimeAgo, formatDate, onDelete, currentUser }) => {
  const [expanded, setExpanded] = useState(false);

  const renderTestDrive = () => {
    const status = activity.status || "pending";
    const statusConfig = {
      pending: { color: "from-yellow-50 to-yellow-100", textColor: "text-yellow-800", label: "Pending" },
      confirmed: { color: "from-green-50 to-green-100", textColor: "text-green-800", label: "Confirmed" },
      completed: { color: "from-blue-50 to-blue-100", textColor: "text-blue-800", label: "Completed" },
      cancelled: { color: "from-red-50 to-red-100", textColor: "text-red-800", label: "Cancelled" }
    };
    const currentStatus = statusConfig[status] || statusConfig.pending;
    
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-teal-100 p-3 rounded-xl">
              <Car className="text-teal-700" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Test Drive Request</h3>
                  <p className="text-teal-700 font-semibold text-lg">{activity.car_name}</p>
                </div>
                <span className="text-sm text-gray-500">{getTimeAgo(activity.sortDate)}</span>
              </div>
              
              <div className="bg-teal-50 p-3 rounded-lg mb-3">
                <div className="flex items-center gap-2 text-teal-800">
                  <Calendar size={16} />
                  <span className="text-sm font-semibold">{formatDate(activity.sortDate)}</span>
                  {activity.preferred_time && (
                    <>
                      <Clock size={16} className="ml-2" />
                      <span className="text-sm font-semibold">{activity.preferred_time}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-teal-700 text-sm font-semibold hover:gap-2 transition-all"
              >
                {expanded ? "Hide details" : "View details"}
                <ChevronRight size={16} className={`transform transition-transform ${expanded ? "rotate-90" : ""}`} />
              </button>

              {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Your Information</p>
                    {activity.name && (
                      <p className="text-sm text-gray-700 font-medium">{activity.name}</p>
                    )}
                    {activity.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} />
                        <span className="text-sm">{activity.email}</span>
                      </div>
                    )}
                    {activity.phone_number && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} />
                        <span className="text-sm">{activity.phone_number}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-teal-600 mt-2">
                      <span className="text-xs font-semibold bg-teal-100 px-2 py-1 rounded">Account:</span>
                      <span className="text-sm font-medium">{currentUser}</span>
                    </div>
                  </div>
                  {activity.message && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Your Message</p>
                      <p className="text-sm text-gray-700 italic">"{activity.message}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`bg-gradient-to-r ${currentStatus.color} px-6 py-3`}>
          <p className={`text-xs ${currentStatus.textColor} font-semibold`}>Status: {currentStatus.label}</p>
        </div>
      </div>
    );
  };

  const renderInquiry = () => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <MessageSquare className="text-blue-700" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Vehicle Inquiry</h3>
                <p className="text-blue-700 font-semibold text-lg">{activity.car_name}</p>
              </div>
              <span className="text-sm text-gray-500">{getTimeAgo(activity.sortDate)}</span>
            </div>
            
            {activity.message && (
              <div className="bg-blue-50 p-4 rounded-xl mt-3 mb-3">
                <p className="text-xs text-blue-700 font-semibold uppercase mb-2">Your Message</p>
                <p className="text-sm text-gray-800">"{activity.message}"</p>
              </div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-blue-700 text-sm font-semibold hover:gap-2 transition-all"
            >
              {expanded ? "Hide details" : "View details"}
              <ChevronRight size={16} className={`transform transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>

            {expanded && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Your Information</p>
                  {activity.name && (
                    <p className="text-sm text-gray-700 font-medium">{activity.name}</p>
                  )}
                  {activity.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} />
                      <span className="text-sm">{activity.email}</span>
                    </div>
                  )}
                  {activity.phone_number && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <span className="text-sm">{activity.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-blue-600 mt-2">
                    <span className="text-xs font-semibold bg-blue-100 px-2 py-1 rounded">Account:</span>
                    <span className="text-sm font-medium">{currentUser}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
        <p className="text-xs text-blue-800 font-semibold">Awaiting Response from Seller</p>
      </div>
    </div>
  );

  const renderSearch = () => {
    const filters = activity.filters || {};
    const filterTags = [];
    
    // Extract and format filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "null" && value !== null) {
        let label = key.charAt(0).toUpperCase() + key.slice(1);
        let displayValue = value;
        
        // Format special cases
        if (key === 'priceRange' || key === 'price') {
          label = "Price";
          if (value === '>3M') displayValue = "Over 3M";
          if (value === '1M-3M') displayValue = "1M - 3M";
          if (value === '<1M') displayValue = "Under 1M";
        }
        
        if (key === 'fuel') {
          if (value === 'petrol') displayValue = "Petrol";
          if (value === 'diesel') displayValue = "Diesel";
          if (value === 'electric') displayValue = "Electric";
        }
        
        if (key === 'model' && typeof value === 'string') {
          displayValue = value.charAt(0).toUpperCase() + value.slice(1);
        }
        
        // Color mapping
        const colorMap = {
          model: "bg-teal-100 text-teal-700",
          make: "bg-blue-100 text-blue-700",
          brand: "bg-indigo-100 text-indigo-700",
          fuel: "bg-green-100 text-green-700",
          priceRange: "bg-purple-100 text-purple-700",
          price: "bg-purple-100 text-purple-700",
          year: "bg-orange-100 text-orange-700",
          transmission: "bg-pink-100 text-pink-700",
          mileage: "bg-cyan-100 text-cyan-700",
          bodyType: "bg-amber-100 text-amber-700",
          default: "bg-gray-100 text-gray-700"
        };
        
        const colorClass = colorMap[key] || colorMap.default;
        
        filterTags.push({ label, value: displayValue, color: colorClass });
      }
    });
    
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 p-3 rounded-xl">
            <Search className="text-gray-700" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Saved Search</h3>
                
                {filterTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filterTags.map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tag.color}`}
                      >
                        {tag.label}: {tag.value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">General vehicle search</p>
                )}
              </div>
              {/* <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-500 whitespace-nowrap">{getTimeAgo(activity.sortDate)}</span>
                {onDelete && (
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete search"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div> */}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <User size={12} className="text-gray-600" />
                  <span className="text-xs font-bold text-gray-800">{activity.username || currentUser}</span>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded" title="From database">
                  Database
                </span>
              </div>
              
              <div className="text-right">
                <span className="text-xs text-gray-500">
                  {formatDate(activity.sortDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (activity.type === "test_drive") return renderTestDrive();
  if (activity.type === "inquiry") return renderInquiry();
  if (activity.type === "search") return renderSearch();
  
  return null;
};

export default BuyerHistory;