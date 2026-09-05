import { useEffect, useState } from "react";
import { fetchEvents } from "../../service/EventService";

import type { Event } from "../../types/ExternalTypes";
import type { CalViewProps, DashboardProps } from "../../types/PropTypes";

import CalDetails from "./CalDetails";
import CalView from "./CalView";
import type { DateFormat } from "../../types/DataTypes";
import { getCurrentDate } from "../../data/Data";


export default function Dashboard({ currentUser }: DashboardProps) {

    const currentDate = getCurrentDate();

    const [currentUserEvents, setCurrentUserEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<DateFormat>(currentDate);

    useEffect(() => {console.log(selectedDate)}, [selectedDate])

    useEffect(() => {(async () => {
        const events: Event[] = await fetchEvents();

        const findUserEvents: Event[] = events.filter((event) => event.createdBy === currentUser?.id);

        setCurrentUserEvents(findUserEvents);
    })()}, [])


    const calViewProps: CalViewProps = {
        currentDate: currentDate,
        userEvents: currentUserEvents,
        getSelectedDate: selectedDate,
        setSelectedDate: (date: DateFormat) => setSelectedDate(date)
    }

    return (
        <>
            <CalDetails />
            <CalView {...calViewProps} />
        </>
    )
}