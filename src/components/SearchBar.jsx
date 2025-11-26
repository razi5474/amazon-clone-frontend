import { useState, useEffect, useRef } from "react";
import api from "../api/api"; 
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Fetch search results with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      api
        .get(`/product/search/query?q=${query}`)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setShowDropdown(false);
    setQuery("");
  };

  return (
    <div className="search-bar-container" ref={wrapperRef}>
      <form className="search-box" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
        />
        <button type="submit" className="search-button">
          <FaSearch />
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <ul className="search-suggestions">
          {results.map((product) => (
            <li key={product._id}>
              <Link
                to={`/product/${product._id}`}
                className="search-suggestion-item"
                onClick={() => {
                  setQuery("");
                  setShowDropdown(false);
                }}
              >
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="suggestion-img"
                />
                <div className="suggestion-info">
                  <span className="suggestion-title">{product.title}</span>
                  <span className="suggestion-price">₹{product.price}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
