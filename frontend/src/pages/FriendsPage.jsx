import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  const filtered = friends.filter(friend => {
    if (filter === "online") return friend.isOnline;
    if (filter === "offline") return !friend.isOnline;
    return true;
  });

  const searched = filtered.filter(friend =>
    friend.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...searched].sort((a, b) => {
    if (sort === "name") return a.fullName.localeCompare(b.fullName);
    return 0;
  });

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 "> 
        <Navbar />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto space-y-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
                Your Friends
              </h2>
            </div>
            {/* Controls: filter/search/sort */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${
                    filter === "all"
                      ? "bg-primary text-black border-primary"
                      : "bg-base-200 text-base-content border-base-300 dark:bg-base-300 dark:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("online")}
                  className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${
                    filter === "online"
                      ? "bg-primary text-black border-primary"
                      : "bg-base-200 text-base-content border-base-300 dark:bg-base-300 dark:text-white"
                  }`}
                >
                Online
                </button>
                <button
                  onClick={() => setFilter("offline")}
                  className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${
                    filter === "offline"
                      ? "bg-primary text-black border-primary"
                      : "bg-base-200 text-base-content border-base-300 dark:bg-base-300 dark:text-white"
                  }`}
                >
                  Offline
                </button>
              </div>
              {/* Search Bar */}
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search friends..."
                className="flex-1 border border-base-300 rounded-full px-5 py-2 text-lg bg-base-200 text-base-content dark:bg-base-300 dark:text-black transition-colors duration-200"
              />


              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-base-300 rounded-full px-5 py-2 font-semibold bg-base-200 text-base-content dark:bg-base-300 dark:text-black transition-colors duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>

            
            {/* Main Content: Friends grid or empty state */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : sorted.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sorted.map(friend => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
