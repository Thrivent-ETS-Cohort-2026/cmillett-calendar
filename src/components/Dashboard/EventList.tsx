import type { Event } from "../../types/ExternalTypes";
import type { EventListProps } from "../../types/PropTypes";


export default function EventList({ getSelectedDate, currentUser, userEvents }: EventListProps) {

    function findEvents(): Event[] {
        let eventsFound: Event[] = [];

        for (let event of userEvents) {
            if (event.date.year === getSelectedDate.year &&
                event.date.month === getSelectedDate.month &&
                event.date.day === getSelectedDate.day
            ) {
                eventsFound.push(event);
            }
        }

        return eventsFound;
    }

    const userEventsToday = findEvents();

    function displayList() {
        if (userEventsToday.length === 0) {
            return (
                <div className="flex h-full items-center justify-center">
                    <p className="h-fit text-2xl">
                        No events found.
                    </p>
                </div>
            )
        } else return (
            <>
                {userEventsToday.map((event) => {
                    return (
                        <button className="w-full bg-third/20 p-2 border border-blue-300 rounded flex">
                            <div className="w-1/2 text-left">
                                <p>{event.title}</p>
                                <p>{event.time}</p>
                            </div>
                            <div className="w-1/2 overflow-scroll text-justify">
                                <p>{event.description}</p>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    return (
        <>
            {displayList()}
        </>
    )
}