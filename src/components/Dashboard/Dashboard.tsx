import { useEffect, useState } from "react";
import { fetchEvents } from "../../service/EventService";

import type { Event } from "../../types/ExternalTypes";
import type { CalDetailsProps, CalViewProps, DashboardProps } from "../../types/PropTypes";

import CalDetails from "./CalDetails";
import CalView from "./CalView";
import type { DateFormat } from "../../types/DataTypes";
import { getCurrentDate } from "../../data/Data";


export default function Dashboard({ currentUser }: DashboardProps) {

    const currentDate = getCurrentDate();

    const [currentUserEvents, setCurrentUserEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<DateFormat>(currentDate);

    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const events: Event[] = await fetchEvents();

            const findUserEvents: Event[] = events.filter((event) => event.createdBy.id === currentUser?.id);

            setCurrentUserEvents(findUserEvents);
        })()
    }, [loadingStatus])


    const calDetailsProps: CalDetailsProps = {
        getSelectedDate: selectedDate,
        currentUser: currentUser,
        userEvents: currentUserEvents,
        getStatus: loadingStatus,
        setStatus: (status) => setLoadingStatus(status)
    }

    const calViewProps: CalViewProps = {
        currentDate: currentDate,
        userEvents: currentUserEvents,
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