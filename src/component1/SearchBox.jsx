import { useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./searchbox.css";

const SearchTagname = () => {
    const db = getFirestore();
    const navigate = useNavigate();

    const cities = [
        { value: "Sivakasi", label: "Sivakasi" },
        { value: "Karur", label: "Karur" },
        { value: "Dindigul", label: "Dindigul" },
        { value: "Erode", label: "Erode" },
    ];

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Filter cities for "To" dropdown
    const availableToCities = cities.filter(city => city.value !== from);

    const handleBooking = () => {
        navigate("/book");
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!from || !to) {
            setError("Please select both 'From' and 'To' locations.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const q = query(
                collection(db, "Messages"),
                where("vecfrom", "==", from),
                where("vecto", "==", to)
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setResults(data);
        } catch (error) {
            console.error("Error fetching routes:", error);
            setError("Failed to fetch routes. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h4 className="text-center text-lg font-semibold mb-4">Find Your Route</h4>

                {/* Error Message */}
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                <form onSubmit={handleSearch}>
                    <div className="mb-4">
                        <label htmlFor="fromLocation" className="block font-medium mb-1">From:</label>
                        <select 
                            id="fromLocation"
                            className="w-full p-2 border rounded-md"
                            value={from}  
                            onChange={(e) => {
                                setFrom(e.target.value);
                                setTo(""); // Reset "To" when "From" changes
                            }}
                        >
                            <option value="" disabled>Select Starting Location</option>
                            {cities.map(city => (
                                <option key={city.value} value={city.value}>{city.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="toLocation" className="block font-medium mb-1">To:</label>
                        <select 
                            id="toLocation" 
                            className="w-full p-2 border rounded-md"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            disabled={!from} // Disable until "From" is selected
                        >
                            <option value="" disabled>Select Destination</option>
                            {availableToCities.map(city => (
                                <option key={city.value} value={city.value}>{city.label}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        disabled={!from || !to || loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>

                {/* Search Results */}
                <div className="mt-4">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading routes...</p>
                    ) : results.length > 0 ? (
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Vehicle</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((route) => (
                                        <tr key={route.id}>
                                            <td className="td">{route.vecName}</td>
                                            <td  className="td">{route.vecfrom}</td>
                                            <td  className="td">{route.vecto}</td>
                                            <td>
                                            <button
                                            className="book-btn"
                                              onClick={() => navigate('/book', { state: { from: route.vecfrom, to: route.vecto } })}
                                            >  
                                                    Book Now
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No routes found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchTagname;
