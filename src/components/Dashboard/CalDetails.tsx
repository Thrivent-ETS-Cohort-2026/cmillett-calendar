import { dayList, monthList } from "../../data/Data";
import type { Days } from "../../types/DataTypes";
import type { CalDetailsProps, EventListProps } from "../../types/PropTypes";
import EventList from "./EventList";


export default function CalDetails({ getSelectedDate, currentUser, userEvents }: CalDetailsProps) {


    function findDay() {
        const date: Date = new Date(getSelectedDate.year, getSelectedDate.month, getSelectedDate.day);
        const dayArr: Days = dayList();

        const dayOfWeek: number = date.getDay();
        return dayArr[dayOfWeek];
    }

    const eventListProps: EventListProps = {
        getSelectedDate: getSelectedDate,
        currentUser: currentUser,
        userEvents: userEvents
    }

    return (
        <section className="w-1/2 flex flex-col border-2 border-third rounded-2xl m-2 p-4">
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">
                    {findDay()}, {monthList()[getSelectedDate.month]} {getSelectedDate.day}
                </h1>

                <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 my-2 hover:bg-third">
                    Create Event
                </button>
            </header>

            <div className="grow border-2 border-third/30 rounded-2xl p-4">
                <EventList {...eventListProps} />
            </div>
        </section>
    )
}