import {onNewUser} from "./new_user";
import {onNewEvent} from "./new_event";
import {confirmEventParticipation} from "./confirm_event_participation";
import {initializeApp} from "firebase-admin/app";

initializeApp();

exports.onNewUser = onNewUser;
exports.onNewEvent = onNewEvent;
exports.confirmEventParticipation = confirmEventParticipation;
