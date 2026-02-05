import React, { useState, useEffect, useMemo } from "react";
import ItemCard from "./ItemCard";
import CreateListingModal from "./CreateListingModal"; // Import your component
import toast from "react-hot-toast";

const Listings = ({ onSelectItem, myListings, searchText }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState(searchText || "");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete a product listing
  const deleteProduct = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchProducts(); // Re-fetch the list after deletion
        toast.success(`Product (${product.title}) deleted successfully`);
      } else {
        // toast.error("Failed to delete product");
        throw new Error("Failed to delete product");
      }
    } catch (err) {
      toast.error("Failed to delete product");
      // Do nothing
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = myListings
        ? "http://localhost:3000/products/mylistings"
        : "http://localhost:3000/products";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      const finalData = myListings
        ? data
        : data.sort(() => Math.random() - 0.5);
      setProducts(finalData);
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [myListings]);

  useEffect(() => {
    setSearchTerm(searchText || "");
  }, [searchText]);

  // Filter and sort products based on search term and sort option
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "date-new":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        break;
      case "date-old":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
        break;
      default:
        // For non-myListings, keep random order, else default
        if (!myListings) {
          filtered = products.filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()),
          ); // already randomized in fetch
        }
        break;
    }
    return filtered;
  }, [products, sortOption, searchTerm, myListings]);

  if (loading)
    return (
      <div className="text-slate-400 text-center py-20 italic">Loading...</div>
    );

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">
          {myListings
            ? `My Listings (${filteredProducts.length})`
            : `Browse Listings (${filteredProducts.length})`}
        </h1>
        <div className="flex items-center space-x-4">
          {/* <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-1 text-sm w-48"
          /> */}
          <div className="flex items-center space-x-2">
            <label className="text-white text-sm">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-1 text-sm"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="date-new">Date: Newest</option>
              <option value="date-old">Date: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredProducts.map((product) => (
          <ItemCard
            key={product.id}
            image={
              product.image_url ||
              `https://picsum.photos/seed/${product.id}/400/400`
            }
            title={product.title}
            price={product.price}
            postedOn={product.created_at}
            showDelete={myListings}
            onDelete={() => deleteProduct(product)}
            onView={() => onSelectItem(product)}
          />
        ))}

        {myListings && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:bg-slate-800/50 transition-all group min-h-[250px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
              <span className="text-2xl text-slate-400 group-hover:text-white">
                +
              </span>
            </div>
            <span className="text-slate-400 font-medium group-hover:text-white">
              Create Listing
            </span>
          </button>
        )}
      </div>

      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchProducts} // Re-fetches the list after a successful post
      />
    </>
  );
};

export default Listings;
