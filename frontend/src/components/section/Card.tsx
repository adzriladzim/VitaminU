import React from 'react';

interface CardProps {
  className: string;
  description: string;
  image: string;
  location: string;
  status: 'booked' | 'in use' | 'available';
}

const statusColor: Record<CardProps['status'], string> = {
  booked: 'bg-gray-400 text-white',
  'in use': 'bg-orange-500 text-white',
  available: 'bg-green-500 text-white',
};

const Card: React.FC<CardProps> = ({ className, description, image, location, status }) => {
  const isButtonDisabled = status === 'booked' || status === 'in use';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {image && (
        <img
          src={image}
          alt={className}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        {/* Name + STATUS */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{className}</h3>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">{location}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[status]}`}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <button
  disabled={isButtonDisabled}
  className={`
    w-full p-4 border-t text-center text-white font-bold
    transition-colors duration-200
    bg-cyan-600 hover:bg-cyan-700
    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400
  `}
>
  Book now
</button>
    </div>
  );
};

export default Card;
