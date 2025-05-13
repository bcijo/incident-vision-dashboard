import React from 'react';

interface IframePlotProps {
  src: string;
  title?: string;
  className?: string;
}

const IframePlot: React.FC<IframePlotProps> = ({ src, title, className = '' }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {title && (
        <div className="p-6 pb-0">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className="p-6">
        <iframe 
          src={src} 
          className="w-full h-[400px] border-none"
          title={title}
        />
      </div>
    </div>
  );
};

export default IframePlot;
