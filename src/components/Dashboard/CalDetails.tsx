import { useEffect, useState } from "react";

import { createEventTemplate, dayList, monthList } from "../../data/Data";
import { addUserToInvite, createInvite, fetchInvites, handleEventDelete, handleEventUpdate } from "../../service/EventService";

import EventList from "./EventList";

import type { Days, HourFormat, MinuteFormat, SuffixFormat } from "../../types/DataTypes";
import type { CalDetailsProps, EventListProps } from "../../types/PropTypes";
import type { Invite, Event, User } from "../../types/ExternalTypes";
import { fetchUsers } from "../../service/UserService";


export default function CalDetails({ getSelectedDate, currentUser, userEvents, userInvites, getStatus, setStatus }: CalDetailsProps) {

    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
    const [selectedInvite, setSelectedInvite] = useState<Invite | undefined>(undefined);
    // reset selectedEvent when user changes date.
    useEffect(() => { setSelectedEvent(undefined) }, [getSelectedDate])

    const [eventTitle, setEventTitle] = useState<string>();
    const [eventHour, setEventHour] = useState<HourFormat>();
    const [eventMinute, setEventMinute] = useState<MinuteFormat>();
    const [eventSuffix, setEventSuffix] = useState<SuffixFormat>();
    const [eventLocation, setEventLocation] = useState<string>();
    const [eventDescription, setEventDescription] = useState<string>();

    const [inviteInput, setInviteInput] = useState<string>();

    // populate fields with current event info or default info if creating a new event.
    useEffect(() => {
        setEventTitle(selectedEvent?.title ?? "");
        setEventHour(selectedEvent?.time.hour ?? 12);
        setEventMinute(selectedEvent?.time.minute ?? 30);
        setEventSuffix(selectedEvent?.time.suffix ?? "PM");
        setEventLocation(selectedEvent?.location ?? "");
        setEventDescription(selectedEvent?.description ?? "");
    }, [selectedEvent])

    // translate day index into name of day. (0 == "Sunday")
    function findDay() {
        const date: Date = new Date(getSelectedDate.year, getSelectedDate.month, getSelectedDate.day);
        const dayArr: Days = dayList();

        const dayOfWeek: number = date.getDay();
        return dayArr[dayOfWeek];
    }

    async function handleEventMethod(method: "create" | "delete"): Promise<void> {
        setStatus(true);

        const event: Event = {
            id: selectedEvent!.id,
            title: eventTitle ?? "Event",
            date: getSelectedDate,
            time: {
                hour: eventHour!,
                minute: eventMinute!,
                suffix: eventSuffix!
            },
            location: eventLocation ?? "",
            description: eventDescription ?? "",
            createdBy: currentUser!
        }

        if (method === "create") await handleEventUpdate(event);
        if (method === "delete" && event.id) await handleEventDelete(event);

        setStatus(false);
    }

    function renderInviteesAsEvent() {
        const invite = userInvites.find((invite) => invite.event === selectedEvent)
        if (!invite) return (
            <p>
                No users have been invited.
            </p>
        )

        return (invite!.invitees.map((user) => {
            let color: string = "";
            if (user.status === "pending") color = "text-yellow-100";
            if (user.status === "accepted") color = "text-green-300";
            if (user.status === "rejected") color = "text-red-300";

            return (
                <p key={user.id}
                    className={`inline mr-4 ${color}`}
                >
                    {user.email}
                </p>
            )
        }))
    }

    function renderInviteesAsInvite() {

        return (selectedInvite!.invitees.map((user) => {
            let color: string = "";
            if (user.status === "pending") color = "text-yellow-100";
            if (user.status === "accepted") color = "text-green-300";
            if (user.status === "rejected") color = "text-red-300";

            return (
                <p key={user.id}
                    className={`inline mr-4 ${color}`}
                >
                    {user.email}
                </p>
            )
        }))
    }

    async function inviteUser() {
        const allUsers: User[] = await fetchUsers();
        const userFound: User | undefined = allUsers.find((user) => user.email === inviteInput);

        const allInvites: Invite[] = await fetchInvites();
        const inviteFound: Invite | undefined = allInvites.find((invite) => invite.event === selectedEvent);

        if (userFound) {
            if (!inviteFound) {
                createInvite(selectedEvent!, userFound);
            } else if (inviteFound) {
                addUserToInvite(inviteFound, userFound);
            }
        } else alert("Invalid email address.");
    }


    function displayEvent() {
        return (
            <>
                <div className="h-full flex flex-col">
                    <header className="flex justify-between text-xl font-bold mb-2">
                        <input
                            placeholder="Click to edit title"
                            className="grow mr-2"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                        />
                        <div className="flex">
                            <select name="hour"
                                value={eventHour}
                                onChange={(e) => setEventHour(Number(e.target.value) as HourFormat)}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                                <option value={12}>12</option>
                            </select>
                            <p>:</p>
                            <select name="minute"
                                value={eventMinute}
                                onChange={(e) => setEventMinute(Number(e.target.value) as MinuteFormat)}
                            >
                                <option value={0}>00</option>
                                <option value={15}>15</option>
                                <option value={30}>30</option>
                                <option value={45}>45</option>
                            </select>
                            <select name="suffix"
                                value={eventSuffix}
                                onChange={(e) => setEventSuffix(e.target.value as SuffixFormat)}
                            >
                                <option value={"AM"}>AM</option>
                                <option value={"PM"}>PM</option>
                            </select>
                        </div>
                    </header>

                    <hr className="mb-2" />

                    {/* Location */}
                    <h3 className="text-lg font-bold">
                        Location:
                    </h3>
                    <input
                        placeholder="Enter location here"
                        className="w-full border border-third rounded px-4 py-2 mb-2"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                    />

                    {/* Description */}
                    <h3 className="text-lg font-bold">
                        Description:
                    </h3>
                    <textarea
                        placeholder="Enter description here"
                        className="grow resize-none w-full border border-third rounded px-4 py-2 mb-2"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                    ></textarea>

                    {/* Invited */}
                    <h3 className="text-lg font-bold">
                        Invitees:
                    </h3>

                    <div className="mb-2">
                        {renderInviteesAsEvent()}
                    </div>

                    <div className="flex mb-4">
                        <input
                            placeholder="example@mail.com"
                            className="resize-none w-full border border-third rounded px-4 py-2"
                            value={inviteInput}
                            onChange={(e) => setInviteInput(e.target.value)}
                        />
                        <button className="border-third border-2 rounded px-2 bg-prime/50 hover:bg-third"
                            onClick={() => inviteUser()}
                        >
                            Add
                        </button>
                    </div>


                    <div className="flex justify-between">
                        <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed mr-2"
                            disabled={getStatus}
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this event?")) {
                                    handleEventMethod("delete");
                                    setSelectedEvent(undefined);
                                }
                            }}
                        >
                            Delete
                        </button>

                        <div>
                            <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed mr-2"
                                onClick={() => { setSelectedEvent(undefined) }}
                                disabled={getStatus}
                            >
                                Close
                            </button>

                            <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={() => {
                                    if (eventTitle) handleEventMethod("create");
                                    else alert("Title cannot be left blank.");
                                }}
                                disabled={getStatus}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
    }


    function displayInvite() {
        const invite = selectedInvite!.event;

        return (
            <div className="h-full flex flex-col">
                <header className="flex justify-between text-xl font-bold mb-2">
                    <h2 className="grow mr-2">
                        {invite.title}
                    </h2>
                    <div className="flex">
                        <p>{invite.time.hour}:{invite.time.minute} {invite.time.suffix}</p>
                    </div>
                </header>

                <hr className="mb-2" />

                {/* Location */}
                <h3 className="text-lg font-bold">
                    Location:
                </h3>
                <input
                    placeholder="No location listed."
                    className="w-full border border-third rounded px-4 py-2 mb-2"
                    defaultValue={invite.location}
                    disabled
                />

                {/* Description */}
                <h3 className="text-lg font-bold">
                    Description:
                </h3>
                <textarea
                    placeholder="No description listed."
                    className="grow resize-none w-full border border-third rounded px-4 py-2 mb-2"
                    defaultValue={invite.description}
                    disabled
                ></textarea>

                {/* Invited */}
                <h3 className="text-lg font-bold">
                    Invitees:
                </h3>

                <div className="mb-2">
                    {renderInviteesAsInvite()}
                </div>

                <div className="flex mb-4">
                    <input
                        placeholder="example@mail.com"
                        className="resize-none w-full border border-third rounded px-4 py-2"
                    />
                    <button className="border-third border-2 rounded px-2 bg-prime/50 hover:bg-third">
                        Add
                    </button>
                </div>


                <div className="flex justify-between">
                    <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed mr-2"
                        disabled
                    >
                        Delete
                    </button>

                    <div>
                        <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed mr-2"
                            onClick={() => { setSelectedInvite(undefined) }}
                        >
                            Close
                        </button>

                        <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    function colorMap(): string {
        if (selectedEvent?.createdBy.id === currentUser?.id) return "border-blue-300";
        else return "border-third/30";
    }

    const eventListProps: EventListProps = {
        getSelectedDate: getSelectedDate,
        currentUser: currentUser,
        userEvents: userEvents,
        userInvites: userInvites,
        setSelectedEvent: (event) => setSelectedEvent(event),
        setSelectedInvite: (invite) => setSelectedInvite(invite)
    }

    return (
        <section className="w-1/2 flex flex-col border-2 border-third rounded-2xl m-2 p-4">
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">
                    {findDay()}, {monthList()[getSelectedDate.month]} {getSelectedDate.day}
                </h1>

                <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 my-2 hover:bg-third"
                    onClick={() => {
                        const newEvent = createEventTemplate(getSelectedDate, currentUser!);
                        setSelectedEvent(newEvent);
                    }}
                >
                    Create Event
                </button>
            </header>

            <div className={`grow border-2 ${colorMap()} rounded-2xl p-4`}>
                {/* Nothing selected */}
                {!selectedEvent && !selectedInvite && <EventList {...eventListProps} />}

                {/* Event selected */}
                {selectedEvent && !selectedInvite && displayEvent()}

                {/* Invite selected */}
                {selectedInvite && !selectedEvent && displayInvite()}
            </div>
        </section>
    )
}