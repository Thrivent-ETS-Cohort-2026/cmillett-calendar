import type { Event } from "../../types/ExternalTypes";
import type { EventListProps } from "../../types/PropTypes";


export default function EventList({ getSelectedDate, currentUser, userEvents, setSelectedEvent }: EventListProps) {

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


    function colorMap(event: Event): string {
        return event.createdBy.id === currentUser!.id ?
            "border-blue-300" :
            "border-yellow-300"
    }

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
                        <button
                            key={event.id}
                            className={`w-full bg-third/20 p-2 border ${colorMap(event)} rounded flex hover:bg-third/40 mb-2`}
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="w-1/2 text-left">
                                <p>{event.title}</p>
                                <p>{event.time.hour}:{event.time.minute == 0 ? "00" : event.time.minute} {event.time.suffix}</p>
                            </div>
                            <div className="w-1/2 h-[2lh] overflow-scroll text-justify">
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