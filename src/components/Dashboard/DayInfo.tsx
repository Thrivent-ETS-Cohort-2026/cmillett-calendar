import { useEffect, useState } from "react";
import type { Event } from "../../types/ExternalTypes";
import type { DayInfoProps } from "../../types/PropTypes";


export default function DayInfo({ userEvents, thisDate }: DayInfoProps) {

    const [userEventsToday, setUserEventsToday] = useState<Event[]>([]);

    useEffect(() => {
        let foundEventsToday: Event[] = [];

        for (let event of userEvents) {
            if (event.date.year === thisDate.year &&
                event.date.month === thisDate.month &&
                event.date.day === thisDate.day
            ) {
                foundEventsToday.push(event);
            }
        }

        setUserEventsToday(foundEventsToday);
    }, [userEvents]);


    return (
        <>
            <p>{thisDate.day}</p>

            {userEventsToday.map((event) => (
                <div key={event.id}
                    className="w-full h-1/4 bg-blue-300 border border-prime rounded px-1 mt-1 text-center"
                >
                    <p className="text-prime text-sm text-nowrap overflow-scroll">{event.title}</p>
                </div>
            ))}
        </>
    )
}