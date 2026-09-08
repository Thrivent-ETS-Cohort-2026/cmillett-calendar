import { useEffect, useState } from "react";
import type { Event, Invite } from "../../types/ExternalTypes";
import type { DayInfoProps } from "../../types/PropTypes";


export default function DayInfo({ currentUser, userEvents, userInvites, thisDate }: DayInfoProps) {

    const [userEventsToday, setUserEventsToday] = useState<Event[]>([]);
    const [userInvitesToday, setUserInvitesToday] = useState<Invite[]>([]);

    // find event for each day
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

    // find invite for each day
    useEffect(() => {
        let foundInvitesToday: Invite[] = [];

        for (let invite of userInvites) {
            if (invite.event.date.year === thisDate.year &&
                invite.event.date.month === thisDate.month &&
                invite.event.date.day === thisDate.day
            ) {
                foundInvitesToday.push(invite);
            }
        }

        setUserInvitesToday(foundInvitesToday);
    }, [userEvents]);


    function colorMapInvites(invite: Invite): string {
        const currentInvitee = invite.invitees.find((invitee) => invitee.id === currentUser!.id);

        if (currentInvitee!.status === "pending") return "bg-yellow-100";
        if (currentInvitee!.status === "accepted") return "bg-green-100";
        if (currentInvitee!.status === "rejected") return "bg-red-300";

        else throw new Error("colorMapInvites() out of type!");
    }


    return (
        <>
            <p>{thisDate.day}</p>

            {userEventsToday.map((event) => (
                <div key={event.id}
                    className="w-full h-lh bg-blue-300 border border-prime rounded px-1 mt-1 text-center"
                >
                    <p className="text-prime text-sm text-nowrap overflow-scroll">{event.title}</p>
                </div>
            ))}

            {userInvitesToday.map((invite) => (
                <div key={invite.id}
                    className={`w-full h-lh ${colorMapInvites(invite)} border border-prime rounded px-1 mt-1 text-center`}
                >
                    <p className="text-prime text-sm text-nowrap overflow-scroll">{invite.event.title}</p>
                </div>
            ))}
        </>
    )
}