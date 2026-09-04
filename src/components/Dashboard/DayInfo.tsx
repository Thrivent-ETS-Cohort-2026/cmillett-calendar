import { useEffect, useState } from "react";
import type { Event } from "../../types/ExternalTypes";
import type { DayInfoProps } from "../../types/PropTypes";


export default function DayInfo({ userEvents, year, month, day }: DayInfoProps) {

    const [userEventsToday, setUserEventsToday] = useState<Event[]>([]);

    useEffect(() => {
        const currentDate: number[] = [year, month, day];

        let foundEventsToday: Event[] = [];

        for (let event of userEvents) {
            if (event.date[0] === currentDate[0] &&
                event.date[1] === currentDate[1] &&
                event.date[2] === currentDate[2]
            ) {
                foundEventsToday.push(event);
            }
        }

        setUserEventsToday(foundEventsToday);
    }, [userEvents]);


    return (
        <>
            <p>{day}</p>
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