export default function ThreadLoading() {
    return (
        <div className="animate-pulse flex w-full flex-col rounded-xl bg-dark-2 p-7">
                <div className="flex items-start justify-between">
                    <div className="flex w-full  flex-1 flex-row gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-300" />
                            <div className="thread-card_bar" />
                        </div>
                        <div className="flex w-full flex-col">
                            <div className="w-16 h-4 bg-gray-300 mb-1" />
                            <div className="w-full h-4 bg-gray-300 mb-2" />
                            <div className="w-32 h-4 bg-gray-300" />
                            <div className={`mt-5 flex flex-col gap-3`}>
                                <div className="flex gap-3.5">
                                    <div className="w-8 h-8 bg-gray-300" />
                                    <div className="w-8 h-8 bg-gray-300" />
                                    <div className="w-8 h-8 bg-gray-300" />
                                    <div className="w-8 h-8 bg-gray-300" />
                                </div>
                                <div className="w-20 h-4 bg-gray-300" />
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}