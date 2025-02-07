import React from 'react';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchDropdown = ({ 
    searchResults = [], 
    isSearching = false, 
    searchQuery = '',
    onResultClick = () => {},
}) => {
    if (!searchQuery) return null;

    return (
        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
            {/* Search Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                    {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
                </span>
            </div>

            {/* Loading State */}
            {isSearching && (
                <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <p className="text-sm">Searching courses...</p>
                </div>
            )}

            {/* No Results State */}
            {!isSearching && searchResults.length === 0 && (
                <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                    <Search className="w-6 h-6 mb-2" />
                    <p className="text-sm">No courses found for "{searchQuery}"</p>
                </div>
            )}

            {/* Results List */}
            {!isSearching && searchResults.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto">
                    <div className="py-2">
                        {searchResults.map((course) => (
                            <Link
                                key={course._id}
                                to={`/course/${course._id}`}
                                onClick={() => onResultClick(course)}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {course.title}
                                    </h4>
                                    {course.category && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {course.category}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer */}
            {!isSearching && searchResults.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">↵</kbd> to select
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;