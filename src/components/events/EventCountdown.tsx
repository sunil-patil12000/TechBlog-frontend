import React, { useState, useEffect } from 'react';
import { intervalToDuration } from 'date-fns';

interface EventCountdownProps {
  date: Date;
  location: string;
}

const EventCountdown: React.FC<EventCountdownProps> = ({ date, location }) => {
  const [timeLeft, setTimeLeft] = useState<Duration>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = intervalToDuration({
        start: new Date(),
        end: date
      });
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [date]);

  return (
    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Next Event</h3>
          <p className="text-sm">{location}</p>
        </div>
        <div className="text-right">
          <span className="block text-xl font-mono">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </span>
          <span className="text-sm">Until Start</span>
        </div>
      </div>
    </div>
  );
};

export default EventCountdown; 