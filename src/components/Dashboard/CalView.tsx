import { useState } from "react";
import DayInfo from "./DayInfo";
import type { CalViewProps, DayInfoProps } from "../../types/PropTypes";


export default function CalView({ userEvents, getSelectedDay, setSelectedDay }: CalViewProps) {

    const currentDate = new Date;
    const currentDateArr = [currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()];

    // 0 based
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
    // absolute
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());


    function createDateObj(monthInput: number, yearInput: number) {
        const dateObj = {
            year: yearInput,
            month: monthInput,
            daysInMonth: new Date(yearInput, monthInput + 1, 0).getDate(),
            firstDay: new Date(yearInput, monthInput, 1).getDay()
        }

        return dateObj
    }

    const activeDate = createDateObj(selectedMonth, selectedYear);

    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days: string[] = ["S", "M", "Tu", "W", "Th", "F", "S"];


    function renderDays() {
        let daysList = [];

        for (let i = 1; i < activeDate.daysInMonth + 1; i++) {
            let today: boolean = false;
            if (activeDate.year === currentDateArr[0] &&
                activeDate.month === currentDateArr[1] &&
                i === currentDateArr[2]
            ) today = true;

            let selected: boolean = false;
            if (activeDate.year === getSelectedDay[0] &&
                activeDate.month === getSelectedDay[1] &&
                i === getSelectedDay[2]
            ) selected = true;

            const dayInfoProps: DayInfoProps = {
                userEvents: userEvents,
                year: selectedYear,
                month: selectedMonth,
                day: i
            }

            daysList.push(
                <button id={`${selectedYear}-${selectedMonth}-${i}`} key={`${selectedYear}-${selectedMonth}-${i}`}
                    className="text-left hover:bg-third/50"
                    onClick={() => { setSelectedDay([activeDate.year, activeDate.month, i]) }}
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
        const spaceNeeded: number = activeDate.firstDay;
        let spaces = [];

        for (let i = 0; i < spaceNeeded; i++) {
            spaces.push(
                <div id={`space-${i}`} key={`space-${i}`}></div>
            )
        }

        return spaces;
    }

    function changeDate(value: number): void {
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
            <header className="flex justify-between">
                <h1 className="w-1/3 text-2xl font-bold">
                    {months[activeDate.month]}
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
                    {activeDate.year}
                </h1>
            </header>

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

            <div className="grow grid grid-cols-7 grid-rows-[repeat(6,1fr)] gap-2 mt-2">
                {renderSpace()}
                {renderDays()}
            </div>
        </section>
    )
}