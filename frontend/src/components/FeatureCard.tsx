import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  method: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  method,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/algorithm/${method}`)}
      className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 
                 hover:border-cyan-500/50 cursor-pointer transition-all duration-200 glow"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 
                    flex items-center justify-center mb-4 ring-1 ring-cyan-500/30">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r 
                     from-cyan-400 to-blue-400 mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};