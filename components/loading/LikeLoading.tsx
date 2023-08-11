import React from 'react';

function LikeLoading() {
    return (
        <div className="flex items-center gap-1">
            <div className="animate-spin w-3 h-3 rounded-full border-t-2 border-blue"></div>
        </div>
    );
}

export default LikeLoading;