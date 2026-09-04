import { useEffect, useState } from "react";
import { fetchEvents } from "../../service/EventService";

import type { Event } from "../../types/ExternalTypes";
import type { CalViewProps, DashboardProps } from "../../types/PropTypes";

import CalDetails from "./CalDetails";
import CalView from "./CalView";


export default function Dashboard({ currentUser }: DashboardProps) {

    const [currentUserEvents, setCurrentUserEvents] = useState<Event[]>([]);
    const [selectedDay, setSelectedDay] = useState<number[]>([]);


    useEffect(() => {(async () => {
        const events: Event[] = await fetchEvents();

        const findUserEvents: Event[] = events.filter((event) => event.createdBy === currentUser?.id);

        setCurrentUserEvents(findUserEvents);
    })()}, [])


    const calViewProps: CalViewProps = {
        userEvents: currentUserEvents,
        getSelectedDay: selectedDay,
        setSelectedDay: (date: number[]) => setSelectedDay(date)
    }

    return (
        <>
            <CalDetails />
            <CalView {...calViewProps} />
        </>
    )
}