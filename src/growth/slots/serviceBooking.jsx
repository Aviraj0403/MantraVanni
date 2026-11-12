import { CalendarCheck } from "lucide-react";
import ServiceList from "../booking/ServiceList";
import BookService from "../booking/BookService";
import MyBookings from "../booking/MyBookings";

/** Service & appointment booking: /book, /book/:serviceId and a "My bookings" account tab (rendered when `serviceBooking` is ON). */
export const slots = {};

export const pages = {
  "serviceBooking:list": ServiceList,
  "serviceBooking:book": BookService,
};

export const profileTabs = [
  { module: "serviceBooking", key: "bookings", label: "My bookings", short: "Bookings", icon: CalendarCheck, Component: MyBookings },
];
