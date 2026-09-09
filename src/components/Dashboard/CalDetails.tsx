import { useEffect, useState } from "react";

import { createEventTemplate, dayList, monthList } from "../../data/Data";
import { addUserToInvite, createInvite, fetchInvites, handleEventDelete, handleEventUpdate, modifyInviteStatus } from "../../service/EventService";
import { fetchUsers } from "../../service/UserService";

import EventList from "./EventList";

import type { Days, HourFormat, MinuteFormat, SuffixFormat } from "../../types/DataTypes";
import type { CalDetailsProps, EventListProps } from "../../types/PropTypes";
import type { Invite, Event, User } from "../../types/ExternalTypes";


export default function CalDetails({ getSelectedDate, currentUser, userEvents, userInvites, userCreatedInvites, getStatus, setStatus }: CalDetailsProps) {

    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
    const [selectedInvite, setSelectedInvite] = useState<Invite | undefined>(undefined);
    // reset selectedEvent and selectedInvite when user changes date.
    useEffect(() => { 
        setSelectedEvent(undefined);
        setSelectedInvite(undefined);
    }, [getSelectedDate])

    // inputs
    const [eventTitle, setEventTitle] = useState<string>();
    const [eventHour, setEventHour] = useState<HourFormat>();
    const [eventMinute, setEventMinute] = useState<MinuteFormat>();
    const [eventSuffix, setEventSuffix] = useState<SuffixFormat>();
    const [eventLocation, setEventLocation] = useState<string>();
    const [eventDescription, setEventDescription] = useState<string>();

    const [inviteInput, setInviteInput] = useState<string>();

    const [borderColor, setBorderColor] = useState<string>(() => colorMapBorder());
    useEffect(() => {
        setBorderColor(colorMapBorder());
    }, [getStatus, getSelectedDate, selectedEvent, selectedInvite, userInvites])

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
        const invite = userCreatedInvites.find((invite) => invite.event.id === selectedEvent!.id)
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
        setStatus(true)

        const allUsers: User[] = await fetchUsers();
        const userFound: User | undefined = allUsers.find((user) => user.email === inviteInput);

        const allInvites: Invite[] = await fetchInvites();
        let inviteFound: Invite | undefined = undefined;
        if (selectedInvite) {
            inviteFound = allInvites.find((invite) => invite.id === selectedInvite.id);
        }
        else if (selectedEvent) {
            inviteFound = allInvites.find((invite) =>
                invite.event.id === selectedEvent.id &&
                invite.event.createdBy.id === selectedEvent.createdBy.id
            );
        }

        console.log("invite", selectedInvite)
        console.log("event", selectedEvent)

        console.log("inviteFound", inviteFound)

        if (userFound) {
            // selection is event
            if (!inviteFound) {
                if (selectedEvent?.createdBy.email === inviteInput) alert("Cannot invite event creator.");

                else await createInvite(selectedEvent!, userFound);
            }
            // selection is invite
            else if (inviteFound) {
                if (inviteFound.invitees.find((invitee) => invitee.id === userFound.id)) {
                    alert("User is already invited!");
                    setInviteInput("");
                    setStatus(false);
                    return;
                }

                if (inviteFound.event.createdBy.email === inviteInput) {
                    alert("Cannot invite event creator.");
                    setInviteInput("");
                    setStatus(false);
                    return
                }

                await addUserToInvite(inviteFound, userFound);
            }
        } else alert("Invalid email address.");

        setInviteInput("");
        setStatus(false);
    }

    async function handleInviteStatus(status: "accepted" | "rejected"): Promise<void> {
        if (!selectedInvite || !currentUser) return;

        setStatus(true);
        try {
            await modifyInviteStatus(selectedInvite, currentUser, status);

            const invites = await fetchInvites();
            const updatedInvite = invites.find((invite) => invite.id === selectedInvite.id);
            setSelectedInvite(updatedInvite);
        } finally {
            setStatus(false);
        }
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
                        {invite.title} : {invite.createdBy.email}
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
                        onClick={async () => handleInviteStatus("rejected")}
                    >
                        Reject
                    </button>

                    <div>
                        <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed mr-2"
                            onClick={() => setSelectedInvite(undefined)}
                        >
                            Close
                        </button>

                        <button className="border-third border-2 rounded-2xl bg-prime/50 px-4 hover:bg-third disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={async () => handleInviteStatus("accepted")}
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    function colorMapBorder(): string {
        // user created event
        if (selectedEvent?.createdBy.id === currentUser?.id) {
            return "border-blue-300";
        }
        // invite pending
        if (selectedInvite?.invitees.find((invitee) => invitee.id === currentUser!.id)?.status === "pending") {
            return "border-yellow-100";
        }
        // invite accepted
        if (selectedInvite?.invitees.find((invitee) => invitee.id === currentUser!.id)?.status === "accepted") {
            return "border-green-300";
        }
        // invite rejected
        if (selectedInvite?.invitees.find((invitee) => invitee.id === currentUser!.id)?.status === "rejected") {
            return "border-red-300";
        }
        // fallback
        else return "border-third/30";
    }

    const eventListProps: EventListProps = {
        getSelectedDate: getSelectedDate,
        currentUser: currentUser,
        userEvents: userEvents,
        userInvites: userInvites,
        setSelectedEvent: (event) => {
            setSelectedInvite(undefined);
            setSelectedEvent(event);
        },
        setSelectedInvite: (invite) => {
            setSelectedEvent(undefined);
            setSelectedInvite(invite);
        }
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

            <div className={`grow border-2 ${borderColor} rounded-2xl p-4`}>
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