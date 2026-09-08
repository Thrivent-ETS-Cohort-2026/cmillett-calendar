import { useState } from "react";
import DayInfo from "./DayInfo";
import type { CalViewProps, DayInfoProps } from "../../types/PropTypes";
import { dayListShort, monthList } from "../../data/Data";
import type { DateFormat, Months, DaysShort } from "../../types/DataTypes";


export default function CalView({ currentUser, currentDate, userEvents, userInvites, getSelectedDate, setSelectedDate }: CalViewProps) {

    // 0 based
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.month);
    // absolute
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.year);


    function createDateObj(monthInput: number, yearInput: number) {
        const dateObj = {
            year: yearInput,
            month: monthInput,
            daysInMonth: new Date(yearInput, monthInput + 1, 0).getDate(),
            firstDay: new Date(yearInput, monthInput, 1).getDay()
        }

        return dateObj
    }

    const displayedDate = createDateObj(selectedMonth, selectedYear);

    // visual; not used for logic
    const months: Months = monthList();
    const days: DaysShort = dayListShort();


    function renderDays() {
        let daysList = [];

        for (let day = 1; day < displayedDate.daysInMonth + 1; day++) {
            // highlight today on calendar
            let today: boolean = false;
            if (displayedDate.year === currentDate.year &&
                displayedDate.month === currentDate.month &&
                day === currentDate.day
            ) today = true;

            // find selected day. Defaults to today
            let selected: boolean = false;
            if (displayedDate.year === getSelectedDate.year &&
                displayedDate.month === getSelectedDate.month &&
                day === getSelectedDate.day
            ) selected = true;

            // grab date, include iterated day
            const thisDate: DateFormat = {
                year: displayedDate.year,
                month: displayedDate.month,
                day: day
            }

            const dayInfoProps: DayInfoProps = {
                currentUser: currentUser,
                userEvents: userEvents,
                userInvites: userInvites,
                thisDate: thisDate
            }

            daysList.push(
                <button id={`${selectedYear}-${selectedMonth}-${day}`} key={`${selectedYear}-${selectedMonth}-${day}`}
                    className="size-full text-left hover:bg-third/50"
                    onClick={() => { setSelectedDate(thisDate) }}
                >
                    <div className={`size-full border rounded-md p-2 flex flex-col  
                        ${selected ? "border-blue-300" : "border-prime-text"}
                        ${today ? "bg-prime/60" : "bg-third/20"}`
                    }>
                        <DayInfo {...dayInfoProps} />
                    </div>
                </button>
            )
        }

        return daysList;
    }

    function renderSpace() {
        const spaceNeeded: number = displayedDate.firstDay;
        let spaces = [];

        for (let i = 0; i < spaceNeeded; i++) {
            spaces.push(
                <div id={`space-${i}`} key={`space-${i}`}></div>
            )
        }

        return spaces;
    }

    function changeDate(value: 1 | -1): void {
        if (value === 1) {
            if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
            } else setSelectedMonth(selectedMonth + 1);
        } else if (value === -1) {
            if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
            } else setSelectedMonth(selectedMonth - 1);
        } else throw new Error("changeDate() called out of range! (must be -1 or 1).");
    }

    return (
        <section className="w-1/2 flex flex-col border-2 border-third rounded-2xl m-2 p-4">
            <header className="flex justify-between px-2">
                <h1 className="w-1/3 text-2xl font-bold">
                    {months[displayedDate.month]}
                </h1>

                <div className="w-1/3 text-center">
                    <button className="border-2 border-third rounded-2xl w-1/4 mr-1 hover:bg-third"
                        onClick={() => changeDate(-1)}
                    >
                        ←
                    </button>
                    <button className="border-2 border-third rounded-2xl w-1/4 ml-1 hover:bg-third"
                        onClick={() => changeDate(1)}
                    >
                        →
                    </button>
                </div>

                <h1 className="w-1/3 text-2xl text-right font-bold">
                    {displayedDate.year}
                </h1>
            </header>

            {/* Days Header */}
            <div className="grid grid-cols-7 mt-2">
                {days.map((day, index) => {
                    return (
                        <div key={`day-column-${index}`}
                            className="text-center font-bold"
                        >
                            {day}
                        </div>
                    )
                })}
            </div>

            {/* Calendar */}
            <div className="grow grid grid-cols-7 grid-rows-[repeat(6,1fr)] gap-2 mt-2">
                {renderSpace()}
                {renderDays()}
            </div>
        </section>
    )
}