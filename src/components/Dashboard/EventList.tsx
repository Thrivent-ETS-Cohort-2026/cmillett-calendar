import type { Event, Invite } from "../../types/ExternalTypes";
import type { EventListProps } from "../../types/PropTypes";


export default function EventList({ getSelectedDate, currentUser, userEvents, userInvites, setSelectedEvent, setSelectedInvite }: EventListProps) {

    // find user created events. REUSABLE FUNCTION. DEAL WITH THIS EVENTUALLY
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

    // find user invited events. REUSABLE FUNCTION. DEAL WITH THIS EVENTUALLY
    function findInvites(): Invite[] {
        let invitesFound: Invite[] = [];

        for (let invite of userInvites) {
            if (invite.event.date.year === getSelectedDate.year &&
                invite.event.date.month === getSelectedDate.month &&
                invite.event.date.day === getSelectedDate.day
            ) {
                invitesFound.push(invite);
            }
        }

        return invitesFound;
    }

    const userEventsToday = findEvents();
    const userInvitesToday = findInvites();


    function colorMapInvites(invite: Invite): string {
        const currentInvitee = invite.invitees.find((invitee) => invitee.id === currentUser!.id);

        if (currentInvitee!.status === "pending") return "border-yellow-100";
        if (currentInvitee!.status === "accepted") return "border-green-100";
        if (currentInvitee!.status === "rejected") return "border-red-300";

        else throw new Error("colorMapInvites() out of type!");
    }

    function displayList() {
        if (userEventsToday.length === 0 && userInvitesToday.length === 0) {
            return (
                <div className="flex h-full items-center justify-center">
                    <p className="h-fit text-2xl">
                        No events found.
                    </p>
                </div>
            )
        } else return (
            <>
                {userEventsToday.map((event) => (
                    <button
                        key={event.id}
                        className="w-full bg-third/20 p-2 border border-blue-300 rounded flex hover:bg-third/40 mb-2"
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
                )}

                {userInvitesToday.map((invite) => (
                    <button
                        key={invite.id}
                        className={`w-full bg-third/20 p-2 border ${colorMapInvites(invite)} rounded flex hover:bg-third/40 mb-2`}
                        onClick={() => setSelectedInvite(invite)}
                    >
                        <div className="w-1/2 text-left">
                            <p>{invite.event.title}</p>
                            <p>{invite.event.time.hour}:{invite.event.time.minute == 0 ? "00" : invite.event.time.minute} {invite.event.time.suffix}</p>
                        </div>
                        <div className="w-1/2 h-[2lh] overflow-scroll text-justify">
                            <p>{invite.event.description}</p>
                        </div>
                    </button>
                ))}
            </>
        )
    }

    return (
        <>
            {displayList()}
        </>
    )
}