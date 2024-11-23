import {onNewUser} from "./new_user";
import {onNewEvent} from "./new_event";
import {confirmEventParticipation} from "./confirm_event_participation";
import {initializeApp} from "firebase-admin/app";
import {onNewEventParticipation} from "./new_event_participation";
import {onDeletedEventParticipation} from "./deleted_event_participation";

initializeApp();

exports.onNewUser = onNewUser;
exports.onNewEvent = onNewEvent;
exports.confirmEventParticipation = confirmEventParticipation;
exports.onNewEventParticipation = onNewEventParticipation;
exports.onDeletedEventParticipation = onDeletedEventParticipation;
