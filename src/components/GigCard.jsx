export default function GigCard({ gig, onSelect }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow transition cursor-pointer bg-white" onClick={() => onSelect?.(gig)}>
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{gig.title}</h3>
        <span className="text-blue-600 font-bold">${gig.price?.toFixed?.(2) ?? gig.price}</span>
      </div>
      <p className="text-gray-600 mt-2 line-clamp-3">{gig.description}</p>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span>By {gig.creator_name || 'Unknown'}</span>
        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{gig.category}</span>
      </div>
    </div>
  )
}
