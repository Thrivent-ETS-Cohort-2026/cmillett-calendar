import { useEffect, useState } from "react";
import { fetchEvents, fetchInvites } from "../../service/EventService";

import type { Event, Invite } from "../../types/ExternalTypes";
import type { CalDetailsProps, CalViewProps, DashboardProps } from "../../types/PropTypes";

import CalDetails from "./CalDetails";
import CalView from "./CalView";
import type { DateFormat } from "../../types/DataTypes";
import { getCurrentDate } from "../../data/Data";


export default function Dashboard({ currentUser }: DashboardProps) {

    const currentDate = getCurrentDate();

    const [currentUserEvents, setCurrentUserEvents] = useState<Event[]>([]);
    const [currentUserInvites, setCurrentUserInvites] = useState<Invite[]>([]);
    const [selectedDate, setSelectedDate] = useState<DateFormat>(currentDate);

    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    // fetch user created events.
    useEffect(() => {
        (async () => {
            const events: Event[] = await fetchEvents();

            const findUserEvents: Event[] = events.filter((event) => event.createdBy.id === currentUser!.id);

            setCurrentUserEvents(findUserEvents);
        })()
    }, [loadingStatus]);

    // fetch user invited events
    useEffect(() => {
        (async () => {
            const invites: Invite[] = await fetchInvites();

            const findUserInvites: Invite[] = invites.filter((invite) => 
                invite.invitees.some((user) => user.id === currentUser!.id)
            );

            console.log(findUserInvites)
            setCurrentUserInvites(findUserInvites);
        })()
    }, [])


    const calDetailsProps: CalDetailsProps = {
        getSelectedDate: selectedDate,
        currentUser: currentUser,
        userEvents: currentUserEvents,
        userInvites: currentUserInvites,
        getStatus: loadingStatus,
        setStatus: (status) => setLoadingStatus(status)
    }

    const calViewProps: CalViewProps = {
        currentUser: currentUser,
        currentDate: currentDate,
        userEvents: currentUserEvents,
        userInvites: currentUserInvites,
        getSelectedDate: selectedDate,
        setSelectedDate: (date) => setSelectedDate(date)
    }

    return (
        <>
            <CalDetails {...calDetailsProps} />
            <CalView {...calViewProps} />
        </>
    )
}